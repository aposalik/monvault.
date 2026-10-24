"use client";

import { useState } from "react";
import { StatusChip, type StatusTone } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";
import { TransactionProof } from "@/components/ui/transaction-proof";

type ContractStateKey = "PAID" | "SHIPPED" | "COMPLETED" | "DISPUTED";

interface StateInspectorItem {
  key: ContractStateKey;
  enumValue: number;
  chipLabel: string;
  chipTone: StatusTone;
  primaryCopy: string;
  supportingCopy: string;
  timerDisplay: string;
  timerNote: string;
  nextPermittedAction: string;
  authorizedCaller: string;
  timelineStep: number;
  sampleTxHash: string;
}

const STATE_ITEMS: StateInspectorItem[] = [
  {
    key: "PAID",
    enumValue: 1,
    chipLabel: "FUNDS SECURED",
    chipTone: "violet",
    primaryCopy: "Funds secured in escrow",
    supportingCopy: "The seller can ship, but cannot receive payment yet.",
    timerDisplay: "05:00",
    timerNote: "Starts when seller marks order shipped",
    nextPermittedAction: "markShipped(1) or openDispute(1)",
    authorizedCaller: "Seller (to ship) · Buyer (to dispute)",
    timelineStep: 2,
    sampleTxHash:
      "0x8a91e04b7d23c91f52b0931a4c601872f490b1d452c7a8d96e3f1b20495a1001",
  },
  {
    key: "SHIPPED",
    enumValue: 2,
    chipLabel: "04:32 TO REVIEW",
    chipTone: "warning",
    primaryCopy: "Seller shipped your order",
    supportingCopy:
      "Confirm delivery or open a dispute before the review timer ends.",
    timerDisplay: "04:32",
    timerNote: "Review window active (300s from markShipped)",
    nextPermittedAction:
      "confirmDelivery(1) · openDispute(1) · claimAfterTimeout(1) after 00:00",
    authorizedCaller: "Buyer during window · Seller only after expiry",
    timelineStep: 4,
    sampleTxHash:
      "0x4f72c18e9a05d31b64e8207c3b519684e210a9c341b6d7e85f2a0c19384b2002",
  },
  {
    key: "COMPLETED",
    enumValue: 3,
    chipLabel: "SELLER PAID",
    chipTone: "success",
    primaryCopy: "Seller paid",
    supportingCopy:
      "Payment was released by buyer confirmation or the review timeout.",
    timerDisplay: "00:00",
    timerNote: "Settled — 1.00 test MON transferred to seller",
    nextPermittedAction: "None (terminal state)",
    authorizedCaller: "No further writes permitted",
    timelineStep: 5,
    sampleTxHash:
      "0x9d31b64e8207c3b519684e210a9c341b6d7e85f2a0c19384b20028a91e04b3003",
  },
  {
    key: "DISPUTED",
    enumValue: 4,
    chipLabel: "DISPUTE OPEN",
    chipTone: "danger",
    primaryCopy: "Dispute open",
    supportingCopy: "Funds remain locked; automated payout is disabled.",
    timerDisplay: "LOCKED",
    timerNote: "Seller timeout claim reverts while disputed",
    nextPermittedAction: "None in MVP (terminal freeze)",
    authorizedCaller: "No admin or automated withdrawal exists",
    timelineStep: 5,
    sampleTxHash:
      "0x2c7a8d96e3f1b20495a10018a91e04b7d23c91f52b0931a4c601872f490b4004",
  },
];

const TIMELINE_STEPS = [
  "Buyer paid",
  "Funds locked",
  "Seller shipped",
  "Buyer review",
  "Seller paid / dispute open",
];

export function InteractiveProofPanel() {
  const [selectedKey, setSelectedKey] = useState<ContractStateKey>("SHIPPED");

  const active =
    STATE_ITEMS.find((item) => item.key === selectedKey) ?? STATE_ITEMS[1];

  return (
    <Surface tone="raised" radius="card" className="p-6 md:p-8 lg:p-10">
      <div className="flex flex-col justify-between gap-6 border-b border-line pb-6 lg:flex-row lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
              INTERACTIVE STATE INSPECTOR
            </span>
            <StatusChip label="SAMPLE ORDER #1" tone="info" />
          </div>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink-950 md:text-3xl">
            Inspect how{" "}
            <code className="rounded-lg bg-muted px-2 py-0.5 text-xl md:text-2xl">
              MonVaultEscrow
            </code>{" "}
            translates chain state into plain language.
          </h3>
        </div>

        {/* State selector pills */}
        <div
          role="tablist"
          aria-label="Inspect contract state"
          className="flex flex-wrap gap-2"
        >
          {STATE_ITEMS.map((item) => {
            const isSelected = item.key === active.key;
            return (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedKey(item.key)}
                className={`min-h-11 rounded-full border px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.08em] transition-colors cursor-pointer ${
                  isSelected
                    ? "border-2 border-violet-600 bg-violet-600 text-white"
                    : "border-line bg-canvas text-ink-800 hover:bg-muted"
                }`}
              >
                {item.key}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main inspector body */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          {/* Primary status readout */}
          <div className="rounded-[18px] border border-line bg-canvas p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <StatusChip label={active.chipLabel} tone={active.chipTone} />
              <span className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink-600 tabular-nums">
                Status enum: {active.enumValue} ({active.key})
              </span>
            </div>

            <h4 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-ink-950">
              {active.primaryCopy}
            </h4>
            <p className="mt-2 text-base leading-7 text-ink-600">
              {active.supportingCopy}
            </p>

            {/* 5-step escrow timeline */}
            <div className="mt-6 border-t border-line pt-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                ESCROW TIMELINE PROGRESSION
              </p>
              <ol className="mt-4 grid gap-3 sm:grid-cols-5">
                {TIMELINE_STEPS.map((label, idx) => {
                  const stepNumber = idx + 1;
                  const isPast = stepNumber < active.timelineStep;
                  const isCurrent = stepNumber === active.timelineStep;

                  return (
                    <li
                      key={label}
                      className={`rounded-xl border p-3 ${
                        isCurrent
                          ? "border-2 border-violet-600 bg-surface text-ink-950"
                          : isPast
                            ? "border-success-700/30 bg-success-100/60 text-ink-950"
                            : "border-line bg-muted/60 text-ink-600"
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[11px] font-semibold tabular-nums">
                        <span>0{stepNumber}</span>
                        <span>
                          {isPast ? "DONE" : isCurrent ? "ACTIVE" : "NEXT"}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs font-semibold leading-4">
                        {label}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* Transaction proof preview */}
          <TransactionProof
            label="SAMPLE STATE TRANSACTION"
            hash={active.sampleTxHash}
            state="sample"
            networkLabel="MONAD TESTNET"
          />
        </div>

        {/* On-chain struct fields & permissions */}
        <div className="flex flex-col justify-between rounded-[18px] border border-line bg-muted p-6">
          <div>
            <div className="flex items-center justify-between border-b border-line pb-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-800">
                ON-CHAIN ORDER STRUCT
              </span>
              <span className="font-mono text-xs font-semibold text-violet-700 tabular-nums">
                getOrder(1)
              </span>
            </div>

            <dl className="mt-4 space-y-3.5 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-line/70 pb-3">
                <dt className="font-mono text-xs uppercase tracking-[0.08em] text-ink-600">
                  PRODUCT (OFF-CHAIN)
                </dt>
                <dd className="font-medium text-ink-950">Studio Headphones</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-line/70 pb-3">
                <dt className="font-mono text-xs uppercase tracking-[0.08em] text-ink-600">
                  AMOUNT (ESCROWED)
                </dt>
                <dd className="font-mono text-base font-semibold text-ink-950 tabular-nums">
                  1.00 test MON
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-line/70 pb-3">
                <dt className="font-mono text-xs uppercase tracking-[0.08em] text-ink-600">
                  ORDER REF (HASH)
                </dt>
                <dd className="font-mono text-xs text-ink-800">
                  0x5f9c2810…a41d9e01
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-line/70 pb-3">
                <dt className="font-mono text-xs uppercase tracking-[0.08em] text-ink-600">
                  REVIEW COUNTDOWN
                </dt>
                <dd className="text-right">
                  <span className="font-mono text-base font-semibold text-ink-950 tabular-nums">
                    {active.timerDisplay}
                  </span>
                  <p className="text-xs text-ink-600">{active.timerNote}</p>
                </dd>
              </div>
              <div className="pt-1">
                <dt className="font-mono text-xs uppercase tracking-[0.08em] text-ink-600">
                  PERMITTED CONTRACT CALL
                </dt>
                <dd className="mt-1.5 rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs font-semibold text-violet-700">
                  {active.nextPermittedAction}
                </dd>
                <p className="mt-1.5 text-xs text-ink-600">
                  Caller rule: {active.authorizedCaller}
                </p>
              </div>
            </dl>
          </div>

          <p className="mt-6 rounded-xl border border-line bg-surface p-3.5 text-xs leading-5 text-ink-600">
            <strong className="font-semibold text-ink-950">
              Truthful UI rule:
            </strong>{" "}
            Live order pages read directly from{" "}
            <code className="font-mono text-[11px]">MonVaultEscrow</code> and
            wait for a confirmed transaction receipt before updating status.
          </p>
        </div>
      </div>
    </Surface>
  );
}
