"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MonAmount } from "@/components/catalog/mon-amount";
import { SellerIdentity } from "@/components/catalog/seller-identity";
import { SAMPLE_MONAD_EXPLORER_BASE } from "@/components/checkout/checkout-types";
import { Button, ButtonLink } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";
import {
  TransactionProof,
  truncateHex,
} from "@/components/ui/transaction-proof";
import type { OrderRecordRow } from "@/lib/db/orders-repository";
import { useDemoShipments } from "@/lib/orders/demo-tracking-store";
import {
  getOrderStatusCopy,
  type OrderActionState,
  type OrderCallerPermissions,
  type OrderStatus,
  type OrderTransactionRecord,
} from "@/lib/orders/presentation";
import { BuyerDecisionPanels } from "./buyer-decision-panels";
import { EscrowTimeline } from "./escrow-timeline";
import { ReviewCountdownCard } from "./review-countdown-card";

const TX_SETTLED =
  "0x9d31b64e8207c3b519684e210a9c341b6d7e85f2a0c19384b20028a91e04b3003" as const;
const TX_DISPUTED =
  "0x2c7a8d96e3f1b20495a10018a91e04b7d23c91f52b0931a4c601872f490b4004" as const;

export interface OrderTrackingExperienceProps {
  initialOrders: OrderRecordRow[];
  initialOrderId?: string;
}

const LEGACY_MAP: Record<string, string> = {
  "1": "101",
  "2": "102",
  "3": "104",
};

export function OrderTrackingExperience({
  initialOrders,
  initialOrderId,
}: OrderTrackingExperienceProps) {
  const mappedInitialId = initialOrderId
    ? (LEGACY_MAP[initialOrderId] ?? initialOrderId)
    : (initialOrders[0]?.orderId ?? "101");

  const [orders, setOrders] = useState<OrderRecordRow[]>(initialOrders);
  const [selectedOrderId, setSelectedOrderId] =
    useState<string>(mappedInitialId);
  const [lookupInput, setLookupInput] = useState("");
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [actionState, setActionState] = useState<OrderActionState>({
    phase: "idle",
  });

  const { getShipment } = useDemoShipments();

  const activeOrder = useMemo(
    () => orders.find((item) => item.orderId === selectedOrderId) ?? null,
    [orders, selectedOrderId],
  );

  // Real-time 1s review countdown ticker while active order is in SHIPPED state
  useEffect(() => {
    if (!activeOrder || activeOrder.status !== "shipped") return;
    if (
      activeOrder.reviewEndsAtSeconds === null ||
      activeOrder.reviewEndsAtSeconds <= 0
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setOrders((prev) =>
        prev.map((order) => {
          if (
            order.orderId !== activeOrder.orderId ||
            order.status !== "shipped" ||
            order.reviewEndsAtSeconds === null ||
            order.reviewEndsAtSeconds <= 0
          ) {
            return order;
          }
          return {
            ...order,
            reviewEndsAtSeconds: Math.max(0, order.reviewEndsAtSeconds - 1),
          };
        }),
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activeOrder]);

  function handleLookupSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = lookupInput.trim().replace(/^#/, "").toLowerCase();
    if (!query) {
      setLookupError(null);
      return;
    }

    const mappedQuery = LEGACY_MAP[query] ?? query;
    const match = orders.find(
      (item) =>
        item.orderId.toLowerCase() === mappedQuery ||
        item.orderRef.toLowerCase() === query ||
        item.orderRef.toLowerCase().includes(query) ||
        item.productName.toLowerCase().includes(query) ||
        (item.trackingNumber &&
          item.trackingNumber.toLowerCase().includes(query)),
    );

    if (!match) {
      setLookupError(
        `No escrow order found matching "${lookupInput.trim()}". Check your Order ID, order reference hash, or tracking number.`,
      );
      return;
    }

    setLookupError(null);
    setActionState({ phase: "idle" });
    setSelectedOrderId(match.orderId);
  }

  function handleSelectOrder(orderId: string) {
    setLookupError(null);
    setActionState({ phase: "idle" });
    setSelectedOrderId(orderId);
  }

  async function handleConfirmDelivery() {
    if (!activeOrder) return;
    const orderId = activeOrder.orderId;

    setActionState({
      phase: "awaiting-signature",
      actionName: `confirmDelivery(${orderId})`,
    });
    await new Promise((resolve) => window.setTimeout(resolve, 700));

    setActionState({
      phase: "confirming",
      actionName: `confirmDelivery(${orderId})`,
      txHash: TX_SETTLED,
      explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_SETTLED}`,
    });
    await new Promise((resolve) => window.setTimeout(resolve, 900));

    const newTx: OrderTransactionRecord = {
      label: "03 · BUYER RELEASE (CONFIRMDELIVERY)",
      txHash: TX_SETTLED,
      explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_SETTLED}`,
      state: "confirmed",
    };

    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId
          ? {
              ...order,
              status: "completed" as OrderStatus,
              settlementMethod: "buyer-confirmed",
              reviewEndsAtSeconds: 0,
              transactions: [
                ...order.transactions.filter(
                  (t) => !t.label.startsWith("03 ·"),
                ),
                newTx,
              ],
            }
          : order,
      ),
    );

    setActionState({
      phase: "confirmed",
      actionName: `confirmDelivery(${orderId})`,
      txHash: TX_SETTLED,
      explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_SETTLED}`,
    });
  }

  async function handleOpenDispute() {
    if (!activeOrder) return;
    const orderId = activeOrder.orderId;

    setActionState({
      phase: "awaiting-signature",
      actionName: `openDispute(${orderId})`,
    });
    await new Promise((resolve) => window.setTimeout(resolve, 700));

    setActionState({
      phase: "confirming",
      actionName: `openDispute(${orderId})`,
      txHash: TX_DISPUTED,
      explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_DISPUTED}`,
    });
    await new Promise((resolve) => window.setTimeout(resolve, 900));

    const newTx: OrderTransactionRecord = {
      label: "03 · BUYER DISPUTE LOCK (OPENDISPUTE)",
      txHash: TX_DISPUTED,
      explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_DISPUTED}`,
      state: "confirmed",
    };

    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId
          ? {
              ...order,
              status: "disputed" as OrderStatus,
              settlementMethod: undefined,
              transactions: [
                ...order.transactions.filter(
                  (t) => !t.label.startsWith("03 ·"),
                ),
                newTx,
              ],
            }
          : order,
      ),
    );

    setActionState({
      phase: "confirmed",
      actionName: `openDispute(${orderId})`,
      txHash: TX_DISPUTED,
      explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_DISPUTED}`,
    });
  }

  const storedShipment = activeOrder
    ? getShipment(activeOrder.orderId)
    : undefined;
  const effectiveTracking =
    activeOrder?.status === "paid"
      ? null
      : storedShipment
        ? `${storedShipment.carrierLabel} · ${storedShipment.trackingRef}`
        : activeOrder?.demoTrackingRef ?? null;

  const isReviewWindowOpen =
    activeOrder?.reviewEndsAtSeconds === null ||
    (activeOrder?.reviewEndsAtSeconds ?? 0) > 0;

  const permissions: OrderCallerPermissions = {
    connectedRole: "buyer",
    connectedAddress: activeOrder?.buyerAddress,
    canConfirmDelivery: activeOrder?.status === "shipped",
    canOpenDispute:
      activeOrder?.status === "paid" ||
      (activeOrder?.status === "shipped" && isReviewWindowOpen),
    canMarkShipped: false,
    canClaimAfterTimeout: false,
  };

  const statusCopy = activeOrder
    ? getOrderStatusCopy(
        activeOrder.status,
        activeOrder.reviewEndsAtSeconds,
        activeOrder.settlementMethod,
      )
    : null;

  return (
    <div className="space-y-8">
      {/* Order Lookup Form & Connected Buyer Wallet Orders */}
      <Surface tone="raised" radius="card" className="p-6 md:p-7">
        <div className="flex flex-col justify-between gap-4 border-b border-line pb-5 lg:flex-row lg:items-center">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
              REAL-TIME ESCROW ORDER LOOKUP
            </span>
            <h2 className="mt-1 text-xl font-semibold tracking-[-0.025em] text-ink-950">
              Search by Order ID, Reference Hash, or Tracking Number
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl border border-line bg-canvas px-3.5 py-2 font-mono text-xs text-ink-800">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-success-700"
            />
            <span>Buyer Wallet:</span>
            <strong className="font-semibold text-ink-950">
              {truncateHex(
                orders[0]?.buyerAddress ??
                  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                6,
                4,
              )}
            </strong>
          </div>
        </div>

        {/* Lookup Form */}
        <form
          onSubmit={handleLookupSubmit}
          className="mt-5 flex flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="order-lookup-input" className="sr-only">
            Order ID, order reference hash, or tracking number
          </label>
          <input
            id="order-lookup-input"
            type="search"
            value={lookupInput}
            onChange={(e) => {
              setLookupInput(e.target.value);
              if (lookupError) setLookupError(null);
            }}
            placeholder="Enter Order ID (e.g. #101, #102), 0x orderRef hash, or carrier tracking number…"
            className="min-h-11 flex-1 rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink-950 placeholder:text-ink-600/70 focus:border-violet-600 focus:outline-none"
          />
          <Button type="submit" variant="primary" size="md">
            Look up Order
          </Button>
        </form>

        {lookupError ? (
          <div className="mt-3 rounded-xl border border-danger-700/30 bg-danger-100 px-4 py-3 text-xs font-medium text-danger-700">
            {lookupError}
          </div>
        ) : null}

        {/* Orders Linked to Connected Wallet */}
        <div className="mt-5 border-t border-line pt-4">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
            ORDERS LINKED TO YOUR WALLET ({orders.length})
          </p>
          <div
            role="tablist"
            aria-label="Orders linked to your wallet"
            className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {orders.map((item) => {
              const isSelected = item.orderId === activeOrder?.orderId;
              return (
                <button
                  key={item.orderId}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleSelectOrder(item.orderId)}
                  className={`flex flex-col justify-between rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-2 border-violet-600 bg-canvas shadow-[0_10px_24px_rgba(103,56,242,0.08)]"
                      : "border-line bg-canvas/70 hover:border-ink-950/30 hover:bg-canvas"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-ink-950 tabular-nums">
                      Order #{item.orderId}
                    </span>
                    <StatusChip
                      label={item.status.toUpperCase()}
                      tone={
                        item.status === "completed"
                          ? "success"
                          : item.status === "disputed"
                            ? "danger"
                            : item.status === "shipped"
                              ? "warning"
                              : "violet"
                      }
                    />
                  </div>
                  <p className="mt-2 line-clamp-1 text-sm font-semibold text-ink-950">
                    {item.productName}
                  </p>
                  <div className="mt-2 flex items-center justify-between border-t border-line/70 pt-2 font-mono text-xs">
                    <span className="font-semibold text-violet-700 tabular-nums">
                      {item.amountMon} MON
                    </span>
                    <span className="text-[11px] text-ink-600">
                      {item.carrier ?? "Awaiting ship"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Surface>

      {/* Active Order View */}
      {!activeOrder || !statusCopy ? (
        <Surface
          tone="raised"
          radius="card"
          className="mx-auto max-w-2xl p-8 text-center md:p-12"
        >
          <StatusChip label="ORDER NOT FOUND" tone="danger" />
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-ink-950">
            Order #{selectedOrderId} was not found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-600">
            Select one of your wallet orders above or browse the shop to place a
            new escrow-protected order.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => handleSelectOrder(orders[0]?.orderId ?? "101")}
            >
              View Order #{orders[0]?.orderId ?? "101"}
            </Button>
            <ButtonLink href="/shop" variant="secondary" size="md">
              Go to Shop
            </ButtonLink>
          </div>
        </Surface>
      ) : (
        <>
          {/* Order Status Header Card */}
          <Surface tone="raised" radius="card" className="p-6 md:p-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <StatusChip
                    label={statusCopy.chipLabel}
                    tone={statusCopy.chipTone}
                  />
                  <span className="rounded-full border border-line bg-canvas px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-800 tabular-nums">
                    ORDER #{activeOrder.orderId}
                  </span>
                  <span className="font-mono text-xs text-ink-600">
                    REF: {truncateHex(activeOrder.orderRef, 10, 6)}
                  </span>
                </div>

                <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink-950 md:text-4xl">
                  {statusCopy.primaryCopy}
                </h1>
                <p className="mt-2.5 max-w-2xl text-base leading-7 text-ink-600">
                  {statusCopy.supportingCopy}
                </p>
              </div>

              <div className="shrink-0 rounded-[18px] border border-line bg-canvas p-5 lg:min-w-[250px]">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                  ESCROWED AMOUNT
                </span>
                <div className="mt-1.5">
                  <MonAmount amount={activeOrder.amountMon} size="xl" />
                </div>
                <p className="mt-2 font-mono text-[11px] text-ink-600">
                  {activeOrder.status === "completed"
                    ? "Released from escrow to seller"
                    : activeOrder.status === "disputed"
                      ? "Frozen inside MonVaultEscrow"
                      : "Locked in MonVaultEscrow contract"}
                </p>
              </div>
            </div>
          </Surface>

          {/* 4-Stage Transparent Order Progress Timeline */}
          <EscrowTimeline
            status={activeOrder.status}
            remainingSeconds={activeOrder.reviewEndsAtSeconds}
            nextPermittedActor={statusCopy.nextPermittedActor}
            nextPermittedActionSummary={statusCopy.nextPermittedActionSummary}
            trackingReference={effectiveTracking}
          />

          {/* Two-Column Operational View: Buyer Actions + Shipment & On-Chain Proof */}
          <div className="grid items-start gap-8 lg:grid-cols-[1.12fr_0.88fr]">
            {/* Left Column: Buyer Escrow Actions + Review Countdown */}
            <div className="space-y-6">
              <BuyerDecisionPanels
                orderId={activeOrder.orderId}
                amountMon={activeOrder.amountMon}
                buyerAddress={activeOrder.buyerAddress}
                sellerName={activeOrder.sellerName}
                sellerAddress={activeOrder.sellerAddress}
                status={activeOrder.status}
                remainingSeconds={activeOrder.reviewEndsAtSeconds}
                permissions={permissions}
                actionState={actionState}
                onConfirmDelivery={handleConfirmDelivery}
                onOpenDispute={handleOpenDispute}
                onResetActionState={() => setActionState({ phase: "idle" })}
              />

              <ReviewCountdownCard
                status={activeOrder.status}
                remainingSeconds={activeOrder.reviewEndsAtSeconds}
              />
            </div>

            {/* Right Column: Shipment & Carrier Details + On-Chain Transaction Proof */}
            <div className="space-y-6">
              {/* Order Item & Carrier Shipment Details */}
              <Surface tone="raised" radius="card" className="p-6 md:p-7">
                <div className="flex items-center justify-between gap-2 border-b border-line pb-4">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
                    ORDER ITEM &amp; SHIPMENT TRACKING
                  </span>
                  <StatusChip
                    label={
                      effectiveTracking ? "CARRIER ASSIGNED" : "PREPARING"
                    }
                    tone={effectiveTracking ? "info" : "neutral"}
                  />
                </div>

                <div className="mt-5 flex items-center gap-4">
                  <div className="w-24 shrink-0 overflow-hidden rounded-[12px] border border-line bg-muted/50 p-2">
                    <Image
                      src={activeOrder.productImageSrc}
                      alt={activeOrder.productImageAlt}
                      width={160}
                      height={120}
                      className="aspect-[4/3] h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-violet-700">
                      {activeOrder.productSku}
                    </span>
                    <h3 className="text-lg font-semibold text-ink-950">
                      <Link
                        href={`/products/${activeOrder.productSlug}`}
                        className="hover:text-violet-700"
                      >
                        {activeOrder.productName}
                      </Link>
                    </h3>
                    <MonAmount amount={activeOrder.amountMon} size="sm" />
                  </div>
                </div>

                <dl className="mt-5 space-y-3 border-t border-line pt-4 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
                      CARRIER &amp; TRACKING NUMBER
                    </dt>
                    <dd className="font-mono font-semibold text-ink-950">
                      {effectiveTracking ?? "Awaiting seller dispatch"}
                    </dd>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
                      BUYER WALLET
                    </dt>
                    <dd className="font-mono text-ink-800">
                      {truncateHex(activeOrder.buyerAddress, 8, 6)}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
                      DELIVERY DESTINATION (PRIVATE OFF-CHAIN)
                    </dt>
                    <dd className="mt-1 rounded-lg border border-line bg-canvas px-3 py-2 text-ink-800">
                      {activeOrder.privateDeliverySummary}
                    </dd>
                  </div>
                </dl>

                <SellerIdentity
                  name={activeOrder.sellerName}
                  address={activeOrder.sellerAddress}
                  className="mt-5"
                />
              </Surface>

              {/* On-chain transaction evidence */}
              <Surface tone="raised" radius="card" className="p-6 md:p-7">
                <div className="flex items-center justify-between gap-2 border-b border-line pb-4">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
                    ON-CHAIN TRANSACTION EVIDENCE
                  </span>
                  <StatusChip label="MONAD EXPLORER" tone="info" />
                </div>

                <div className="mt-5 space-y-3.5">
                  {activeOrder.transactions.map((tx) => (
                    <TransactionProof
                      key={tx.label}
                      label={tx.label}
                      hash={tx.txHash}
                      explorerUrl={tx.explorerUrl}
                      state={tx.state}
                    />
                  ))}
                </div>
              </Surface>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
