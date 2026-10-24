"use client";

import { useEffect, useState } from "react";
import { MonAmount } from "@/components/catalog/mon-amount";
import { SAMPLE_MONAD_EXPLORER_BASE } from "@/components/checkout/checkout-types";
import { Button, ButtonLink } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";
import { truncateHex } from "@/components/ui/transaction-proof";
import { DEMO_SELLER, demoProducts } from "@/data/catalog";
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

const TX_PAID_1 =
  "0x8a91e04b7d23c91f52b0931a4c601872f490b1d452c7a8d96e3f1b20495a1001" as const;
const TX_SHIPPED_1 =
  "0x4f72c18e9a05d31b64e8207c3b519684e210a9c341b6d7e85f2a0c19384b2002" as const;
const TX_CLAIMED_1 =
  "0x9d31b64e8207c3b519684e210a9c341b6d7e85f2a0c19384b20028a91e04b3003" as const;
const TX_PAID_2 =
  "0x7b14d92e8c03f51a62d8409e1c408573f120b8d452c7a8d96e3f1b20495a2020" as const;
const TX_DISPUTED_3 =
  "0x2c7a8d96e3f1b20495a10018a91e04b7d23c91f52b0931a4c601872f490b4004" as const;
const TX_REVERTED =
  "0x5e19a03c8f42b71d90e6318a4c502983f102c4b563d8e9f07a1b2c3d4e5f6071" as const;

function createInitialOrders(): SellerOrderRecord[] {
  const [headphones, keypad, vaultKey] = demoProducts;

  return [
    {
      orderId: "2",
      orderRef:
        "0x5f9c281074616374696c656d6163726f6b657970616400000000000000000000",
      productName: keypad.name,
      productSku: keypad.sku,
      productSlug: keypad.slug,
      amountMon: keypad.priceMon,
      buyerAddress: BUYER_WALLET,
      sellerAddress: DEMO_SELLER.address,
      status: "paid",
      remainingSeconds: null,
      transactions: [
        {
          label: "01 · ESCROW DEPOSIT (CREATEORDER)",
          txHash: TX_PAID_2,
          explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_PAID_2}`,
          state: "confirmed",
        },
      ],
    },
    {
      orderId: "1",
      orderRef:
        "0x5f9c281073747564696f6865616470686f6e6573000000000000000000000000",
      productName: headphones.name,
      productSku: headphones.sku,
      productSlug: headphones.slug,
      amountMon: headphones.priceMon,
      buyerAddress: BUYER_WALLET,
      sellerAddress: DEMO_SELLER.address,
      status: "shipped",
      remainingSeconds: 272,
      transactions: [
        {
          label: "01 · ESCROW DEPOSIT (CREATEORDER)",
          txHash: TX_PAID_1,
          explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_PAID_1}`,
          state: "confirmed",
        },
        {
          label: "02 · SELLER SHIPMENT (MARKSHIPPED)",
          txHash: TX_SHIPPED_1,
          explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_SHIPPED_1}`,
          state: "confirmed",
        },
      ],
    },
    {
      orderId: "3",
      orderRef:
        "0x5f9c28107661756c746b65797365637572697479746f6b656e00000000000000",
      productName: vaultKey.name,
      productSku: vaultKey.sku,
      productSlug: vaultKey.slug,
      amountMon: vaultKey.priceMon,
      buyerAddress: BUYER_WALLET,
      sellerAddress: DEMO_SELLER.address,
      status: "disputed",
      remainingSeconds: 180,
      transactions: [
        {
          label: "01 · ESCROW DEPOSIT (CREATEORDER)",
          txHash: TX_PAID_1,
          explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_PAID_1}`,
          state: "confirmed",
        },
        {
          label: "02 · SELLER SHIPMENT (MARKSHIPPED)",
          txHash: TX_SHIPPED_1,
          explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_SHIPPED_1}`,
          state: "confirmed",
        },
        {
          label: "03 · BUYER DISPUTE LOCK (OPENDISPUTE)",
          txHash: TX_DISPUTED_3,
          explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_DISPUTED_3}`,
          state: "confirmed",
        },
      ],
    },
  ];
}

type SellerInspectorPreset =
  | "paid-ready-to-ship"
  | "shipped-active-window"
  | "shipped-timeout-claim-ready"
  | "completed-paid"
  | "disputed-frozen"
  | "reverted-claim"
  | "wrong-wallet"
  | "empty-queue";

export function SellerOrdersExperience() {
  const [orders, setOrders] = useState<SellerOrderRecord[]>(createInitialOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("2");
  const [walletRole, setWalletRole] = useState<ConnectedWalletRole>("seller");
  const [isEmptyQueue, setIsEmptyQueue] = useState(false);
  const [actionState, setActionState] = useState<OrderActionState>({
    phase: "idle",
  });
  const [activePreset, setActivePreset] = useState<SellerInspectorPreset>(
    "paid-ready-to-ship",
  );

  const { getShipment, saveShipment } = useDemoShipments();

  // Display countdown ticker for any shipped order
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

  const selectedOrder =
    orders.find((item) => item.orderId === selectedOrderId) ?? orders[0];

  function updateOrder(
    orderId: string,
    updater: (current: SellerOrderRecord) => SellerOrderRecord,
  ) {
    setOrders((prev) =>
      prev.map((item) => (item.orderId === orderId ? updater(item) : item)),
    );
  }

  function applyPreset(preset: SellerInspectorPreset) {
    setActivePreset(preset);
    setActionState({ phase: "idle" });

    switch (preset) {
      case "paid-ready-to-ship": {
        setIsEmptyQueue(false);
        setWalletRole("seller");
        setOrders(createInitialOrders());
        setSelectedOrderId("2");
        break;
      }
      case "shipped-active-window": {
        setIsEmptyQueue(false);
        setWalletRole("seller");
        setOrders(createInitialOrders());
        setSelectedOrderId("1");
        break;
      }
      case "shipped-timeout-claim-ready": {
        setIsEmptyQueue(false);
        setWalletRole("seller");
        const next = createInitialOrders().map((item) =>
          item.orderId === "1" ? { ...item, remainingSeconds: 0 } : item,
        );
        setOrders(next);
        setSelectedOrderId("1");
        break;
      }
      case "completed-paid": {
        setIsEmptyQueue(false);
        setWalletRole("seller");
        const next = createInitialOrders().map((item) =>
          item.orderId === "1"
            ? {
                ...item,
                status: "completed" as const,
                remainingSeconds: 0,
                settlementMethod: "seller-timeout-claim" as const,
                transactions: [
                  ...item.transactions,
                  {
                    label: "03 · SELLER TIMEOUT CLAIM (CLAIMAFTERTIMEOUT)",
                    txHash: TX_CLAIMED_1,
                    explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_CLAIMED_1}`,
                    state: "confirmed" as const,
                  },
                ],
              }
            : item,
        );
        setOrders(next);
        setSelectedOrderId("1");
        break;
      }
      case "disputed-frozen": {
        setIsEmptyQueue(false);
        setWalletRole("seller");
        setOrders(createInitialOrders());
        setSelectedOrderId("3");
        break;
      }
      case "reverted-claim": {
        setIsEmptyQueue(false);
        setWalletRole("seller");
        setOrders(createInitialOrders());
        setSelectedOrderId("1");
        setActionState({
          phase: "failed",
          actionName: "claimAfterTimeout(1)",
          message:
            "MonVaultEscrow reverted with ReviewWindowActive(reviewEndsAt). Seller cannot claim before the 5-minute buyer review window expires.",
          txHash: TX_REVERTED,
          explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_REVERTED}`,
        });
        break;
      }
      case "wrong-wallet": {
        setIsEmptyQueue(false);
        setWalletRole("buyer");
        setOrders(createInitialOrders());
        setSelectedOrderId("2");
        break;
      }
      case "empty-queue": {
        setIsEmptyQueue(true);
        break;
      }
    }
  }

  const permissions: OrderCallerPermissions = {
    connectedRole: walletRole,
    connectedAddress:
      walletRole === "seller" ? DEMO_SELLER.address : BUYER_WALLET,
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

  async function handleMarkShipped(trackingRef: string, dispatchNote: string) {
    if (!selectedOrder) return;

    // 1. Save demo tracking metadata off-chain
    saveShipment({
      orderId: selectedOrder.orderId,
      trackingRef,
      carrierLabel: "Off-Chain Demo Courier (Simulated)",
      dispatchNote,
    });

    // 2. Await seller wallet signature
    setActionState({
      phase: "awaiting-signature",
      actionName: `markShipped(${selectedOrder.orderId})`,
    });
    await new Promise((resolve) => window.setTimeout(resolve, 800));

    // 3. Wait for block receipt
    setActionState({
      phase: "confirming",
      actionName: `markShipped(${selectedOrder.orderId})`,
      txHash: TX_SHIPPED_1,
      explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_SHIPPED_1}`,
    });
    await new Promise((resolve) => window.setTimeout(resolve, 1000));

    // 4. Receipt confirmed -> update status to SHIPPED + start 300s (05:00) timer
    updateOrder(selectedOrder.orderId, (current) => ({
      ...current,
      status: "shipped",
      remainingSeconds: 300,
      transactions: [
        ...current.transactions,
        {
          label: "02 · SELLER SHIPMENT (MARKSHIPPED)",
          txHash: TX_SHIPPED_1,
          explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_SHIPPED_1}`,
          state: "confirmed",
        },
      ],
    }));

    setActionState({
      phase: "confirmed",
      actionName: `markShipped(${selectedOrder.orderId})`,
      txHash: TX_SHIPPED_1,
      explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_SHIPPED_1}`,
    });
  }

  async function handleClaimAfterTimeout() {
    if (!selectedOrder) return;

    setActionState({
      phase: "awaiting-signature",
      actionName: `claimAfterTimeout(${selectedOrder.orderId})`,
    });
    await new Promise((resolve) => window.setTimeout(resolve, 800));

    setActionState({
      phase: "confirming",
      actionName: `claimAfterTimeout(${selectedOrder.orderId})`,
      txHash: TX_CLAIMED_1,
      explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_CLAIMED_1}`,
    });
    await new Promise((resolve) => window.setTimeout(resolve, 1000));

    updateOrder(selectedOrder.orderId, (current) => ({
      ...current,
      status: "completed",
      remainingSeconds: 0,
      settlementMethod: "seller-timeout-claim",
      transactions: [
        ...current.transactions,
        {
          label: "03 · SELLER TIMEOUT CLAIM (CLAIMAFTERTIMEOUT)",
          txHash: TX_CLAIMED_1,
          explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_CLAIMED_1}`,
          state: "confirmed",
        },
      ],
    }));

    setActivePreset("completed-paid");
    setActionState({
      phase: "confirmed",
      actionName: `claimAfterTimeout(${selectedOrder.orderId})`,
      txHash: TX_CLAIMED_1,
      explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_CLAIMED_1}`,
    });
  }

  return (
    <div className="space-y-8">
      {/* Interactive State Inspector Bar for testing all F5 seller states */}
      <Surface tone="muted" radius="card" className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-violet-700">
            SELLER OPERATIONS STATE INSPECTOR (S4 HANDOFF READY)
          </span>
          <span className="font-mono text-[11px] text-ink-600">
            Test markShipped, off-chain tracking, timeout claim, and wrong-wallet gates
          </span>
        </div>

        <div
          role="tablist"
          aria-label="Preview seller operations states"
          className="mt-3 flex flex-wrap gap-2"
        >
          {(
            [
              {
                id: "paid-ready-to-ship",
                label: "1. PAID (Ready to Ship)",
              },
              {
                id: "shipped-active-window",
                label: "2. SHIPPED (04:32 Active)",
              },
              {
                id: "shipped-timeout-claim-ready",
                label: "3. SHIPPED (00:00 Claim Ready)",
              },
              {
                id: "completed-paid",
                label: "4. COMPLETED (Seller Paid)",
              },
              {
                id: "disputed-frozen",
                label: "5. DISPUTED (Claim Blocked)",
              },
              {
                id: "reverted-claim",
                label: "6. Early Claim Reverted",
              },
              {
                id: "wrong-wallet",
                label: "7. Wrong Wallet (Buyer)",
              },
              {
                id: "empty-queue",
                label: "8. Empty Seller Queue",
              },
            ] as Array<{ id: SellerInspectorPreset; label: string }>
          ).map((item) => {
            const isSelected = activePreset === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => applyPreset(item.id)}
                className={`min-h-9 rounded-lg border px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors cursor-pointer ${
                  isSelected
                    ? "border-2 border-violet-600 bg-violet-600 text-white"
                    : "border-line bg-surface text-ink-800 hover:bg-canvas"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </Surface>

      {/* Connected Merchant Identity Strip */}
      <Surface tone="raised" radius="card" className="p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
              MERCHANT ESCROW WORKSPACE
            </span>
            <p className="mt-1 text-lg font-semibold text-ink-950">
              {DEMO_SELLER.name}{" "}
              <code className="ml-1 rounded bg-muted px-2 py-0.5 font-mono text-xs text-ink-800">
                {truncateHex(DEMO_SELLER.address, 10, 8)}
              </code>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {walletRole === "seller" ? (
              <StatusChip label="SELLER WALLET ACTIVE" tone="violet" />
            ) : (
              <StatusChip label="NON-SELLER WALLET" tone="warning" />
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
                ? "Simulate Buyer Wallet"
                : "Reconnect Seller Wallet"}
            </Button>
          </div>
        </div>
      </Surface>

      {/* Empty Queue State */}
      {isEmptyQueue ? (
        <Surface
          tone="raised"
          radius="card"
          className="mx-auto max-w-2xl p-8 text-center md:p-12"
        >
          <div className="flex justify-center">
            <StatusChip label="NO ORDERS FOR THIS SELLER" tone="neutral" />
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-ink-950">
            No escrow orders recorded yet.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base leading-7 text-ink-600">
            When a buyer funds an order in{" "}
            <code className="font-mono text-xs">MonVaultEscrow</code> with your
            seller address, it appears here as <code className="font-mono text-xs">PAID</code>{" "}
            so you can add an off-chain demo tracking number and mark it
            shipped.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              variant="primary"
              size="lg"
              onClick={() => applyPreset("paid-ready-to-ship")}
            >
              Load seeded seller orders
            </Button>
            <ButtonLink href="/shop" variant="secondary" size="lg">
              Open buyer shop
            </ButtonLink>
          </div>
        </Surface>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[0.88fr_1.12fr]">
          {/* Left column: Labelled Seller Order Cards (No horizontal scrolling tables per DESIGN.md section 12) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
                ESCROW ORDERS ({orders.length})
              </span>
              <span className="font-mono text-[11px] text-ink-600">
                Select an order to operate
              </span>
            </div>

            <div className="space-y-3.5">
              {orders.map((order) => {
                const isSelected = order.orderId === selectedOrder.orderId;
                const statusCopy = getOrderStatusCopy(
                  order.status,
                  order.remainingSeconds,
                  order.settlementMethod,
                );
                const countdown = formatReviewCountdown(order.remainingSeconds);
                const storedTracking = getShipment(order.orderId);

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
                      <h3 className="text-xl font-semibold tracking-[-0.025em] text-ink-950">
                        {order.productName}
                      </h3>
                      <MonAmount
                        amount={order.amountMon}
                        size="md"
                        showTestnetTag={false}
                      />
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
                          REVIEW DEADLINE
                        </dt>
                        <dd className="mt-0.5 font-mono font-semibold text-ink-950 tabular-nums">
                          {order.status === "paid"
                            ? "Not started"
                            : order.status === "completed"
                              ? "Settled"
                              : order.status === "disputed"
                                ? "Frozen"
                                : countdown.clock}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-3 flex items-center justify-between rounded-lg bg-canvas px-3 py-1.5 font-mono text-[11px] text-ink-600">
                      <span>
                        Off-chain ref:{" "}
                        {storedTracking
                          ? storedTracking.trackingRef
                          : "Not logged"}
                      </span>
                      <span className="font-semibold text-violet-700">
                        {isSelected ? "Selected ●" : "Manage →"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right column: Selected Order Shipment & Timeout Claim Panel */}
          {selectedOrder ? (
            <SellerShipmentPanel
              key={selectedOrder.orderId}
              order={selectedOrder}
              shipment={getShipment(selectedOrder.orderId)}
              permissions={permissions}
              actionState={actionState}
              onSaveOffChainTracking={(trackingRef, dispatchNote) =>
                saveShipment({
                  orderId: selectedOrder.orderId,
                  trackingRef,
                  carrierLabel: "Off-Chain Demo Courier (Simulated)",
                  dispatchNote,
                })
              }
              onMarkShipped={handleMarkShipped}
              onClaimAfterTimeout={handleClaimAfterTimeout}
              onAdjustPreviewSeconds={(seconds) =>
                updateOrder(selectedOrder.orderId, (curr) => ({
                  ...curr,
                  remainingSeconds: seconds,
                }))
              }
              onResetActionState={() => setActionState({ phase: "idle" })}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
