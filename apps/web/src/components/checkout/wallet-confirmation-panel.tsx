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
  opaqueOrderRef: `0x${string}`;
  buyerAddress?: `0x${string}`;
  walletStatus: CheckoutWalletStatus;
  actionState: CheckoutActionState;
  deliveryValid: boolean;
  onConnectWallet: () => void;
  onSwitchNetwork: () => void;
  onSubmitOrder: () => Promise<void>;
  onResetAction: () => void;
}

export function WalletConfirmationPanel({
  product,
  opaqueOrderRef,
  buyerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  walletStatus,
  actionState,
  deliveryValid,
  onConnectWallet,
  onSwitchNetwork,
  onSubmitOrder,
  onResetAction,
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
          STEP 02 · WALLET CONFIRMATION PANEL
        </span>
        {walletStatus === "disconnected" ? (
          <StatusChip label="WALLET DISCONNECTED" tone="neutral" />
        ) : walletStatus === "wrong-network" ? (
          <StatusChip label="WRONG NETWORK" tone="warning" />
        ) : isConfirmed ? (
          <StatusChip label="FUNDS SECURED" tone="success" />
        ) : (
          <StatusChip label="MONAD TESTNET" tone="violet" />
        )}
      </div>

      {/* Pre-signature transparency summary required by DESIGN.md section 8 */}
      <div className="mt-5">
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink-950">
          Lock payment in{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xl">
            MonVaultEscrow
          </code>
        </h2>

        {/* Required checkout copy from docs/PRODUCT-SPEC.md */}
        <p className="mt-3 rounded-[14px] border border-lilac-300 bg-lilac-150/60 p-4 text-sm leading-6 text-ink-950">
          Your funds are locked in Monad escrow. Confirm delivery to pay the
          seller now, or open a dispute within five minutes. Otherwise the
          seller may claim payment after the review period.
        </p>

        {/* Public on-chain parameters table */}
        <dl className="mt-5 space-y-3 border-y border-line py-4 text-xs">
          <div className="flex items-center justify-between gap-2">
            <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
              CONTRACT ACTION
            </dt>
            <dd className="font-mono font-semibold text-violet-700">
              createOrder(orderRef, seller)
            </dd>
          </div>

          <div className="flex items-center justify-between gap-2">
            <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
              VALUE TO LOCK (MSG.VALUE)
            </dt>
            <dd>
              <MonAmount
                amount={product.priceMon}
                size="sm"
                showTestnetTag={false}
              />
            </dd>
          </div>

          <div className="flex items-center justify-between gap-2">
            <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
              SELLER RECIPIENT
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
              BUYER SIGNER
            </dt>
            <dd>
              <code
                title={buyerAddress}
                className="font-mono text-[11px] text-ink-950"
              >
                {walletStatus === "disconnected"
                  ? "Connect disposable wallet"
                  : truncateHex(buyerAddress, 8, 6)}
              </code>
            </dd>
          </div>

          <div className="flex items-center justify-between gap-2">
            <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
              OPAQUE ORDER REF (HASH)
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

          <div className="flex items-center justify-between gap-2">
            <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
              NETWORK
            </dt>
            <dd className="font-mono font-semibold text-ink-950">
              MONAD TESTNET
            </dd>
          </div>

          <div className="flex items-center justify-between gap-2">
            <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
              CONTRACT STATE CHANGE
            </dt>
            <dd className="font-mono font-semibold text-ink-950">
              NONE → PAID (Escrow Active)
            </dd>
          </div>

          <div className="flex items-center justify-between gap-2">
            <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
              DISPUTE / CLAIM ELIGIBILITY
            </dt>
            <dd className="text-right text-ink-800">
              Buyer can confirm or dispute; seller cannot withdraw early
            </dd>
          </div>
        </dl>
      </div>

      {/* Dynamic Wallet & Transaction States */}
      <div className="mt-6 space-y-4" aria-live="polite">
        {walletStatus === "disconnected" ? (
          <div className="space-y-3 rounded-[14px] border border-line bg-canvas p-4">
            <p className="text-sm font-semibold text-ink-950">
              Connect a disposable buyer wallet to continue
            </p>
            <p className="text-xs leading-5 text-ink-600">
              Use a separate test wallet from the seller account so you can
              verify buyer confirmation and seller shipment independently.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={onConnectWallet}
              className="w-full"
            >
              Connect disposable MetaMask wallet
            </Button>
          </div>
        ) : walletStatus === "wrong-network" ? (
          <div className="space-y-3 rounded-[14px] border border-warning-700/30 bg-warning-100 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-warning-700">
                NETWORK MISMATCH
              </span>
              <StatusChip label="SWITCH REQUIRED" tone="warning" />
            </div>
            <p className="text-sm font-semibold text-ink-950">
              Your wallet is not connected to Monad Testnet.
            </p>
            <p className="text-xs leading-5 text-ink-800">
              No funds have moved. Switch your wallet network to Monad Testnet
              before calling <code className="font-mono">createOrder</code>.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={onSwitchNetwork}
              className="w-full"
            >
              Switch wallet to Monad Testnet
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
                  in your wallet extension.
                </p>
                <p className="mt-1 text-xs leading-5 text-ink-800">
                  Verify the exact deposit of{" "}
                  <strong className="font-semibold">
                    {product.priceMon} test MON
                  </strong>{" "}
                  before approving. Repeated clicks are locked while the prompt
                  is open.
                </p>
              </div>
            ) : null}

            {/* Submitted, waiting for on-chain receipt */}
            {actionState.phase === "confirming" ? (
              <div className="space-y-3 rounded-[14px] border border-warning-700/30 bg-warning-100/70 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-warning-700">
                    WAITING FOR BLOCK RECEIPT
                  </span>
                  <StatusChip label="CONFIRMING ON-CHAIN" tone="warning" />
                </div>
                <p className="text-sm font-semibold text-ink-950">
                  Transaction submitted. Waiting for Monad testnet receipt…
                </p>
                <p className="text-xs leading-5 text-ink-800">
                  monvault. never reports payment success from a broadcast hash
                  alone. The order becomes <code className="font-mono">PAID</code>{" "}
                  only when the receipt confirms.
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
                <p className="text-xs leading-5 text-ink-800">
                  You cancelled the signature request in your wallet. Your{" "}
                  {product.priceMon} test MON balance is unchanged, and you can
                  retry whenever ready.
                </p>
              </div>
            ) : null}

            {/* Contract revert error */}
            {actionState.phase === "reverted" ? (
              <div className="space-y-3 rounded-[14px] border border-danger-700/30 bg-danger-100 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-danger-700">
                    CONTRACT REVERTED{" "}
                    {actionState.reasonCode ? `· ${actionState.reasonCode}` : ""}
                  </span>
                  <StatusChip label="ESCROW NOT CREATED" tone="danger" />
                </div>
                <p className="text-sm font-semibold text-ink-950">
                  {actionState.message}
                </p>
                <p className="text-xs leading-5 text-ink-800">
                  The transaction reverted on-chain, so no test MON was locked
                  in escrow. Inspect the transaction in the Monad explorer or
                  generate a fresh order reference and retry.
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
                    RECEIPT CONFIRMED · ORDER #{actionState.orderId}
                  </span>
                  <StatusChip label="FUNDS SECURED" tone="success" />
                </div>
                <p className="text-base font-semibold text-ink-950">
                   Funds secured in escrow ({product.priceMon} test MON)
                </p>
                <p className="text-xs leading-5 text-ink-800">
                  The seller can now see committed funds on-chain and mark Order
                  #{actionState.orderId} shipped, but cannot withdraw payment
                  until you confirm delivery or the 5-minute review window
                  expires without a dispute.
                </p>

                <TransactionProof
                  label="CONFIRMED DEPOSIT TX"
                  hash={actionState.txHash}
                  explorerUrl={actionState.explorerUrl}
                  state="confirmed"
                />

                <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
                  <ButtonLink
                    href={`/orders/${actionState.orderId}`}
                    variant="primary"
                    size="lg"
                    className="flex-1"
                  >
                    Track Order #{actionState.orderId} →
                  </ButtonLink>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={onResetAction}
                  >
                    New checkout preview
                  </Button>
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
                      : "Waiting for receipt…"
                  }
                  disabled={!deliveryValid || isBusy}
                  onClick={handlePrimarySubmit}
                  className="w-full"
                >
                  {actionState.phase === "rejected" ||
                  actionState.phase === "reverted"
                    ? `Retry escrow deposit (${product.priceMon} test MON)`
                    : `Lock ${product.priceMon} test MON in escrow`}
                </Button>

                {!deliveryValid ? (
                  <p className="text-center font-mono text-[11px] text-danger-700">
                    Complete the off-chain recipient and destination fields to
                    enable wallet confirmation.
                  </p>
                ) : (
                  <p className="text-center font-mono text-[11px] text-ink-600">
                    Never asks for a private key. Signs{" "}
                    <code className="font-mono">createOrder</code> via your
                    wallet extension.
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
