"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { MonAmount } from "@/components/catalog/mon-amount";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";
import {
  TransactionProof,
  truncateHex,
} from "@/components/ui/transaction-proof";
import {
  type DemoShipmentMetadata,
  generateDemoTrackingRef,
} from "@/lib/orders/demo-tracking-store";
import {
  formatReviewCountdown,
  getOrderStatusCopy,
  type OrderActionState,
  type OrderCallerPermissions,
  type OrderStatus,
  type OrderTransactionRecord,
} from "@/lib/orders/presentation";

export interface SellerOrderRecord {
  orderId: string;
  orderRef: `0x${string}`;
  productName: string;
  productSku: string;
  productSlug: string;
  productImageSrc?: string;
  amountMon: string;
  buyerAddress: `0x${string}`;
  sellerAddress: `0x${string}`;
  status: OrderStatus;
  carrier: string | null;
  trackingNumber: string | null;
  deliverySummary?: string;
  remainingSeconds: number | null;
  settlementMethod?: "buyer-confirmed" | "seller-timeout-claim";
  transactions: OrderTransactionRecord[];
}

export interface SellerShipmentPanelProps {
  order: SellerOrderRecord;
  shipment: DemoShipmentMetadata | null;
  permissions: OrderCallerPermissions;
  actionState: OrderActionState;
  onSaveOffChainTracking: (
    carrier: string,
    trackingRef: string,
    dispatchNote: string,
  ) => void;
  onMarkShipped: (
    carrier: string,
    trackingRef: string,
    dispatchNote: string,
  ) => Promise<void>;
  onClaimAfterTimeout: () => Promise<void>;
  onResetActionState: () => void;
}

const CARRIER_OPTIONS = [
  "DHL Express",
  "FedEx International Priority",
  "UPS Express Saver",
  "Aras Kargo Priority",
];

export function SellerShipmentPanel({
  order,
  shipment,
  permissions,
  actionState,
  onSaveOffChainTracking,
  onMarkShipped,
  onClaimAfterTimeout,
  onResetActionState,
}: SellerShipmentPanelProps) {
  const [carrierInput, setCarrierInput] = useState(
    shipment?.carrierLabel || order.carrier || CARRIER_OPTIONS[0],
  );
  const [trackingInput, setTrackingInput] = useState(
    shipment?.trackingRef ||
      order.trackingNumber ||
      generateDemoTrackingRef(order.orderId),
  );
  const [noteInput, setNoteInput] = useState(
    shipment?.dispatchNote ||
      "Dispatched from Ankara Precision Lab fulfillment center",
  );
  const [savedNotice, setSavedNotice] = useState(false);
  const inFlightRef = useRef(false);

  const isBusy =
    actionState.phase === "awaiting-signature" ||
    actionState.phase === "confirming";
  const isSellerConnected = permissions.connectedRole === "seller";
  const countdown = formatReviewCountdown(order.remainingSeconds);
  const statusCopy = getOrderStatusCopy(
    order.status,
    order.remainingSeconds,
    order.settlementMethod,
  );

  function handleSaveDraftOnly() {
    if (!trackingInput.trim()) return;
    onSaveOffChainTracking(
      carrierInput.trim(),
      trackingInput.trim(),
      noteInput.trim(),
    );
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2000);
  }

  async function handleExecuteMarkShipped() {
    if (
      inFlightRef.current ||
      isBusy ||
      !permissions.canMarkShipped ||
      !trackingInput.trim()
    ) {
      return;
    }
    inFlightRef.current = true;
    try {
      await onMarkShipped(
        carrierInput.trim(),
        trackingInput.trim(),
        noteInput.trim(),
      );
    } finally {
      inFlightRef.current = false;
    }
  }

  async function handleExecuteTimeoutClaim() {
    if (inFlightRef.current || isBusy || !permissions.canClaimAfterTimeout) {
      return;
    }
    inFlightRef.current = true;
    try {
      await onClaimAfterTimeout();
    } finally {
      inFlightRef.current = false;
    }
  }

  const activeTrackingNumber = shipment?.trackingRef || order.trackingNumber;
  const activeCarrier = shipment?.carrierLabel || order.carrier;

  return (
    <div className="space-y-6">
      {/* Selected Order Header & Chain Status */}
      <Surface tone="raised" radius="card" className="p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
              ORDER #{order.orderId} · POSTGRESQL RECORD
            </span>
            <StatusChip
              label={statusCopy.chipLabel}
              tone={statusCopy.chipTone}
            />
          </div>

          <span className="font-mono text-xs text-ink-600">
            SKU: <strong className="text-ink-950">{order.productSku}</strong>
          </span>
        </div>

        <div className="mt-5 grid gap-6 sm:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex items-start gap-4">
              {order.productImageSrc ? (
                <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border border-line bg-canvas p-2">
                  <Image
                    src={order.productImageSrc}
                    alt={order.productName}
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                </div>
              ) : null}
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink-950">
                  {order.productName}
                </h2>
                <p className="mt-1.5 text-sm leading-6 text-ink-600">
                  {statusCopy.supportingCopy}
                </p>
              </div>
            </div>

            <dl className="mt-5 space-y-2.5 border-t border-line pt-4 text-xs">
              <div className="flex items-center justify-between gap-2">
                <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
                  BUYER WALLET
                </dt>
                <dd>
                  <code
                    title={order.buyerAddress}
                    className="font-mono text-ink-950"
                  >
                    {truncateHex(order.buyerAddress, 8, 6)}
                  </code>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
                  ON-CHAIN ORDER REF
                </dt>
                <dd>
                  <code
                    title={order.orderRef}
                    className="font-mono text-ink-800"
                  >
                    {truncateHex(order.orderRef, 10, 6)}
                  </code>
                </dd>
              </div>
              {order.deliverySummary ? (
                <div className="flex flex-col justify-between gap-1 rounded-xl border border-line bg-canvas p-3 sm:flex-row sm:items-center">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-600">
                    FULFILLMENT DESTINATION (OFF-CHAIN DB)
                  </dt>
                  <dd className="font-medium text-ink-950">
                    {order.deliverySummary}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          {/* Escrowed amount & payout state box */}
          <div className="flex flex-col justify-between rounded-[18px] border border-line bg-canvas p-5">
            <div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                ESCROWED ORDER PAYOUT
              </span>
              <div className="mt-1.5">
                <MonAmount amount={order.amountMon} size="xl" />
              </div>
            </div>

            <div className="mt-4 border-t border-line pt-3">
              <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                SETTLEMENT STATUS
              </span>
              <p className="mt-1 font-mono text-xs font-semibold text-ink-950">
                {order.status === "completed"
                  ? "RELEASED TO MERCHANT WALLET"
                  : order.status === "disputed"
                    ? "FROZEN IN CONTRACT (DISPUTED)"
                    : order.status === "shipped" && countdown.isExpired
                      ? "ELIGIBLE FOR TIMEOUT CLAIM"
                      : "LOCKED IN MONVAULTESCROW"}
              </p>
            </div>
          </div>
        </div>
      </Surface>

      {/* Authorization Gate: Only authorized seller wallet can interact with seller management actions */}
      {!isSellerConnected ? (
        <Surface tone="raised" radius="card" className="p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-warning-700">
              MERCHANT AUTHORIZATION REQUIRED
            </span>
            <StatusChip label="UNAUTHORIZED WALLET CONNECTED" tone="warning" />
          </div>
          <p className="mt-4 text-base font-semibold text-ink-950">
            Order fulfillment and settlement actions are restricted to the
            authorized merchant wallet.
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            Both PostgreSQL fulfillment endpoints and{" "}
            <code className="font-mono text-xs">MonVaultEscrow</code> enforce{" "}
            <code className="font-mono text-xs">
              if (msg.sender != order.seller) revert UnauthorizedSeller()
            </code>
            . Connect the authorized merchant wallet (
            <code className="font-mono text-xs">
              {truncateHex(order.sellerAddress, 8, 6)}
            </code>
            ) above to dispatch shipments or claim timeout payouts.
          </p>
        </Surface>
      ) : (
        <>
          {/* Live write transaction feedback */}
          {actionState.phase !== "idle" ? (
            <div aria-live="polite">
              {actionState.phase === "awaiting-signature" ? (
                <div className="rounded-[18px] border border-violet-600 bg-lilac-150/70 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
                      CONFIRM IN MERCHANT WALLET
                    </span>
                    <StatusChip label="AWAITING SIGNATURE" tone="violet" />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-ink-950">
                    Sign <code className="font-mono">{actionState.actionName}</code>{" "}
                    in your connected merchant wallet…
                  </p>
                </div>
              ) : null}

              {actionState.phase === "confirming" ? (
                <div className="space-y-3 rounded-[18px] border border-warning-700/30 bg-warning-100/70 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-warning-700">
                      WAITING FOR BLOCK RECEIPT
                    </span>
                    <StatusChip label="CONFIRMING ON-CHAIN" tone="warning" />
                  </div>
                  <p className="text-sm font-semibold text-ink-950">
                    Submitted{" "}
                    <code className="font-mono">{actionState.actionName}</code>.
                    Waiting for Monad block confirmation…
                  </p>
                  <TransactionProof
                    label="SUBMITTED MERCHANT TX"
                    hash={actionState.txHash}
                    explorerUrl={actionState.explorerUrl}
                    state="pending"
                  />
                </div>
              ) : null}

              {actionState.phase === "confirmed" ? (
                <div className="space-y-3 rounded-[18px] border border-success-700/30 bg-success-100/70 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-success-700">
                      ON-CHAIN &amp; DATABASE UPDATED
                    </span>
                    <StatusChip label="CONFIRMED" tone="success" />
                  </div>
                  <p className="text-sm font-semibold text-ink-950">
                    <code className="font-mono">{actionState.actionName}</code>{" "}
                    confirmed on Monad and synced to PostgreSQL.
                  </p>
                  <TransactionProof
                    label="CONFIRMED MERCHANT TX"
                    hash={actionState.txHash}
                    explorerUrl={actionState.explorerUrl}
                    state="confirmed"
                  />
                </div>
              ) : null}

              {actionState.phase === "failed" ? (
                <div className="space-y-3 rounded-[18px] border border-danger-700/30 bg-danger-100 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-danger-700">
                      TRANSACTION REVERTED · {actionState.actionName}
                    </span>
                    <StatusChip label="REVERTED" tone="danger" />
                  </div>
                  <p className="text-sm font-semibold text-ink-950">
                    {actionState.message}
                  </p>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={onResetActionState}
                  >
                    Dismiss error
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* STEP 1: Order Fulfillment & On-Chain Shipment */}
          <Surface tone="raised" radius="card" className="p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
                  FULFILLMENT &amp; ON-CHAIN DISPATCH
                </span>
                <h3 className="mt-1 text-xl font-semibold tracking-[-0.025em] text-ink-950">
                  Enter carrier &amp; tracking reference, then dispatch{" "}
                  <code className="font-mono text-lg">
                    markShipped({order.orderId})
                  </code>
                </h3>
              </div>
              <StatusChip label="OFF-CHAIN CARRIER METADATA" tone="info" />
            </div>

            <div className="mt-4 rounded-[14px] border border-line bg-muted p-4 text-xs leading-5 text-ink-800">
              <strong className="font-semibold text-ink-950">
                Privacy &amp; Escrow Boundary:
              </strong>{" "}
              Carrier and tracking details are saved in the off-chain PostgreSQL
              database and synced to the buyer’s{" "}
              <code className="font-mono">/track</code> page—never exposed on
              the public blockchain. Calling{" "}
              <code className="font-mono">markShipped({order.orderId})</code>{" "}
              transitions the smart contract from <code className="font-mono">PAID</code>{" "}
              to <code className="font-mono">SHIPPED</code> and starts the
              buyer’s review period.
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div>
                <label
                  htmlFor={`seller-carrier-${order.orderId}`}
                  className="block font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-800"
                >
                  Shipping Carrier
                </label>
                <select
                  id={`seller-carrier-${order.orderId}`}
                  disabled={isBusy}
                  value={carrierInput}
                  onChange={(e) => setCarrierInput(e.target.value)}
                  className="mt-2 w-full min-h-11 rounded-[12px] border border-line bg-canvas px-3.5 py-2 text-xs font-medium text-ink-950"
                >
                  {CARRIER_OPTIONS.map((carrier) => (
                    <option key={carrier} value={carrier}>
                      {carrier}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor={`seller-tracking-ref-${order.orderId}`}
                  className="block font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-800"
                >
                  Tracking Reference
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id={`seller-tracking-ref-${order.orderId}`}
                    type="text"
                    disabled={isBusy}
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="DHL-TR-8849201"
                    className="w-full min-h-11 rounded-[12px] border border-line bg-canvas px-3.5 py-2 font-mono text-xs text-ink-950"
                  />
                  <Button
                    variant="secondary"
                    size="md"
                    disabled={isBusy}
                    onClick={() =>
                      setTrackingInput(generateDemoTrackingRef(order.orderId))
                    }
                  >
                    Gen
                  </Button>
                </div>
              </div>

              <div>
                <label
                  htmlFor={`seller-dispatch-note-${order.orderId}`}
                  className="block font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-800"
                >
                  Fulfillment Note
                </label>
                <input
                  id={`seller-dispatch-note-${order.orderId}`}
                  type="text"
                  disabled={isBusy}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Dispatched from warehouse"
                  className="mt-2 w-full min-h-11 rounded-[12px] border border-line bg-canvas px-3.5 py-2 text-xs text-ink-950"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  size="md"
                  disabled={isBusy || !trackingInput.trim()}
                  onClick={handleSaveDraftOnly}
                >
                  {savedNotice
                    ? "✓ Saved tracking to database"
                    : "Update tracking details"}
                </Button>
                {activeTrackingNumber ? (
                  <span className="font-mono text-[11px] text-ink-600">
                    Recorded:{" "}
                    <strong className="text-ink-950">
                      {activeCarrier ? `${activeCarrier} · ` : ""}
                      {activeTrackingNumber}
                    </strong>
                  </span>
                ) : null}
              </div>

              {order.status === "paid" ? (
                <Button
                  variant="primary"
                  size="lg"
                  pending={isBusy}
                  pendingLabel="Confirming markShipped in wallet…"
                  disabled={!permissions.canMarkShipped || !trackingInput.trim()}
                  onClick={handleExecuteMarkShipped}
                >
                  Dispatch &amp; Call markShipped({order.orderId})
                </Button>
              ) : (
                <StatusChip
                  label="SHIPMENT DISPATCHED ON-CHAIN"
                  tone="success"
                />
              )}
            </div>
          </Surface>

          {/* STEP 2: Settlement & Timeout Claim */}
          <Surface tone="raised" radius="card" className="p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
                  SETTLEMENT &amp; TIMEOUT CLAIM
                </span>
                <h3 className="mt-1 text-xl font-semibold tracking-[-0.025em] text-ink-950">
                  Buyer review period &amp;{" "}
                  <code className="font-mono text-lg">
                    claimAfterTimeout({order.orderId})
                  </code>
                </h3>
              </div>

              {order.status === "completed" ? (
                <StatusChip label="SETTLED · FUNDS RELEASED" tone="success" />
              ) : order.status === "disputed" ? (
                <StatusChip label="FROZEN BY BUYER DISPUTE" tone="danger" />
              ) : order.status === "shipped" && countdown.isExpired ? (
                <StatusChip label="READY FOR TIMEOUT CLAIM" tone="success" />
              ) : (
                <StatusChip label="AWAITING BUYER CONFIRMATION" tone="warning" />
              )}
            </div>

            <div className="mt-5 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                  REVIEW WINDOW STATUS (REVIEWENDSAT)
                </p>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="inline-block min-w-[5.5ch] font-mono text-4xl font-semibold tracking-[-0.04em] text-ink-950 tabular-nums">
                    {order.status === "completed"
                      ? "PAID"
                      : order.status === "disputed"
                        ? "HOLD"
                        : countdown.clock}
                  </span>
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
                    {order.status === "paid"
                      ? "STARTS WHEN MARKSHIPPED CONFIRMS"
                      : order.status === "completed"
                        ? order.settlementMethod === "seller-timeout-claim"
                          ? "CLAIMED VIA CLAIMAFTERTIMEOUT"
                          : "RELEASED BY BUYER CONFIRMATION"
                        : order.status === "disputed"
                          ? "DISPUTED · ESCROW FROZEN"
                          : countdown.isExpired
                            ? "REVIEW PERIOD EXPIRED WITHOUT DISPUTE"
                            : "REMAINING IN BUYER REVIEW WINDOW"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink-800">
                  {order.status === "paid"
                    ? "Dispatch the order first. Escrowed funds remain locked while the order is awaiting fulfillment."
                    : order.status === "shipped" && !countdown.isExpired
                      ? `Buyer has ${countdown.clock} remaining to confirm receipt or open a dispute. If the buyer confirms receipt, ${order.amountMon} MON releases immediately.`
                      : order.status === "shipped" && countdown.isExpired
                        ? "The buyer review period has expired with no dispute filed. You are now eligible to call claimAfterTimeout to release the escrowed funds."
                        : order.status === "completed"
                          ? `Settlement complete: ${order.amountMon} MON has been transferred from MonVaultEscrow to your merchant wallet.`
                          : "The buyer opened a dispute during the review window. Funds remain locked in the smart contract."}
                </p>
              </div>
            </div>

            {/* Strict Payout Eligibility Gate */}
            <div className="mt-6 border-t border-line pt-5">
              {order.status === "shipped" && countdown.isExpired ? (
                <div className="flex flex-col justify-between gap-4 rounded-[14px] border-2 border-success-700 bg-success-100/50 p-4 sm:flex-row sm:items-center">
                  <div>
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-success-700">
                      TIMEOUT ELIGIBILITY MET (BLOCK.TIMESTAMP &gt;= REVIEWENDSAT)
                    </span>
                    <p className="mt-1 text-sm font-semibold text-ink-950">
                      Claim {order.amountMon} MON from undisputed Order #
                      {order.orderId}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    pending={isBusy}
                    pendingLabel="Claiming payout in wallet…"
                    disabled={!permissions.canClaimAfterTimeout || isBusy}
                    onClick={handleExecuteTimeoutClaim}
                  >
                    Sign claimAfterTimeout({order.orderId})
                  </Button>
                </div>
              ) : order.status === "completed" ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-success-700/30 bg-success-100/60 p-4">
                  <div>
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-success-700">
                      ESCROW PAYOUT RELEASED
                    </span>
                    <p className="mt-1 text-sm font-semibold text-ink-950">
                      {order.amountMon} MON has been settled to merchant wallet{" "}
                      <code className="font-mono text-xs">
                        {truncateHex(order.sellerAddress, 8, 6)}
                      </code>
                      .
                    </p>
                  </div>
                  <StatusChip
                    label={
                      order.settlementMethod === "seller-timeout-claim"
                        ? "SETTLED VIA TIMEOUT CLAIM"
                        : "BUYER CONFIRMED RECEIPT"
                    }
                    tone="success"
                  />
                </div>
              ) : (
                <div className="rounded-[14px] border border-line bg-canvas p-4 text-xs leading-5 text-ink-600">
                  <strong className="font-semibold text-ink-950">
                    Smart Contract Settlement Rule:
                  </strong>{" "}
                  {order.status === "paid"
                    ? "Sellers cannot withdraw funds from a PAID order before shipping. Dispatch the order with markShipped(orderId) first."
                    : order.status === "disputed"
                      ? "This order is DISPUTED. MonVaultEscrow blocks claimAfterTimeout on disputed orders."
                      : "The buyer review period is currently active. Payout occurs automatically when the buyer calls confirmDelivery(orderId), or unlocks here via claimAfterTimeout(orderId) once the review period expires without a dispute."}
                </div>
              )}
            </div>
          </Surface>
        </>
      )}

      {/* Transaction Proof History for Selected Order */}
      <Surface tone="raised" radius="card" className="p-6 md:p-8">
        <div className="flex items-center justify-between gap-2 border-b border-line pb-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
            ON-CHAIN TRANSACTION LEDGER · ORDER #{order.orderId}
          </span>
          <StatusChip label="MONAD ESCROW EVENTS" tone="info" />
        </div>
        <div className="mt-5 space-y-3">
          {order.transactions.map((tx) => (
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
  );
}
