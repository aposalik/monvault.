"use client";

import { useState } from "react";
import { StatusChip, type StatusTone } from "./status-chip";

export type ProofState = "confirmed" | "pending" | "failed" | "sample";

const proofToneMap: Record<ProofState, { label: string; tone: StatusTone }> = {
  confirmed: { label: "CONFIRMED ON-CHAIN", tone: "success" },
  pending: { label: "CONFIRMING RECEIPT", tone: "warning" },
  failed: { label: "TRANSACTION REVERTED", tone: "danger" },
  sample: { label: "TESTNET PREVIEW", tone: "info" },
};

export function truncateHex(value: string, lead = 8, tail = 6): string {
  if (value.length <= lead + tail + 2) return value;
  return `${value.slice(0, lead)}…${value.slice(-tail)}`;
}

export interface TransactionProofProps {
  label?: string;
  hash: string;
  explorerUrl?: string;
  state?: ProofState;
  networkLabel?: string;
  className?: string;
}

export function TransactionProof({
  label = "TRANSACTION HASH",
  hash,
  explorerUrl,
  state = "confirmed",
  networkLabel = "MONAD TESTNET",
  className = "",
}: TransactionProofProps) {
  const [copied, setCopied] = useState(false);
  const badge = proofToneMap[state];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      className={`rounded-[14px] border border-line bg-surface p-4 text-ink-950 ${className}`.trim()}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
            {label}
          </span>
          <span className="rounded-md border border-line bg-canvas px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink-600">
            {networkLabel}
          </span>
        </div>
        <StatusChip label={badge.label} tone={badge.tone} />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
        <code
          title={hash}
          className="font-mono text-xs font-medium tracking-[0.02em] text-ink-950 sm:text-[13px]"
        >
          {truncateHex(hash, 10, 8)}
        </code>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-line bg-canvas px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-800 transition-colors hover:bg-muted cursor-pointer"
            aria-label={`Copy full value ${hash}`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="size-3.5 fill-none stroke-current stroke-[1.6]"
            >
              <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
              <path d="M10.5 5.5V3.8A1.3 1.3 0 0 0 9.2 2.5H3.8A1.3 1.3 0 0 0 2.5 3.8v5.4a1.3 1.3 0 0 0 1.3 1.3h1.7" />
            </svg>
            <span>{copied ? "COPIED" : "COPY"}</span>
          </button>

          {explorerUrl ? (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-info-700/30 bg-info-100 px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-info-700 transition-colors hover:bg-info-700 hover:text-white"
            >
              <span>EXPLORER</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="size-3.5 fill-none stroke-current stroke-[1.75]"
              >
                <path
                  d="M6 3.5h6.5V10M12 4 4.5 11.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          ) : (
            <span
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-line bg-muted px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink-600"
              title="Explorer link activates once deployed on Monad testnet"
            >
              <span>AWAITING S2 DEPLOY</span>
            </span>
          )}
        </div>
      </div>

      <span className="sr-only" aria-live="polite">
        {copied ? "Copied value to clipboard." : ""}
      </span>
    </div>
  );
}
