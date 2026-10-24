import { StatusChip } from "@/components/ui/status-chip";

export function PrivacySplitBanner() {
  return (
    <div className="rounded-[20px] border border-line bg-surface p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
            DATA BOUNDARY AT CHECKOUT
          </span>
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-ink-950">
            What stays private vs. what is written to Monad testnet
          </h2>
        </div>
        <StatusChip label="ZERO PII ON-CHAIN" tone="success" />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-[14px] border border-line bg-canvas p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-success-700">
              PRIVATE (OFF-CHAIN ONLY)
            </span>
            <span className="rounded bg-success-100 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-success-700">
              NEVER IN CALLDATA
            </span>
          </div>
          <ul className="mt-2.5 space-y-1.5 text-xs leading-5 text-ink-800">
            <li>• Recipient name and delivery street address</li>
            <li>• Delivery instructions and contact notes</li>
            <li>• Product title, imagery, and off-chain tracking number</li>
          </ul>
        </div>

        <div className="rounded-[14px] border border-line bg-canvas p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-violet-700">
              PUBLIC (ON MONAD TESTNET)
            </span>
            <span className="rounded bg-lilac-150 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-violet-700">
              CONTRACT STORAGE
            </span>
          </div>
          <ul className="mt-2.5 space-y-1.5 text-xs leading-5 text-ink-800">
            <li>
              • Opaque <code className="font-mono text-[11px]">bytes32 orderRef</code>{" "}
              hash (cannot be reversed into your address)
            </li>
            <li>
              • Buyer wallet, seller wallet, and exact{" "}
              <code className="font-mono text-[11px]">test MON</code> value
            </li>
            <li>
              • Escrow state (<code className="font-mono text-[11px]">PAID</code>)
              and future 5-minute review deadline
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
