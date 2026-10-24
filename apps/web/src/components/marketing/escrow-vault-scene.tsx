"use client";

import { useEffect, useState } from "react";
import { StatusChip, type StatusTone } from "@/components/ui/status-chip";

type VaultPathId = "confirm" | "timeout" | "dispute";

interface VaultPathSpec {
  id: VaultPathId;
  label: string;
  contractCall: string;
  caller: string;
  chipLabel: string;
  chipTone: StatusTone;
  packagePosition: string;
  vaultStatus: string;
  vaultSubline: string;
  outcomeSummary: string;
}

const VAULT_PATHS: VaultPathSpec[] = [
  {
    id: "confirm",
    label: "Confirm",
    contractCall: "confirmDelivery(orderId)",
    caller: "Buyer wallet",
    chipLabel: "SELLER PAID",
    chipTone: "success",
    packagePosition: "DELIVERED TO BUYER",
    vaultStatus: "RELEASED TO SELLER",
    vaultSubline: "1.00 TEST MON → 0xSeller",
    outcomeSummary:
      "Buyer confirms receipt during the 5-minute window; escrow immediately transfers 1.00 test MON to the seller.",
  },
  {
    id: "timeout",
    label: "Timeout",
    contractCall: "claimAfterTimeout(orderId)",
    caller: "Seller wallet (after 05:00)",
    chipLabel: "00:00 WINDOW EXPIRED",
    chipTone: "warning",
    packagePosition: "SHIPPED · NO DISPUTE",
    vaultStatus: "CLAIMED AFTER TIMEOUT",
    vaultSubline: "Undisputed after 5m deadline",
    outcomeSummary:
      "If the 5-minute review window ends with no buyer dispute, the seller can claim the committed 1.00 test MON.",
  },
  {
    id: "dispute",
    label: "Dispute",
    contractCall: "openDispute(orderId)",
    caller: "Buyer wallet (before 05:00)",
    chipLabel: "DISPUTE OPEN",
    chipTone: "danger",
    packagePosition: "HOLD / ISSUE REPORTED",
    vaultStatus: "FUNDS FROZEN IN VAULT",
    vaultSubline: "Automated payout disabled",
    outcomeSummary:
      "Buyer opens a dispute before the deadline; the contract locks the 1.00 test MON and blocks seller timeout claims.",
  },
];

export function EscrowVaultScene() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % VAULT_PATHS.length);
    }, 3600);

    return () => window.clearInterval(interval);
  }, [paused]);

  const current = VAULT_PATHS[activeIndex];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="region"
      aria-label="Interactive escrow vault model showing buyer deposit, package transit, and three contract settlement paths: Confirm, Timeout, and Dispute"
      className="relative mx-auto w-full max-w-[580px] rounded-[28px] border border-line bg-surface p-5 shadow-[0_32px_80px_rgba(16,11,43,0.08)] sm:p-7"
    >
      {/* Top technical header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-2.5 rounded-full bg-violet-600"
          />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-800">
            MONVAULTESCROW · VAULT SCENE
          </span>
        </div>
        <StatusChip label={current.chipLabel} tone={current.chipTone} />
      </div>

      {/* Dimensional isometric vault stage */}
      <div className="relative mt-5 overflow-hidden rounded-[22px] border border-line bg-canvas p-5 sm:p-6">
        {/* Buyer -> Package Block -> Seller transit rail */}
        <div className="rounded-[14px] border border-line bg-surface p-3.5">
          <div className="flex items-center justify-between font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
            <span>BUYER WALLET</span>
            <span className="text-violet-700">{current.packagePosition}</span>
            <span>SELLER WALLET</span>
          </div>

          <div className="relative mt-3 flex items-center justify-between">
            {/* Rail line */}
            <div
              aria-hidden="true"
              className="absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2 bg-line"
            />

            {/* Buyer node */}
            <div className="relative z-10 flex size-9 items-center justify-center rounded-lg border border-ink-950 bg-surface font-mono text-xs font-semibold text-ink-950">
              B
            </div>

            {/* Suspended dimensional package block */}
            <div
              className={`relative z-10 flex items-center gap-2.5 rounded-xl border-2 border-ink-950 bg-lilac-150 px-3.5 py-2 shadow-[4px_5px_0_var(--night-950)] transition-transform duration-300 ${
                current.id === "confirm"
                  ? "translate-x-4 sm:translate-x-8"
                  : current.id === "timeout"
                    ? "translate-x-1 sm:translate-x-2"
                    : "-translate-x-3 sm:-translate-x-6 border-danger-700 bg-danger-100"
              }`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className="size-4 shrink-0 fill-none stroke-ink-950 stroke-[1.75]"
              >
                <path
                  d="M10 2.5 17 6v8l-7 3.5L3 14V6l7-3.5Z"
                  strokeLinejoin="round"
                />
                <path d="M3 6l7 3.5L17 6M10 9.5V17.5" strokeLinejoin="round" />
              </svg>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-950">
                ORDER #01
              </span>
            </div>

            {/* Seller node */}
            <div
              className={`relative z-10 flex size-9 items-center justify-center rounded-lg border font-mono text-xs font-semibold transition-colors ${
                current.id === "dispute"
                  ? "border-line bg-muted text-ink-600"
                  : "border-success-700 bg-success-100 text-success-700"
              }`}
            >
              S
            </div>
          </div>
        </div>

        {/* Central Solid-Material Escrow Vault Ring + Generic Token Disc */}
        <div className="my-6 grid place-items-center">
          <div className="relative grid size-[210px] place-items-center sm:size-[260px]">
            {/* Outer architectural plate */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rotate-3 rounded-[34%] border-2 border-lilac-300 bg-lilac-150 shadow-[12px_16px_0_var(--line-subtle)]"
            />
            {/* Solid-violet open vault ring representing the contract */}
            <div
              aria-hidden="true"
              className="absolute inset-[10%] -rotate-3 rounded-full border-[14px] border-violet-600 bg-night shadow-[12px_16px_0_var(--night-950)]"
            />
            {/* Inner generic token disc (no Monad logo reproduction) */}
            <div className="relative z-10 flex size-[140px] flex-col items-center justify-center rounded-full border-4 border-lilac-300 bg-night px-3 text-center text-white sm:size-[166px]">
              <span className="rounded-full border border-lilac-300/40 bg-ink-800 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-lilac-300">
                ESCROW DISC
              </span>
              <p className="mt-2 font-mono text-xl font-semibold tracking-[-0.03em] text-white tabular-nums sm:text-2xl">
                1.00 MON
              </p>
              <p className="mt-1 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-lilac-150">
                {current.vaultStatus}
              </p>
            </div>

            {/* Dimensional callout tags */}
            <span className="absolute left-0 top-2 rounded-lg border border-ink-950 bg-surface px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-950 shadow-[3px_4px_0_var(--night-950)] sm:-left-2 sm:top-3 sm:px-2.5">
              LOCKED IN CONTRACT
            </span>
            <span className="absolute bottom-2 right-0 rounded-lg border border-ink-950 bg-surface px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-950 shadow-[3px_4px_0_var(--night-950)] tabular-nums sm:-right-2 sm:bottom-3 sm:px-2.5">
              WINDOW: 05:00
            </span>
          </div>
        </div>

        {/* Three physical settlement paths: Confirm, Timeout, Dispute */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
              SELECT SETTLEMENT PATH
            </span>
            <span className="font-mono text-[11px] text-ink-600">
              {current.caller}
            </span>
          </div>

          <div
            role="tablist"
            aria-label="Escrow vault settlement paths"
            className="grid grid-cols-3 gap-2"
          >
            {VAULT_PATHS.map((path, index) => {
              const isSelected = index === activeIndex;
              return (
                <button
                  key={path.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    setActiveIndex(index);
                    setPaused(true);
                  }}
                  className={`flex min-h-12 flex-col items-start justify-between rounded-[12px] border p-3 text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "border-2 border-violet-600 bg-surface text-ink-950 shadow-[3px_4px_0_var(--night-950)]"
                      : "border-line bg-surface/80 text-ink-600 hover:bg-surface hover:text-ink-950"
                  }`}
                >
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-violet-700">
                    0{index + 1} / PATH
                  </span>
                  <span className="mt-1 text-sm font-semibold tracking-[-0.02em]">
                    {path.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live contract rule readout */}
      <div className="mt-4 rounded-[14px] border border-line bg-muted p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <code className="font-mono text-xs font-semibold text-violet-700">
            {current.contractCall}
          </code>
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink-600">
            {current.vaultSubline}
          </span>
        </div>
        <p className="mt-2 text-sm leading-6 text-ink-800">
          {current.outcomeSummary}
        </p>
      </div>
    </div>
  );
}
