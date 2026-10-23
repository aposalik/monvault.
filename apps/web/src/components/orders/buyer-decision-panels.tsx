"use client";

import { useRef, useState } from "react";
import { MonAmount } from "@/components/catalog/mon-amount";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";
import {
  TransactionProof,
  truncateHex,
} from "@/components/ui/transaction-proof";
import type {
  OrderActionState,
  OrderCallerPermissions,
  OrderStatus,
} from "@/lib/orders/presentation";

export interface BuyerDecisionPanelsProps {
  orderId: string;
  amountMon: string;
  buyerAddress: `0x${string}`;
  sellerName: string;
  sellerAddress: `0x${string}`;
  status: OrderStatus;
  remainingSeconds: number | null;
  permissions: OrderCallerPermissions;
  actionState: OrderActionState;
  onConfirmDelivery: () => Promise<void>;
  onOpenDispute: () => Promise<void>;
  onResetActionState: () => void;
}

type ConfirmationModalChoice = "confirm-delivery" | "open-dispute" | null;

export function BuyerDecisionPanels({
  orderId,
  amountMon,
  buyerAddress,
  sellerName,
  sellerAddress,
  status,
  remainingSeconds,
  permissions,
  actionState,
  onConfirmDelivery,
  onOpenDispute,
  onResetActionState,
}: BuyerDecisionPanelsProps) {
  const [selectedIntent, setSelectedIntent] =
    useState<ConfirmationModalChoice>(null);
  const inFlightLockRef = useRef(false);

  const isBusy =
    actionState.phase === "awaiting-signature" ||
    actionState.phase === "confirming";
  const isExpired = remainingSeconds !== null && remainingSeconds <= 0;

  async function executeIntent(intent: "confirm-delivery" | "open-dispute") {
    if (inFlightLockRef.current || isBusy) return;
    inFlightLockRef.current = true;
    try {
      if (intent === "confirm-delivery") {
        await onConfirmDelivery();
      } else {
        await onOpenDispute();
      }
      setSelectedIntent(null);
    } finally {
      inFlightLockRef.current = false;
    }
  }

  return (
    <Surface tone="raised" radius="card" className="p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
            BUYER ESCROW ACTIONS · ORDER #{orderId}
          </span>
          <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-ink-950">
            Delivery confirmation &amp; dispute controls
          </h2>
        </div>

        {permissions.connectedRole === "buyer" ? (
          <StatusChip label="BUYER WALLET CONNECTED" tone="violet" />
        ) : permissions.connectedRole === "disconnected" ? (
          <StatusChip label="WALLET DISCONNECTED" tone="neutral" />
        ) : (
          <StatusChip label="WRONG WALLET FOR BUYER ACTIONS" tone="warning" />
        )}
      </div>

      {/* Wrong-wallet / disconnected banner */}
      {permissions.connectedRole !== "buyer" ? (
        <div className="mt-5 rounded-[14px] border border-warning-700/30 bg-warning-100 p-4">
          <p className="text-sm font-semibold text-ink-950">
            {permissions.connectedRole === "disconnected"
              ? "No wallet connected."
              : permissions.connectedRole === "seller"
                ? "You are connected with the Seller wallet."
                : "You are connected with a non-buyer wallet."}
          </p>
          <p className="mt-1 text-xs leading-5 text-ink-800">
            <code className="font-mono">MonVaultEscrow</code> enforces{" "}
            <code className="font-mono">
              if (msg.sender != order.buyer) revert UnauthorizedBuyer()
            </code>
            . Only the recorded buyer wallet (
            <code className="font-mono">{truncateHex(buyerAddress, 8, 6)}</code>
            ) can confirm delivery or open a dispute for Order #{orderId}.
          </p>
        </div>
      ) : null}

      {/* Live write transaction feedback (never claims success before receipt) */}
      <div className="mt-5 space-y-4" aria-live="polite">
        {actionState.phase === "awaiting-signature" ? (
          <div className="rounded-[14px] border border-violet-600 bg-lilac-150/70 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
                CONFIRM IN WALLET
              </span>
              <StatusChip label="AWAITING SIGNATURE" tone="violet" />
            </div>
            <p className="mt-2 text-sm font-semibold text-ink-950">
              Approve <code className="font-mono">{actionState.actionName}</code>{" "}
              in your buyer wallet extension…
            </p>
          </div>
        ) : null}

        {actionState.phase === "confirming" ? (
          <div className="space-y-3 rounded-[14px] border border-warning-700/30 bg-warning-100/70 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-warning-700">
                WAITING FOR BLOCK RECEIPT
              </span>
              <StatusChip label="CONFIRMING ON-CHAIN" tone="warning" />
            </div>
            <p className="text-sm font-semibold text-ink-950">
              Submitted <code className="font-mono">{actionState.actionName}</code>
              . Waiting for Monad testnet receipt before updating order status…
            </p>
            <TransactionProof
              label="PENDING TRANSACTION"
              hash={actionState.txHash}
              explorerUrl={actionState.explorerUrl}
              state="pending"
            />
          </div>
        ) : null}

        {actionState.phase === "confirmed" ? (
          <div className="space-y-3 rounded-[14px] border border-success-700/30 bg-success-100/70 p-4">
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
              label="CONFIRMED TRANSACTION"
              hash={actionState.txHash}
              explorerUrl={actionState.explorerUrl}
              state="confirmed"
            />
          </div>
        ) : null}

        {actionState.phase === "failed" ? (
          <div className="space-y-3 rounded-[14px] border border-danger-700/30 bg-danger-100 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-danger-700">
                TRANSACTION FAILED · {actionState.actionName}
              </span>
              <StatusChip label="NO STATE CHANGE" tone="danger" />
            </div>
            <p className="text-sm font-semibold text-ink-950">
              {actionState.message}
            </p>
            {actionState.txHash ? (
              <TransactionProof
                label="REVERTED CALL EVIDENCE"
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

      {/* First-class side-by-side Confirm Delivery and Open Dispute cards (Open Dispute is never hidden in overflow) */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* 1. Confirm Delivery Card */}
        <div className="flex flex-col justify-between rounded-[18px] border border-line bg-canvas p-5">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-success-700">
                ACTION 01 · RELEASE ESCROW
              </span>
              <code className="font-mono text-[11px] text-ink-600">
                confirmDelivery
              </code>
            </div>
            <h3 className="mt-2 text-lg font-semibold text-ink-950">
              Confirm delivery &amp; pay seller
            </h3>
            <p className="mt-1.5 text-xs leading-5 text-ink-600">
              {status === "paid"
                ? "Unavailable until the seller marks the order shipped on-chain."
                : status === "completed"
                  ? "Delivery is already confirmed and the seller has been paid."
                  : status === "disputed"
                    ? "Unavailable because this order is frozen in DISPUTED state."
                    : `Immediately releases ${amountMon} test MON from escrow to ${sellerName}.`}
            </p>
          </div>

          <div className="mt-5">
            <Button
              variant="primary"
              size="md"
              disabled={!permissions.canConfirmDelivery || isBusy}
              onClick={() => setSelectedIntent("confirm-delivery")}
              className="w-full"
            >
              Confirm delivery
            </Button>
          </div>
        </div>

        {/* 2. Open Dispute Card — Always first-class visible per DESIGN.md section 12 */}
        <div className="flex flex-col justify-between rounded-[18px] border border-danger-700/25 bg-canvas p-5">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-danger-700">
                ACTION 02 · FREEZE ESCROW
              </span>
              <code className="font-mono text-[11px] text-ink-600">
                openDispute
              </code>
            </div>
            <h3 className="mt-2 text-lg font-semibold text-ink-950">
              Open dispute &amp; freeze funds
            </h3>
            <p className="mt-1.5 text-xs leading-5 text-ink-600">
              {status === "completed"
                ? "Unavailable because escrow has already settled to COMPLETED."
                : status === "disputed"
                  ? "Dispute is already open; funds remain locked in the contract."
                  : status === "shipped" && isExpired
                    ? "Review window closed (00:00). openDispute reverts after reviewEndsAt."
                    : "Freezes escrowed test MON in the contract and blocks seller timeout claims."}
            </p>
          </div>

          <div className="mt-5">
            <Button
              variant="destructive"
              size="md"
              disabled={!permissions.canOpenDispute || isBusy}
              onClick={() => setSelectedIntent("open-dispute")}
              className="w-full"
            >
              Open dispute
            </Button>
          </div>
        </div>
      </div>

      {/* Pre-signature wallet confirmation panel when buyer selects Confirm or Dispute */}
      {selectedIntent === "confirm-delivery" ? (
        <div className="mt-6 rounded-[18px] border-2 border-violet-600 bg-surface p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
              PRE-SIGNATURE REVIEW · CONFIRM DELIVERY
            </span>
            <StatusChip label="IRREVERSIBLE PAYOUT" tone="success" />
          </div>

          <h4 className="mt-4 text-xl font-semibold text-ink-950">
            Release {amountMon} test MON to {sellerName}?
          </h4>
          <p className="mt-1.5 text-sm leading-6 text-ink-600">
            Signing <code className="font-mono text-xs">confirmDelivery({orderId})</code>{" "}
            marks the order <code className="font-mono text-xs">COMPLETED</code>{" "}
            and transfers the escrowed funds immediately to the seller. Once
            confirmed on-chain, this order can no longer be disputed.
          </p>

          <dl className="mt-4 grid gap-2 rounded-[12px] border border-line bg-canvas p-3.5 text-xs sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-600">
                CONTRACT CALL
              </dt>
              <dd className="mt-0.5 font-mono font-semibold text-violet-700">
                confirmDelivery({orderId})
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-600">
                PAYOUT AMOUNT &amp; RECIPIENT
              </dt>
              <dd className="mt-0.5">
                <MonAmount
                  amount={amountMon}
                  size="sm"
                  showTestnetTag={false}
                />{" "}
                <span className="font-mono text-[11px] text-ink-600">
                  → {truncateHex(sellerAddress, 6, 4)}
                </span>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-600">
                STATE TRANSITION
              </dt>
              <dd className="mt-0.5 font-mono font-semibold text-ink-950">
                SHIPPED → COMPLETED
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-600">
                POST-ACTION DISPUTE RIGHT
              </dt>
              <dd className="mt-0.5 text-ink-800">
                Closed after payout settles
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <Button
              variant="primary"
              size="lg"
              pending={isBusy}
              pendingLabel="Confirm in wallet…"
              onClick={() => executeIntent("confirm-delivery")}
              className="flex-1"
            >
              Sign confirmDelivery({orderId}) in wallet
            </Button>
            <Button
              variant="secondary"
              size="lg"
              disabled={isBusy}
              onClick={() => setSelectedIntent(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      {selectedIntent === "open-dispute" ? (
        <div className="mt-6 rounded-[18px] border-2 border-danger-700 bg-surface p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-danger-700">
              PRE-SIGNATURE REVIEW · OPEN DISPUTE
            </span>
            <StatusChip label="FREEZES ESCROW FUNDS" tone="danger" />
          </div>

          <h4 className="mt-4 text-xl font-semibold text-ink-950">
            Freeze {amountMon} test MON in <code className="font-mono text-lg">DISPUTED</code> state?
          </h4>
          <p className="mt-1.5 text-sm leading-6 text-ink-600">
            Signing <code className="font-mono text-xs">openDispute({orderId})</code>{" "}
            transitions the order to <code className="font-mono text-xs">DISPUTED</code>{" "}
            and blocks the seller from claiming funds after the five-minute
            review timeout. In this MVP, disputed funds remain frozen in the
            contract without automated or admin withdrawal.
          </p>

          <dl className="mt-4 grid gap-2 rounded-[12px] border border-line bg-canvas p-3.5 text-xs sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-600">
                CONTRACT CALL
              </dt>
              <dd className="mt-0.5 font-mono font-semibold text-danger-700">
                openDispute({orderId})
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-600">
                ESCROW CUSTODY EFFECT
              </dt>
              <dd className="mt-0.5 font-semibold text-ink-950">
                {amountMon} test MON stays locked in contract
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-600">
                STATE TRANSITION
              </dt>
              <dd className="mt-0.5 font-mono font-semibold text-ink-950">
                {status.toUpperCase()} → DISPUTED
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-600">
                SELLER TIMEOUT CLAIM
              </dt>
              <dd className="mt-0.5 text-ink-800">
                Permanently blocked (reverts)
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <Button
              variant="destructive"
              size="lg"
              pending={isBusy}
              pendingLabel="Confirm in wallet…"
              onClick={() => executeIntent("open-dispute")}
              className="flex-1"
            >
              Sign openDispute({orderId}) in wallet
            </Button>
            <Button
              variant="secondary"
              size="lg"
              disabled={isBusy}
              onClick={() => setSelectedIntent(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
    </Surface>
  );
}
