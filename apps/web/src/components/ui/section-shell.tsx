import type { HTMLAttributes, ReactNode } from "react";

export type SectionSurface = "canvas" | "raised" | "muted" | "night";

const surfaceClasses: Record<SectionSurface, string> = {
  canvas: "bg-canvas text-ink-950",
  raised: "bg-surface text-ink-950 border-y border-line",
  muted: "bg-muted text-ink-950 border-y border-line",
  night: "bg-night text-white",
};

export interface SectionShellProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  id?: string;
  surface?: SectionSurface;
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  headerAction?: ReactNode;
  children: ReactNode;
}

export function SectionShell({
  id,
  surface = "canvas",
  eyebrow,
  title,
  description,
  headerAction,
  className = "",
  children,
  ...props
}: SectionShellProps) {
  const isNight = surface === "night";

  return (
    <section
      id={id}
      className={`px-5 py-[88px] md:px-10 md:py-[120px] lg:px-[72px] lg:py-[152px] ${surfaceClasses[surface]} ${className}`.trim()}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1296px]">
        {eyebrow || title || description ? (
          <div className="mb-12 flex flex-col justify-between gap-6 md:mb-16 lg:flex-row lg:items-end">
            <div className="max-w-[780px]">
              {eyebrow ? (
                <p
                  className={`font-mono text-xs font-semibold uppercase tracking-[0.08em] ${
                    isNight ? "text-lilac-300" : "text-violet-700"
                  }`}
                >
                  {eyebrow}
                </p>
              ) : null}
              {title ? (
                <h2 className="mt-3 text-4xl font-semibold leading-[1.04] tracking-[-0.04em] md:text-5xl lg:text-[60px]">
                  {title}
                </h2>
              ) : null}
            </div>
            {description || headerAction ? (
              <div className="flex flex-col items-start gap-4 lg:max-w-[420px]">
                {description ? (
                  <p
                    className={`text-base leading-7 md:text-lg ${
                      isNight ? "text-lilac-150/85" : "text-ink-600"
                    }`}
                  >
                    {description}
                  </p>
                ) : null}
                {headerAction}
              </div>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
