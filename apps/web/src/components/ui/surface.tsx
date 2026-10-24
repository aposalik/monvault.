import type { HTMLAttributes, ReactNode } from "react";

export type SurfaceTone = "raised" | "canvas" | "muted" | "night";
export type SurfaceRadius = "card" | "control";

const toneClasses: Record<SurfaceTone, string> = {
  raised:
    "bg-surface text-ink-950 border-line shadow-[0_20px_48px_rgba(16,11,43,0.05)]",
  canvas: "bg-canvas text-ink-950 border-line",
  muted: "bg-muted text-ink-950 border-line",
  night: "bg-night text-white border-ink-800",
};

const radiusClasses: Record<SurfaceRadius, string> = {
  card: "rounded-[24px]",
  control: "rounded-[14px]",
};

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  tone?: SurfaceTone;
  radius?: SurfaceRadius;
  selected?: boolean;
  children: ReactNode;
}

export function Surface({
  tone = "raised",
  radius = "card",
  selected = false,
  className = "",
  children,
  ...props
}: SurfaceProps) {
  const borderWidth = selected ? "border-2 border-violet-600" : "border";

  return (
    <div
      className={`${radiusClasses[radius]} ${borderWidth} ${toneClasses[tone]} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
