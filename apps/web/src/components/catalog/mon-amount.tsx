export interface MonAmountProps {
  amount: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTestnetTag?: boolean;
  className?: string;
}

const sizeStyles: Record<NonNullable<MonAmountProps["size"]>, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl md:text-2xl",
  xl: "text-2xl md:text-3xl",
};

export function MonAmount({
  amount,
  size = "md",
  showTestnetTag = true,
  className = "",
}: MonAmountProps) {
  return (
    <span
      className={`inline-flex flex-wrap items-baseline gap-1.5 font-mono font-semibold tracking-[-0.02em] text-ink-950 tabular-nums ${sizeStyles[size]} ${className}`.trim()}
    >
      <span>{amount}</span>
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
        test MON
      </span>
      {showTestnetTag ? (
        <span className="rounded border border-line bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-ink-600">
          FAUCET ONLY
        </span>
      ) : null}
    </span>
  );
}
