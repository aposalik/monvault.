export interface MonAmountProps {
  amount: string | number;
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
  className = "",
}: MonAmountProps) {
  const formatted =
    typeof amount === "number"
      ? amount.toFixed(2)
      : Number.isNaN(Number.parseFloat(amount))
        ? amount
        : Number.parseFloat(amount).toFixed(2);

  return (
    <span
      className={`inline-flex flex-wrap items-baseline gap-1.5 font-mono font-semibold tracking-[-0.02em] text-ink-950 tabular-nums ${sizeStyles[size]} ${className}`.trim()}
    >
      <span>{formatted}</span>
      <span className="text-xs font-bold uppercase tracking-[0.08em] text-violet-700">
        MON
      </span>
    </span>
  );
}
