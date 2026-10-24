"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { MonAmount } from "@/components/catalog/mon-amount";
import { Button, ButtonLink } from "@/components/ui/button";
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
  amountMon: string;
  buyerAddress: `0x${string}`;
  sellerAddress: `0x${string}`;
  status: OrderStatus;
  remainingSeconds: number | null;
  settlementMethod?: "buyer-confirmed" | "seller-timeout-claim";
  transactions: OrderTransactionRecord[];
}

export interface SellerShipmentPanelProps {
  order: SellerOrderRecord;
  shipment: DemoShipmentMetadata | null;
  permissions: OrderCallerPermissions;
  actionState: OrderActionState;
  onSaveOffChainTracking: (trackingRef: string, dispatchNote: string) => void;
  onMarkShipped: (trackingRef: string, dispatchNote: string) => Promise<void>;
  onClaimAfterTimeout: () => Promise<void>;
  onAdjustPreviewSeconds: (seconds: number) => void;
  onResetActionState: () => void;
}

export function SellerShipmentPanel({
  order,
  shipment,
  permissions,
  actionState,
  onSaveOffChainTracking,
  onMarkShipped,
  onClaimAfterTimeout,
  onAdjustPreviewSeconds,
  onResetActionState,
}: SellerShipmentPanelProps) {
  const [trackingInput, setTrackingInput] = useState(
    shipment?.trackingRef ?? generateDemoTrackingRef(order.orderId),
  );
  const [noteInput, setNoteInput] = useState(
    shipment?.dispatchNote ??
      "Handed to Monad Blitz demo runner · Off-chain tracking note",
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
    onSaveOffChainTracking(trackingInput.trim(), noteInput.trim());
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
      await onMarkShipped(trackingInput.trim(), noteInput.trim());
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

  return (
    <div className="space-y-6">
      {/* Selected Order Header & Chain Status */}
      <Surface tone="raised" radius="card" className="p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
              SELECTED ORDER #{order.orderId}
            </span>
            <StatusChip
              label={statusCopy.chipLabel}
              tone={statusCopy.chipTone}
            />
          </div>

          <Link
            href={`/orders/${order.orderId}`}
            className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700 hover:underline"
          >
            Inspect Buyer View (/orders/{order.orderId}) →
          </Link>
        </div>

        <div className="mt-5 grid gap-6 sm:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
              {order.productSku}
            </span>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-ink-950 md:text-3xl">
              {order.productName}
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink-600">
              {statusCopy.supportingCopy}
            </p>

            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-xs">
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
                  OPAQUE ORDER REF
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
              <div className="flex items-center justify-between gap-2">
                <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
                  BUYER PRIVATE ADDRESS
                </dt>
                <dd className="font-mono text-[11px] text-ink-600">
                  Hidden on-chain (off-chain order store only)
                </dd>
              </div>
            </dl>
          </div>

          {/* Escrowed amount & payout state box */}
          <div className="flex flex-col justify-between rounded-[18px] border border-line bg-canvas p-5">
            <div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                ESCROWED PAYOUT AMOUNT
              </span>
              <div className="mt-1.5">
                <MonAmount amount={order.amountMon} size="xl" />
              </div>
            </div>

            <div className="mt-4 border-t border-line pt-3">
              <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                PAYOUT STATE
              </span>
              <p className="mt-1 font-mono text-xs font-semibold text-ink-950">
                {order.status === "completed"
                  ? "RELEASED TO SELLER WALLET"
                  : order.status === "disputed"
                    ? "FROZEN IN CONTRACT (DISPUTED)"
                    : order.status === "shipped" && countdown.isExpired
                      ? "ELIGIBLE FOR SELLER TIMEOUT CLAIM"
                      : "LOCKED UNTIL CONFIRMATION OR 05:00 TIMEOUT"}
              </p>
            </div>
          </div>
        </div>
      </Surface>

      {/* Authorization Gate: Only connected seller experience exposes seller actions */}
      {!isSellerConnected ? (
        <Surface tone="raised" radius="card" className="p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-warning-700">
              SELLER AUTHORIZATION REQUIRED
            </span>
            <StatusChip label="WRONG WALLET FOR SELLER VIEW" tone="warning" />
          </div>
          <p className="mt-4 text-base font-semibold text-ink-950">
            Seller operations are restricted to the recorded seller wallet.
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            <code className="font-mono text-xs">MonVaultEscrow</code> enforces{" "}
            <code className="font-mono text-xs">
              if (msg.sender != order.seller) revert UnauthorizedSeller()
            </code>
            . Switch to the seeded seller wallet (
            <code className="font-mono text-xs">
              {truncateHex(order.sellerAddress, 8, 6)}
            </code>
            ) to enter demo tracking metadata, mark orders shipped, or claim
            after the five-minute review window.
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
                      CONFIRM IN SELLER WALLET
                    </span>
                    <StatusChip label="AWAITING SIGNATURE" tone="violet" />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-ink-950">
                    Sign <code className="font-mono">{actionState.actionName}</code>{" "}
                    in your seller wallet extension…
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
                    Waiting for Monad testnet receipt…
                  </p>
                  <TransactionProof
                    label="SUBMITTED SELLER TX"
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
                      RECEIPT CONFIRMED
                    </span>
                    <StatusChip label="ON-CHAIN STATE UPDATED" tone="success" />
                  </div>
                  <p className="text-sm font-semibold text-ink-950">
                    <code className="font-mono">{actionState.actionName}</code>{" "}
                    confirmed on Monad testnet.
                  </p>
                  <TransactionProof
                    label="CONFIRMED SELLER TX"
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
                      SELLER CALL REVERTED · {actionState.actionName}
                    </span>
                    <StatusChip label="REVERTED ON-CHAIN" tone="danger" />
                  </div>
                  <p className="text-sm font-semibold text-ink-950">
                    {actionState.message}
                  </p>
                  {actionState.txHash ? (
                    <TransactionProof
                      label="REVERTED SELLER TX"
                      hash={actionState.txHash}
                      explorerUrl={actionState.explorerUrl}
                      state="failed"
                    />
                  ) : null}
                  <div>
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={onResetActionState}
                    >
                      Dismiss error
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* STEP 1: Off-Chain Demo Tracking Reference Entry + Mark Shipped Action */}
          <Surface tone="raised" radius="card" className="p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
                  OPERATION 01 · SHIPMENT &amp; OFF-CHAIN TRACKING
                </span>
                <h3 className="mt-1 text-xl font-semibold tracking-[-0.025em] text-ink-950">
                  Record demo tracking reference &amp; call{" "}
                  <code className="font-mono text-lg">markShipped</code>
                </h3>
              </div>
              <StatusChip label="DEMO / OFF-CHAIN TRACKING" tone="info" />
            </div>

            {/* Honest tracking disclaimer required by F5 */}
            <div className="mt-4 rounded-[14px] border border-line bg-muted p-4 text-xs leading-5 text-ink-800">
              <strong className="font-semibold text-ink-950">
                Off-chain boundary:
              </strong>{" "}
              This tracking reference is stored{" "}
              <strong className="font-semibold text-ink-950">
                privately off-chain for the demo
              </strong>{" "}
              and is never written into smart contract calldata or events.
              Entering a tracking number does{" "}
              <strong className="font-semibold text-ink-950">
                not prove physical delivery
              </strong>
              —calling <code className="font-mono">markShipped({order.orderId})</code>{" "}
              simply transitions the contract from <code className="font-mono">PAID</code>{" "}
              to <code className="font-mono">SHIPPED</code> and starts the
              buyer’s 5-minute review window.
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`seller-tracking-ref-${order.orderId}`}
                  className="block font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-800"
                >
                  Demo tracking reference (off-chain)
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id={`seller-tracking-ref-${order.orderId}`}
                    type="text"
                    disabled={isBusy}
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="MV-DEMO-TRK-9002"
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
                    Auto
                  </Button>
                </div>
              </div>

              <div>
                <label
                  htmlFor={`seller-dispatch-note-${order.orderId}`}
                  className="block font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-800"
                >
                  Shipment note (off-chain)
                </label>
                <input
                  id={`seller-dispatch-note-${order.orderId}`}
                  type="text"
                  disabled={isBusy}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Handed to demo courier"
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
                    ? "✓ Saved off-chain tracking"
                    : "Save off-chain tracking note"}
                </Button>
                {shipment ? (
                  <span className="font-mono text-[11px] text-ink-600">
                    Active ref: <strong className="text-ink-950">{shipment.trackingRef}</strong>
                  </span>
                ) : null}
              </div>

              {order.status === "paid" ? (
                <Button
                  variant="primary"
                  size="lg"
                  pending={isBusy}
                  pendingLabel="Confirm markShipped in wallet…"
                  disabled={!permissions.canMarkShipped || !trackingInput.trim()}
                  onClick={handleExecuteMarkShipped}
                >
                  Sign markShipped({order.orderId}) &amp; start 05:00 timer
                </Button>
              ) : (
                <StatusChip
                  label="ALREADY MARKED SHIPPED ON-CHAIN"
                  tone="success"
                />
              )}
            </div>
          </Surface>

          {/* STEP 2: Review Deadline & Seller Timeout Claim Presentation */}
          <Surface tone="raised" radius="card" className="p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
                  OPERATION 02 · REVIEW DEADLINE &amp; PAYOUT CLAIM
                </span>
                <h3 className="mt-1 text-xl font-semibold tracking-[-0.025em] text-ink-950">
                  Five-minute buyer review window &amp;{" "}
                  <code className="font-mono text-lg">claimAfterTimeout</code>
                </h3>
              </div>

              {order.status === "completed" ? (
                <StatusChip label="SELLER PAID" tone="success" />
              ) : order.status === "disputed" ? (
                <StatusChip label="CLAIM BLOCKED BY DISPUTE" tone="danger" />
              ) : order.status === "shipped" && countdown.isExpired ? (
                <StatusChip label="ELIGIBLE TO CLAIM NOW" tone="success" />
              ) : (
                <StatusChip label="NO EARLY PAYOUT ALLOWED" tone="warning" />
              )}
            </div>

            <div className="mt-5 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                  BUYER REVIEW COUNTDOWN (REVIEWENDSAT)
                </p>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="inline-block min-w-[5.5ch] font-mono text-4xl font-semibold tracking-[-0.04em] text-ink-950 tabular-nums">
                    {order.status === "completed"
                      ? "00:00"
                      : order.status === "disputed"
                        ? "HOLD"
                        : countdown.clock}
                  </span>
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
                    {order.status === "paid"
                      ? "STARTS AFTER MARKSHIPPED"
                      : order.status === "disputed"
                        ? "DISPUTED · FUNDS LOCKED"
                        : "MM:SS REMAINING"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink-800">
                  {order.status === "paid"
                    ? "Mark the order shipped first. You cannot withdraw funds from a PAID order."
                    : order.status === "shipped" && !countdown.isExpired
                      ? `Buyer has ${countdown.clock} left to confirm delivery or open a dispute. Seller cannot claim before 00:00.`
                      : order.status === "shipped" && countdown.isExpired
                        ? "The 5-minute review window expired with no buyer dispute. You can now claim the escrowed payment."
                        : order.status === "completed"
                          ? `Escrow settled (${order.amountMon} test MON paid to your seller wallet).`
                          : "Buyer opened a dispute before the deadline; claimAfterTimeout reverts."}
                </p>
              </div>

              {order.status === "shipped" ? (
                <div className="flex flex-col gap-1.5 rounded-[14px] border border-line bg-canvas p-3">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                    DEMO WINDOW SIMULATOR
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => onAdjustPreviewSeconds(272)}
                      className="rounded-lg border border-line bg-surface px-2.5 py-1 font-mono text-[11px] font-semibold text-ink-800 hover:bg-muted cursor-pointer"
                    >
                      Active (04:32)
                    </button>
                    <button
                      type="button"
                      onClick={() => onAdjustPreviewSeconds(0)}
                      className="rounded-lg border border-success-700/30 bg-success-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-success-700 hover:bg-success-700 hover:text-white cursor-pointer"
                    >
                      Expire (00:00 → Unlock Claim)
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Strict Payout Eligibility Gate: Seller cannot see an immediate payout action before contract eligibility */}
            <div className="mt-6 border-t border-line pt-5">
              {order.status === "shipped" && countdown.isExpired ? (
                <div className="flex flex-col justify-between gap-4 rounded-[14px] border-2 border-success-700 bg-success-100/50 p-4 sm:flex-row sm:items-center">
                  <div>
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-success-700">
                      TIMEOUT ELIGIBILITY MET (BLOCK.TIMESTAMP &gt;= REVIEWENDSAT)
                    </span>
                    <p className="mt-1 text-sm font-semibold text-ink-950">
                      Claim {order.amountMon} test MON from undisputed Order #
                      {order.orderId}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    pending={isBusy}
                    pendingLabel="Claiming in wallet…"
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
                      PAYOUT COMPLETE
                    </span>
                    <p className="mt-1 text-sm font-semibold text-ink-950">
                      {order.amountMon} test MON has been released to your
                      seller wallet.
                    </p>
                  </div>
                  <ButtonLink
                    href={`/orders/${order.orderId}`}
                    variant="secondary"
                    size="md"
                  >
                    View receipt on Order #{order.orderId}
                  </ButtonLink>
                </div>
              ) : (
                <div className="rounded-[14px] border border-line bg-canvas p-4 text-xs leading-5 text-ink-600">
                  <strong className="font-semibold text-ink-950">
                    Why no payout button is shown yet:
                  </strong>{" "}
                  {order.status === "paid"
                    ? "The seller cannot withdraw funds before shipping. Call markShipped first to start the 5-minute buyer review window."
                    : order.status === "disputed"
                      ? "This order is DISPUTED. MonVaultEscrow blocks claimAfterTimeout on disputed orders."
                      : "The 5-minute buyer review window is still active. Payout occurs immediately if the buyer confirms delivery, or unlocks here once the timer reaches 00:00 without a dispute."}
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
          <StatusChip label="MONAD TESTNET" tone="info" />
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
