"use client";

import { useRef } from "react";
import { MonAmount } from "@/components/catalog/mon-amount";
import { Button, ButtonLink } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";
import {
  TransactionProof,
  truncateHex,
} from "@/components/ui/transaction-proof";
import type { DemoProduct } from "@/data/catalog";
import type {
  CheckoutActionState,
  CheckoutWalletStatus,
} from "./checkout-types";

export interface WalletConfirmationPanelProps {
  product: DemoProduct;
  totalAmountMon: string;
  itemCount: number;
  opaqueOrderRef: `0x${string}`;
  buyerAddress?: `0x${string}`;
  walletStatus: CheckoutWalletStatus;
  actionState: CheckoutActionState;
  deliveryValid: boolean;
  onConnectWallet: () => void;
  onSwitchNetwork: () => void;
  onSubmitOrder: () => Promise<void>;
}

export function WalletConfirmationPanel({
  product,
  totalAmountMon,
  itemCount,
  opaqueOrderRef,
  buyerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  walletStatus,
  actionState,
  deliveryValid,
  onConnectWallet,
  onSwitchNetwork,
  onSubmitOrder,
}: WalletConfirmationPanelProps) {
  const submissionLockRef = useRef(false);

  const isBusy =
    actionState.phase === "awaiting-signature" ||
    actionState.phase === "confirming";
  const isConfirmed = actionState.phase === "confirmed";

  async function handlePrimarySubmit() {
    if (submissionLockRef.current || isBusy || isConfirmed || !deliveryValid) {
      return;
    }
    submissionLockRef.current = true;
    try {
      await onSubmitOrder();
    } finally {
      submissionLockRef.current = false;
    }
  }

  return (
    <Surface tone="raised" radius="card" className="p-6 md:p-8">
      {/* Top status bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
          STEP 02 · ESCROW SETTLEMENT
        </span>
        {walletStatus === "disconnected" ? (
          <StatusChip label="WALLET DISCONNECTED" tone="neutral" />
        ) : walletStatus === "wrong-network" ? (
          <StatusChip label="WRONG NETWORK" tone="warning" />
        ) : isConfirmed ? (
          <StatusChip label="FUNDS LOCKED IN ESCROW" tone="success" />
        ) : (
          <StatusChip label="MONAD ESCROW READY" tone="violet" />
        )}
      </div>

      {/* Pre-signature transparency summary */}
      <div className="mt-5">
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink-950">
          Lock payment in{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xl">
            MonVaultEscrow
          </code>
        </h2>

        <p className="mt-3 rounded-[14px] border border-lilac-300 bg-lilac-150/60 p-4 text-sm leading-6 text-ink-950">
          Your funds are locked in Monad escrow—not sent directly to the
          merchant. Once your order arrives, confirm delivery on{" "}
          <code className="font-mono text-xs">/track</code> to release payment
          or open a dispute within the review window.
        </p>

        {/* Public on-chain parameters table */}
        <dl className="mt-5 space-y-3 border-y border-line py-4 text-xs">
          <div className="flex items-center justify-between gap-2">
            <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
              SMART CONTRACT CALL
            </dt>
            <dd className="font-mono font-semibold text-violet-700">
              createOrder(orderRef, seller)
            </dd>
          </div>

          <div className="flex items-center justify-between gap-2">
            <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
              ITEMS IN ORDER
            </dt>
            <dd className="font-mono font-semibold text-ink-950">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-2">
            <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
              ESCROW AMOUNT (MSG.VALUE)
            </dt>
            <dd>
              <MonAmount amount={totalAmountMon} size="sm" />
            </dd>
          </div>

          <div className="flex items-center justify-between gap-2">
            <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
              MERCHANT RECIPIENT
            </dt>
            <dd className="text-right">
              <span className="block font-medium text-ink-950">
                {product.sellerName}
              </span>
              <code
                title={product.sellerAddress}
                className="font-mono text-[11px] text-ink-600"
              >
                {truncateHex(product.sellerAddress, 8, 6)}
              </code>
            </dd>
          </div>

          <div className="flex items-center justify-between gap-2">
            <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
              BUYER WALLET
            </dt>
            <dd>
              <code
                title={buyerAddress}
                className="font-mono text-[11px] text-ink-950"
              >
                {walletStatus === "disconnected"
                  ? "Not connected"
                  : truncateHex(buyerAddress, 8, 6)}
              </code>
            </dd>
          </div>

          <div className="flex items-center justify-between gap-2">
            <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
              ORDER REFERENCE HASH
            </dt>
            <dd>
              <code
                title={opaqueOrderRef}
                className="font-mono text-[11px] text-ink-800"
              >
                {truncateHex(opaqueOrderRef, 10, 8)}
              </code>
            </dd>
          </div>
        </dl>
      </div>

      {/* Dynamic Wallet & Transaction States */}
      <div className="mt-6 space-y-4" aria-live="polite">
        {walletStatus === "disconnected" ? (
          <div className="space-y-3 rounded-[14px] border border-line bg-canvas p-4">
            <p className="text-sm font-semibold text-ink-950">
              Connect your Web3 wallet to continue
            </p>
            <p className="text-xs leading-5 text-ink-600">
              Connect MetaMask or any compatible Monad wallet to sign the escrow
              deposit transaction.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={onConnectWallet}
              className="w-full"
            >
              Connect Wallet
            </Button>
          </div>
        ) : walletStatus === "wrong-network" ? (
          <div className="space-y-3 rounded-[14px] border border-warning-700/30 bg-warning-100 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-warning-700">
                NETWORK MISMATCH
              </span>
              <StatusChip label="SWITCH NETWORK" tone="warning" />
            </div>
            <p className="text-sm font-semibold text-ink-950">
              Please switch your wallet to Monad Testnet.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={onSwitchNetwork}
              className="w-full"
            >
              Switch to Monad Testnet
            </Button>
          </div>
        ) : (
          <>
            {/* Awaiting wallet signature */}
            {actionState.phase === "awaiting-signature" ? (
              <div className="rounded-[14px] border border-violet-600 bg-lilac-150/70 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
                    CONFIRM IN WALLET
                  </span>
                  <StatusChip label="AWAITING SIGNATURE" tone="violet" />
                </div>
                <p className="mt-2 text-sm font-semibold text-ink-950">
                  Review and sign <code className="font-mono">createOrder</code>{" "}
                  in your wallet.
                </p>
                <p className="mt-1 text-xs leading-5 text-ink-800">
                  Confirm the escrow deposit of{" "}
                  <strong className="font-semibold">
                    {totalAmountMon} MON
                  </strong>
                  .
                </p>
              </div>
            ) : null}

            {/* Submitted, waiting for on-chain receipt */}
            {actionState.phase === "confirming" ? (
              <div className="space-y-3 rounded-[14px] border border-warning-700/30 bg-warning-100/70 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-warning-700">
                    WAITING FOR BLOCK CONFIRMATION
                  </span>
                  <StatusChip label="CONFIRMING ON-CHAIN" tone="warning" />
                </div>
                <p className="text-sm font-semibold text-ink-950">
                  Transaction broadcast. Waiting for Monad block receipt…
                </p>
                <TransactionProof
                  label="SUBMITTED ESCROW TX"
                  hash={actionState.txHash}
                  explorerUrl={actionState.explorerUrl}
                  state="pending"
                />
              </div>
            ) : null}

            {/* User rejected signature in wallet */}
            {actionState.phase === "rejected" ? (
              <div className="space-y-3 rounded-[14px] border border-danger-700/30 bg-danger-100 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-danger-700">
                    SIGNATURE CANCELLED
                  </span>
                  <StatusChip label="NO FUNDS MOVED" tone="danger" />
                </div>
                <p className="text-sm font-semibold text-ink-950">
                  {actionState.message}
                </p>
              </div>
            ) : null}

            {/* Contract revert error */}
            {actionState.phase === "reverted" ? (
              <div className="space-y-3 rounded-[14px] border border-danger-700/30 bg-danger-100 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-danger-700">
                    TRANSACTION REVERTED{" "}
                    {actionState.reasonCode ? `· ${actionState.reasonCode}` : ""}
                  </span>
                  <StatusChip label="ESCROW NOT CREATED" tone="danger" />
                </div>
                <p className="text-sm font-semibold text-ink-950">
                  {actionState.message}
                </p>
                {actionState.txHash ? (
                  <TransactionProof
                    label="REVERTED TRANSACTION"
                    hash={actionState.txHash}
                    explorerUrl={actionState.explorerUrl}
                    state="failed"
                  />
                ) : null}
              </div>
            ) : null}

            {/* Confirmed receipt state */}
            {actionState.phase === "confirmed" ? (
              <div className="space-y-4 rounded-[14px] border border-success-700/30 bg-success-100/70 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-success-700">
                    ORDER #{actionState.orderId} CONFIRMED
                  </span>
                  <StatusChip label="PAID INTO ESCROW" tone="success" />
                </div>
                <p className="text-base font-semibold text-ink-950">
                  {totalAmountMon} MON locked in MonVaultEscrow
                </p>
                <p className="text-xs leading-5 text-ink-800">
                  Your order has been recorded in PostgreSQL and locked on-chain.
                  The merchant cannot withdraw payment until you confirm
                  delivery.
                </p>

                <TransactionProof
                  label="CONFIRMED ESCROW DEPOSIT TX"
                  hash={actionState.txHash}
                  explorerUrl={actionState.explorerUrl}
                  state="confirmed"
                />

                <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
                  <ButtonLink
                    href={`/track?q=${actionState.orderId}`}
                    variant="primary"
                    size="lg"
                    className="flex-1"
                  >
                    Track Order #{actionState.orderId} →
                  </ButtonLink>
                  <ButtonLink
                    href="/shop"
                    variant="secondary"
                    size="lg"
                  >
                    Continue Shopping
                  </ButtonLink>
                </div>
              </div>
            ) : null}

            {/* Primary submit / retry action button when not yet confirmed */}
            {!isConfirmed ? (
              <div className="space-y-2.5">
                <Button
                  variant="primary"
                  size="lg"
                  pending={isBusy}
                  pendingLabel={
                    actionState.phase === "awaiting-signature"
                      ? "Confirm in wallet…"
                      : "Waiting for block receipt…"
                  }
                  disabled={!deliveryValid || isBusy}
                  onClick={handlePrimarySubmit}
                  className="w-full"
                >
                  {actionState.phase === "rejected" ||
                  actionState.phase === "reverted"
                    ? `Retry Escrow Deposit (${totalAmountMon} MON)`
                    : `Pay ${totalAmountMon} MON into Escrow`}
                </Button>

                {!deliveryValid ? (
                  <p className="text-center font-mono text-[11px] text-danger-700">
                    Complete your recipient name and shipping address to
                    continue.
                  </p>
                ) : (
                  <p className="text-center font-mono text-[11px] text-ink-600">
                    Protected by <code className="font-mono">MonVaultEscrow</code>{" "}
                    on Monad Testnet.
                  </p>
                )}
              </div>
            ) : null}
          </>
        )}
      </div>
    </Surface>
  );
}
