import type { ReactNode } from "react";

export type StatusTone =
  | "violet"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

const toneStyles: Record<StatusTone, string> = {
  violet: "bg-lilac-150 text-violet-700 border-lilac-300",
  success: "bg-success-100 text-success-700 border-success-700/25",
  warning: "bg-warning-100 text-warning-700 border-warning-700/25",
  danger: "bg-danger-100 text-danger-700 border-danger-700/25",
  info: "bg-info-100 text-info-700 border-info-700/25",
  neutral: "bg-surface text-ink-600 border-line",
};

function DefaultStatusIcon({ tone }: { tone: StatusTone }) {
  switch (tone) {
    case "violet":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="size-3.5 shrink-0 fill-none stroke-current stroke-[1.75]"
        >
          <rect x="3" y="7" width="10" height="7" rx="1.5" />
          <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
        </svg>
      );
    case "success":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="size-3.5 shrink-0 fill-none stroke-current stroke-[1.8]"
        >
          <circle cx="8" cy="8" r="6" />
          <path d="m5.5 8 1.8 1.8L10.8 6.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "warning":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="size-3.5 shrink-0 fill-none stroke-current stroke-[1.75]"
        >
          <circle cx="8" cy="8" r="6" />
          <path d="M8 5v3.2l2.2 1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "danger":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="size-3.5 shrink-0 fill-none stroke-current stroke-[1.75]"
        >
          <path d="M8 2.5 14 13H2L8 2.5Z" strokeLinejoin="round" />
          <path d="M8 6.5v3" strokeLinecap="round" />
          <circle cx="8" cy="11.3" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case "info":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="size-3.5 shrink-0 fill-none stroke-current stroke-[1.75]"
        >
          <circle cx="8" cy="8" r="6" />
          <path d="M8 7.2v3.6" strokeLinecap="round" />
          <circle cx="8" cy="5" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case "neutral":
      return (
        <span
          aria-hidden="true"
          className="size-2 shrink-0 rounded-full bg-current"
        />
      );
  }
}

export interface StatusChipProps {
  label: string;
  tone?: StatusTone;
  icon?: ReactNode;
  className?: string;
}

export function StatusChip({
  label,
  tone = "neutral",
  icon,
  className = "",
}: StatusChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] tabular-nums ${toneStyles[tone]} ${className}`.trim()}
    >
      {icon ?? <DefaultStatusIcon tone={tone} />}
      <span>{label}</span>
    </span>
  );
}
