import { StatusChip } from "@/components/ui/status-chip";

export function PrivacySplitBanner() {
  return (
    <div className="rounded-[20px] border border-line bg-surface p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
            PRIVACY &amp; ESCROW ARCHITECTURE
          </span>
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-ink-950">
            Off-chain shipping privacy with on-chain payment security
          </h2>
        </div>
        <StatusChip label="ZERO PII ON-CHAIN" tone="success" />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-[14px] border border-line bg-canvas p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-success-700">
              PRIVATE (OFF-CHAIN POSTGRESQL)
            </span>
            <span className="rounded bg-success-100 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-success-700">
              NEVER IN CALLDATA
            </span>
          </div>
          <ul className="mt-2.5 space-y-1.5 text-xs leading-5 text-ink-800">
            <li>• Recipient name and delivery street address</li>
            <li>• Delivery instructions and carrier tracking numbers</li>
            <li>• Order line-item metadata</li>
          </ul>
        </div>

        <div className="rounded-[14px] border border-line bg-canvas p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-violet-700">
              PUBLIC (ON MONAD BLOCKCHAIN)
            </span>
            <span className="rounded bg-lilac-150 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-violet-700">
              MONVAULTESCROW
            </span>
          </div>
          <ul className="mt-2.5 space-y-1.5 text-xs leading-5 text-ink-800">
            <li>
              • Opaque <code className="font-mono text-[11px]">bytes32 orderRef</code>{" "}
              hash
            </li>
            <li>
              • Buyer wallet, seller wallet, and locked{" "}
              <code className="font-mono text-[11px]">MON</code> amount
            </li>
            <li>
              • Escrow state (<code className="font-mono text-[11px]">PAID</code>)
              and delivery review deadline
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
