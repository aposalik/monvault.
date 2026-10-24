import { StatusChip } from "@/components/ui/status-chip";

export interface OneSellerBoundaryProps {
  compact?: boolean;
  className?: string;
}

export function OneSellerBoundary({
  compact = false,
  className = "",
}: OneSellerBoundaryProps) {
  if (compact) {
    return (
      <div
        className={`flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-line bg-muted px-4 py-3 text-xs text-ink-800 ${className}`.trim()}
      >
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rounded-full bg-violet-600"
          />
          <span>
            <strong className="font-semibold text-ink-950">
              One-order escrow boundary:
            </strong>{" "}
            Each{" "}
            <code className="font-mono text-[11px]">
              createOrder(orderRef, seller)
            </code>{" "}
            call locks funds for a single product and seller wallet.
          </span>
        </div>
        <StatusChip label="1 ITEM · 1 SELLER" tone="violet" />
      </div>
    );
  }

  return (
    <div
      className={`rounded-[18px] border border-line bg-muted p-5 ${className}`.trim()}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
          MVP CONTRACT BOUNDARY
        </span>
        <StatusChip label="SINGLE-SELLER ESCROW" tone="violet" />
      </div>
      <p className="mt-2.5 text-sm leading-6 text-ink-800">
        To keep on-chain custody explicit and auditable,{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs text-ink-950">
          MonVaultEscrow
        </code>{" "}
        escrows one product and one seller per order. Selecting a different
        product in the shop replaces the active checkout item rather than
        bundling multiple sellers into one transaction.
      </p>
    </div>
  );
}
