function truncateHex(value: string, lead = 8, tail = 6): string {
  if (value.length <= lead + tail + 2) return value;
  return `${value.slice(0, lead)}…${value.slice(-tail)}`;
}

export interface SellerIdentityProps {
  name: string;
  address: `0x${string}`;
  compact?: boolean;
  className?: string;
}

export function SellerIdentity({
  name,
  address,
  compact = false,
  className = "",
}: SellerIdentityProps) {
  if (compact) {
    return (
      <div
        className={`inline-flex flex-wrap items-center gap-2 text-xs text-ink-600 ${className}`.trim()}
      >
        <span className="font-medium text-ink-800">{name}</span>
        <span aria-hidden="true" className="text-line">
          ·
        </span>
        <code
          title={address}
          className="font-mono text-[11px] text-ink-600 tabular-nums"
        >
          {truncateHex(address, 6, 4)}
        </code>
      </div>
    );
  }

  return (
    <div
      className={`rounded-[14px] border border-line bg-canvas p-4 ${className}`.trim()}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
          RECORDED ESCROW SELLER
        </span>
        <span className="rounded-md border border-lilac-300 bg-lilac-150 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-violet-700">
          SEEDED DEMO MERCHANT
        </span>
      </div>
      <p className="mt-2 text-base font-semibold text-ink-950">{name}</p>
      <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-600">
        <span>Payout recipient address:</span>
        <code
          title={address}
          className="rounded border border-line bg-surface px-2 py-0.5 font-mono text-xs font-medium text-ink-950"
        >
          {truncateHex(address, 10, 8)}
        </code>
      </div>
    </div>
  );
}
