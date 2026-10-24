"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { MonAmount } from "@/components/catalog/mon-amount";
import { SAMPLE_MONAD_EXPLORER_BASE } from "@/components/checkout/checkout-types";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";
import { truncateHex } from "@/components/ui/transaction-proof";
import { DEMO_SELLER, type DemoProduct } from "@/data/catalog";
import type { OrderRecordRow } from "@/lib/db/orders-repository";
import { useDemoShipments } from "@/lib/orders/demo-tracking-store";
import {
  type ConnectedWalletRole,
  formatReviewCountdown,
  getOrderStatusCopy,
  type OrderActionState,
  type OrderCallerPermissions,
} from "@/lib/orders/presentation";
import {
  type SellerOrderRecord,
  SellerShipmentPanel,
} from "./seller-shipment-panel";

const BUYER_WALLET =
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" as `0x${string}`;

const TX_SHIPPED_NEW =
  "0x4f72c18e9a05d31b64e8207c3b519684e210a9c341b6d7e85f2a0c19384b2099" as const;
const TX_CLAIMED_NEW =
  "0x9d31b64e8207c3b519684e210a9c341b6d7e85f2a0c19384b20028a91e04b3099" as const;

function mapDbRowToSellerRecord(row: OrderRecordRow): SellerOrderRecord {
  return {
    orderId: row.orderId,
    orderRef: row.orderRef,
    productName: row.productName,
    productSku: row.productSku,
    productSlug: row.productSlug,
    productImageSrc: row.productImageSrc,
    amountMon: row.amountMon,
    buyerAddress: row.buyerAddress,
    sellerAddress: row.sellerAddress,
    status: row.status,
    carrier: row.carrier,
    trackingNumber: row.trackingNumber,
    deliverySummary: row.privateDeliverySummary ?? undefined,
    remainingSeconds: row.reviewEndsAtSeconds,
    settlementMethod: row.settlementMethod,
    transactions: row.transactions,
  };
}

type MerchantFilterTab =
  | "all"
  | "awaiting-fulfillment"
  | "shipped-claims"
  | "settled-disputed"
  | "inventory";

export interface SellerOrdersExperienceProps {
  initialOrders: OrderRecordRow[];
  initialProducts?: DemoProduct[];
}

export function SellerOrdersExperience({
  initialOrders,
  initialProducts = [],
}: SellerOrdersExperienceProps) {
  const [orders, setOrders] = useState<SellerOrderRecord[]>(() =>
    initialOrders.map(mapDbRowToSellerRecord),
  );
  // Default to the first PAID order waiting for fulfillment (#102), or fallback to first order
  const [selectedOrderId, setSelectedOrderId] = useState<string>(() => {
    const firstPaid = initialOrders.find((o) => o.status === "paid");
    return firstPaid?.orderId ?? initialOrders[0]?.orderId ?? "102";
  });
  const [activeTab, setActiveTab] = useState<MerchantFilterTab>("all");
  const [walletRole, setWalletRole] = useState<ConnectedWalletRole>("seller");
  const [actionState, setActionState] = useState<OrderActionState>({
    phase: "idle",
  });

  const { getShipment, saveShipment } = useDemoShipments();

  // Live countdown ticker for shipped orders in the active review window
  useEffect(() => {
    const interval = window.setInterval(() => {
      setOrders((prev) =>
        prev.map((order) => {
          if (
            order.status !== "shipped" ||
            order.remainingSeconds === null ||
            order.remainingSeconds <= 0
          ) {
            return order;
          }
          return {
            ...order,
            remainingSeconds: order.remainingSeconds - 1,
          };
        }),
      );
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const filteredOrders = useMemo(() => {
    switch (activeTab) {
      case "awaiting-fulfillment":
        return orders.filter((o) => o.status === "paid");
      case "shipped-claims":
        return orders.filter((o) => o.status === "shipped");
      case "settled-disputed":
        return orders.filter(
          (o) => o.status === "completed" || o.status === "disputed",
        );
      default:
        return orders;
    }
  }, [orders, activeTab]);

  const selectedOrder =
    filteredOrders.find((item) => item.orderId === selectedOrderId) ??
    filteredOrders[0] ??
    orders.find((item) => item.orderId === selectedOrderId) ??
    orders[0];

  // Summary metrics across PostgreSQL orders
  const metrics = useMemo(() => {
    const paidOrders = orders.filter((o) => o.status === "paid");
    const shippedOrders = orders.filter((o) => o.status === "shipped");
    const claimReadyOrders = shippedOrders.filter(
      (o) => o.remainingSeconds !== null && o.remainingSeconds <= 0,
    );
    const completedOrders = orders.filter((o) => o.status === "completed");
    const settledMon = completedOrders.reduce(
      (acc, o) => acc + Number.parseFloat(o.amountMon || "0"),
      0,
    );
    const totalStock = initialProducts.reduce((acc, p) => acc + p.stock, 0);

    return {
      paidCount: paidOrders.length,
      shippedCount: shippedOrders.length,
      claimReadyCount: claimReadyOrders.length,
      completedCount: completedOrders.length,
      settledMon: settledMon.toFixed(2),
      productCount: initialProducts.length,
      totalStock,
    };
  }, [orders, initialProducts]);

  function updateOrder(
    orderId: string,
    updater: (current: SellerOrderRecord) => SellerOrderRecord,
  ) {
    setOrders((prev) =>
      prev.map((item) => (item.orderId === orderId ? updater(item) : item)),
    );
  }

  const connectedWalletAddress =
    walletRole === "seller" ? DEMO_SELLER.address : BUYER_WALLET;

  const permissions: OrderCallerPermissions = {
    connectedRole: walletRole,
    connectedAddress: connectedWalletAddress,
    canConfirmDelivery: false,
    canOpenDispute: false,
    canMarkShipped:
      walletRole === "seller" && selectedOrder?.status === "paid",
    canClaimAfterTimeout:
      walletRole === "seller" &&
      selectedOrder?.status === "shipped" &&
      selectedOrder.remainingSeconds !== null &&
      selectedOrder.remainingSeconds <= 0,
  };

  async function handleSaveTrackingDetails(
    carrier: string,
    trackingRef: string,
    dispatchNote: string,
  ) {
    if (!selectedOrder) return;

    saveShipment({
      orderId: selectedOrder.orderId,
      trackingRef,
      carrierLabel: carrier,
      dispatchNote,
    });

    updateOrder(selectedOrder.orderId, (current) => ({
      ...current,
      carrier,
      trackingNumber: trackingRef,
    }));

    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.orderId,
          sellerAddress: connectedWalletAddress,
          carrier,
          trackingNumber: trackingRef,
        }),
      });
    } catch {
      // Local state and shipment store already updated
    }
  }

  async function handleMarkShipped(
    carrier: string,
    trackingRef: string,
    dispatchNote: string,
  ) {
    if (!selectedOrder) return;

    // 1. Save carrier & tracking metadata to off-chain store
    saveShipment({
      orderId: selectedOrder.orderId,
      trackingRef,
      carrierLabel: carrier,
      dispatchNote,
    });

    // 2. Request seller wallet signature for markShipped(orderId)
    setActionState({
      phase: "awaiting-signature",
      actionName: `markShipped(${selectedOrder.orderId})`,
    });
    await new Promise((resolve) => window.setTimeout(resolve, 750));

    // 3. Wait for Monad block confirmation
    const newTx = {
      label: "02 · SELLER SHIPMENT (MARKSHIPPED)",
      txHash: TX_SHIPPED_NEW,
      explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_SHIPPED_NEW}`,
      state: "confirmed" as const,
    };

    setActionState({
      phase: "confirming",
      actionName: `markShipped(${selectedOrder.orderId})`,
      txHash: TX_SHIPPED_NEW,
      explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_SHIPPED_NEW}`,
    });
    await new Promise((resolve) => window.setTimeout(resolve, 900));

    // 4. Sync fulfillment to shared PostgreSQL database (/api/orders)
    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.orderId,
          sellerAddress: connectedWalletAddress,
          carrier,
          trackingNumber: trackingRef,
          status: "shipped",
          reviewEndsAtSeconds: 300,
          newTransaction: newTx,
        }),
      });
    } catch {
      // Proceed with local update if offline
    }

    // 5. Update UI state to SHIPPED with 300s (05:00) review period
    updateOrder(selectedOrder.orderId, (current) => ({
      ...current,
      status: "shipped",
      carrier,
      trackingNumber: trackingRef,
      remainingSeconds: 300,
      transactions: [...current.transactions, newTx],
    }));

    setActionState({
      phase: "confirmed",
      actionName: `markShipped(${selectedOrder.orderId})`,
      txHash: TX_SHIPPED_NEW,
      explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_SHIPPED_NEW}`,
    });
  }

  async function handleClaimAfterTimeout() {
    if (!selectedOrder) return;

    setActionState({
      phase: "awaiting-signature",
      actionName: `claimAfterTimeout(${selectedOrder.orderId})`,
    });
    await new Promise((resolve) => window.setTimeout(resolve, 750));

    const claimTx = {
      label: "03 · SELLER TIMEOUT CLAIM (CLAIMAFTERTIMEOUT)",
      txHash: TX_CLAIMED_NEW,
      explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_CLAIMED_NEW}`,
      state: "confirmed" as const,
    };

    setActionState({
      phase: "confirming",
      actionName: `claimAfterTimeout(${selectedOrder.orderId})`,
      txHash: TX_CLAIMED_NEW,
      explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_CLAIMED_NEW}`,
    });
    await new Promise((resolve) => window.setTimeout(resolve, 900));

    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.orderId,
          sellerAddress: connectedWalletAddress,
          status: "completed",
          reviewEndsAtSeconds: 0,
          settlementMethod: "seller-timeout-claim",
          newTransaction: claimTx,
        }),
      });
    } catch {
      // Proceed with local update if offline
    }

    updateOrder(selectedOrder.orderId, (current) => ({
      ...current,
      status: "completed",
      remainingSeconds: 0,
      settlementMethod: "seller-timeout-claim",
      transactions: [...current.transactions, claimTx],
    }));

    setActionState({
      phase: "confirmed",
      actionName: `claimAfterTimeout(${selectedOrder.orderId})`,
      txHash: TX_CLAIMED_NEW,
      explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_CLAIMED_NEW}`,
    });
  }

  return (
    <div className="space-y-8">
      {/* Merchant Operations Summary KPI Strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Surface tone="raised" radius="card" className="p-5">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
            AWAITING FULFILLMENT
          </span>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="font-mono text-3xl font-semibold tracking-[-0.04em] text-ink-950 tabular-nums">
              {metrics.paidCount}
            </span>
            <StatusChip label="PAID IN ESCROW" tone="info" />
          </div>
          <p className="mt-1.5 text-xs text-ink-600">
            Ready for carrier tracking &amp; <code className="font-mono">markShipped</code>
          </p>
        </Surface>

        <Surface tone="raised" radius="card" className="p-5">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
            SHIPPED &amp; TIMEOUT CLAIMS
          </span>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="font-mono text-3xl font-semibold tracking-[-0.04em] text-ink-950 tabular-nums">
              {metrics.shippedCount}
            </span>
            {metrics.claimReadyCount > 0 ? (
              <StatusChip
                label={`${metrics.claimReadyCount} CLAIM READY`}
                tone="success"
              />
            ) : (
              <StatusChip label="IN REVIEW" tone="violet" />
            )}
          </div>
          <p className="mt-1.5 text-xs text-ink-600">
            {metrics.claimReadyCount > 0
              ? `${metrics.claimReadyCount} expired window ready for claimAfterTimeout`
              : "Active 5-minute buyer review window"}
          </p>
        </Surface>

        <Surface tone="raised" radius="card" className="p-5">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
            SETTLED ESCROW REVENUE
          </span>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="font-mono text-3xl font-semibold tracking-[-0.04em] text-ink-950 tabular-nums">
              {metrics.settledMon} <span className="text-base">MON</span>
            </span>
            <StatusChip
              label={`${metrics.completedCount} COMPLETED`}
              tone="success"
            />
          </div>
          <p className="mt-1.5 text-xs text-ink-600">
            Released to merchant wallet on Monad
          </p>
        </Surface>

        <Surface tone="raised" radius="card" className="p-5">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
            POSTGRESQL INVENTORY
          </span>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="font-mono text-3xl font-semibold tracking-[-0.04em] text-ink-950 tabular-nums">
              {metrics.productCount} <span className="text-base">SKUs</span>
            </span>
            <StatusChip label={`${metrics.totalStock} IN STOCK`} tone="violet" />
          </div>
          <p className="mt-1.5 text-xs text-ink-600">
            Synced with live customer storefront
          </p>
        </Surface>
      </div>

      {/* Connected Merchant Wallet & Authorization Bar */}
      <Surface tone="raised" radius="card" className="p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
              CONNECTED MERCHANT WALLET SESSION
            </span>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <p className="text-lg font-semibold text-ink-950">
                {walletRole === "seller"
                  ? DEMO_SELLER.name
                  : "Non-Merchant Wallet"}
              </p>
              <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-ink-800">
                {truncateHex(connectedWalletAddress, 10, 8)}
              </code>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {walletRole === "seller" ? (
              <StatusChip label="AUTHORIZED SELLER WALLET" tone="success" />
            ) : (
              <StatusChip label="UNAUTHORIZED WALLET" tone="warning" />
            )}
            <Button
              variant="secondary"
              size="md"
              onClick={() =>
                setWalletRole((prev) =>
                  prev === "seller" ? "buyer" : "seller",
                )
              }
            >
              {walletRole === "seller"
                ? "Switch Wallet Account"
                : "Connect Merchant Wallet"}
            </Button>
          </div>
        </div>
      </Surface>

      {/* Merchant Portal Section Tabs */}
      <div
        role="tablist"
        aria-label="Merchant workspace views"
        className="flex flex-wrap gap-2 border-b border-line pb-4"
      >
        {(
          [
            {
              id: "all",
              label: `All Escrow Orders (${orders.length})`,
            },
            {
              id: "awaiting-fulfillment",
              label: `Awaiting Fulfillment (${metrics.paidCount})`,
            },
            {
              id: "shipped-claims",
              label: `In Transit & Timeout Claims (${metrics.shippedCount})`,
            },
            {
              id: "settled-disputed",
              label: `Completed & Disputed (${
                orders.filter(
                  (o) => o.status === "completed" || o.status === "disputed",
                ).length
              })`,
            },
            {
              id: "inventory",
              label: `Catalog Inventory (${initialProducts.length})`,
            },
          ] as Array<{ id: MerchantFilterTab; label: string }>
        ).map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-10 rounded-xl border px-4 py-2 font-sans text-xs font-semibold transition-colors cursor-pointer ${
                isSelected
                  ? "border-ink-950 bg-ink-950 text-white"
                  : "border-line bg-surface text-ink-800 hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Inventory Tab View */}
      {activeTab === "inventory" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink-950">
                PostgreSQL Product Inventory
              </h2>
              <p className="text-sm text-ink-600">
                Products managed under seller address{" "}
                <code className="font-mono text-xs">{DEMO_SELLER.address}</code>
              </p>
            </div>
            <StatusChip label="SHARED POSTGRESQL CATALOG" tone="violet" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {initialProducts.map((product) => (
              <Surface
                key={product.slug}
                tone="raised"
                radius="card"
                className="flex flex-col justify-between p-5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-violet-700">
                      {product.sku}
                    </span>
                    <StatusChip
                      label={`${product.stock} in stock`}
                      tone={product.stock <= 7 ? "warning" : "success"}
                    />
                  </div>
                  <div className="relative my-4 h-32 w-full overflow-hidden rounded-xl border border-line bg-canvas p-3">
                    <Image
                      src={product.imageSrc}
                      alt={product.imageAlt}
                      fill
                      sizes="240px"
                      className="object-contain p-2"
                    />
                  </div>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                    {product.category}
                  </span>
                  <h3 className="mt-1 text-base font-semibold text-ink-950">
                    {product.name}
                  </h3>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                  <MonAmount amount={product.priceMon} size="md" />
                  <span className="font-mono text-xs text-ink-600">
                    ★ {product.rating.toFixed(1)}
                  </span>
                </div>
              </Surface>
            ))}
          </div>
        </div>
      ) : (
        /* Order Fulfillment & Settlement Operations Split View */
        <div className="grid items-start gap-8 lg:grid-cols-[0.88fr_1.12fr]">
          {/* Left column: Seller Order Queue Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
                MERCHANT ORDER QUEUE ({filteredOrders.length})
              </span>
              <span className="font-mono text-[11px] text-ink-600">
                Select an order to fulfill or settle
              </span>
            </div>

            <div className="space-y-3.5">
              {filteredOrders.map((order) => {
                const isSelected = order.orderId === selectedOrder?.orderId;
                const statusCopy = getOrderStatusCopy(
                  order.status,
                  order.remainingSeconds,
                  order.settlementMethod,
                );
                const countdown = formatReviewCountdown(order.remainingSeconds);
                const storedTracking = getShipment(order.orderId);
                const activeTracking =
                  storedTracking?.trackingRef || order.trackingNumber;
                const activeCarrier =
                  storedTracking?.carrierLabel || order.carrier;

                return (
                  <button
                    key={order.orderId}
                    type="button"
                    onClick={() => {
                      setSelectedOrderId(order.orderId);
                      setActionState({ phase: "idle" });
                    }}
                    className={`w-full rounded-[22px] p-5 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "border-2 border-violet-600 bg-surface shadow-[0_16px_40px_rgba(16,11,43,0.07)]"
                        : "border border-line bg-surface/80 hover:bg-surface"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700 tabular-nums">
                        ORDER #{order.orderId} · {order.productSku}
                      </span>
                      <StatusChip
                        label={statusCopy.chipLabel}
                        tone={statusCopy.chipTone}
                      />
                    </div>

                    <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-lg font-semibold tracking-[-0.025em] text-ink-950">
                        {order.productName}
                      </h3>
                      <MonAmount amount={order.amountMon} size="md" />
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-line pt-3 text-xs">
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-600">
                          BUYER WALLET
                        </dt>
                        <dd className="mt-0.5 font-mono text-ink-800">
                          {truncateHex(order.buyerAddress, 6, 4)}
                        </dd>
                      </div>
                      <div className="text-right">
                        <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-600">
                          REVIEW / SETTLEMENT
                        </dt>
                        <dd className="mt-0.5 font-mono font-semibold text-ink-950 tabular-nums">
                          {order.status === "paid"
                            ? "Awaiting Dispatch"
                            : order.status === "completed"
                              ? "Settled"
                              : order.status === "disputed"
                                ? "Frozen"
                                : countdown.isExpired
                                  ? "00:00 · Claim Ready"
                                  : countdown.clock}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-3 flex items-center justify-between rounded-lg bg-canvas px-3 py-1.5 font-mono text-[11px] text-ink-600">
                      <span className="truncate pr-2">
                        Tracking:{" "}
                        {activeTracking
                          ? `${activeCarrier ? `${activeCarrier} · ` : ""}${activeTracking}`
                          : "Pending fulfillment"}
                      </span>
                      <span className="shrink-0 font-semibold text-violet-700">
                        {isSelected ? "Active ●" : "Manage →"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right column: Selected Order Fulfillment & Settlement Panel */}
          {selectedOrder ? (
            <SellerShipmentPanel
              key={selectedOrder.orderId}
              order={selectedOrder}
              shipment={getShipment(selectedOrder.orderId)}
              permissions={permissions}
              actionState={actionState}
              onSaveOffChainTracking={handleSaveTrackingDetails}
              onMarkShipped={handleMarkShipped}
              onClaimAfterTimeout={handleClaimAfterTimeout}
              onResetActionState={() => setActionState({ phase: "idle" })}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
