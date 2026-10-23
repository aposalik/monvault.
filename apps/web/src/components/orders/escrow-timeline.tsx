import { StatusChip } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";
import {
  getEscrowTimelineSteps,
  type OrderStatus,
} from "@/lib/orders/presentation";

export interface EscrowTimelineProps {
  status: OrderStatus;
  remainingSeconds: number | null;
  nextPermittedActor: string;
  nextPermittedActionSummary: string;
}

export function EscrowTimeline({
  status,
  remainingSeconds,
  nextPermittedActor,
  nextPermittedActionSummary,
}: EscrowTimelineProps) {
  const steps = getEscrowTimelineSteps(status, remainingSeconds);

  return (
    <Surface tone="raised" radius="card" className="p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
            ON-CHAIN ESCROW TIMELINE
          </span>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.025em] text-ink-950">
            Order progression across <code className="font-mono text-lg">MonVaultEscrow</code>
          </h2>
        </div>
        <StatusChip
          label={`CURRENT: ${status.toUpperCase()}`}
          tone={
            status === "completed"
              ? "success"
              : status === "disputed"
                ? "danger"
                : status === "shipped"
                  ? "warning"
                  : "violet"
          }
        />
      </div>

      {/* Vertical on mobile, 5-column horizontal on wide screens per DESIGN.md section 8 */}
      <ol className="mt-6 grid gap-3.5 lg:grid-cols-5">
        {steps.map((step) => {
          const isDone = step.state === "done";
          const isCurrent = step.state === "current";

          return (
            <li
              key={step.stepNumber}
              aria-current={isCurrent ? "step" : undefined}
              className={`flex flex-col justify-between rounded-[18px] p-4 transition-colors ${
                isCurrent
                  ? "border-2 border-violet-600 bg-canvas text-ink-950 shadow-[0_12px_28px_rgba(103,56,242,0.08)]"
                  : isDone
                    ? "border border-success-700/30 bg-success-100/50 text-ink-950"
                    : "border border-line bg-muted/60 text-ink-600"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold tabular-nums">
                    0{step.stepNumber}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] ${
                      isCurrent
                        ? "bg-violet-600 text-white"
                        : isDone
                          ? "bg-success-100 text-success-700"
                          : "bg-surface text-ink-600"
                    }`}
                  >
                    {isDone ? "✓ DONE" : isCurrent ? "● CURRENT" : "○ UPCOMING"}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-semibold tracking-[-0.02em]">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-ink-600">
                  {step.detail}
                </p>
              </div>

              <div className="mt-4 border-t border-line/80 pt-2.5">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                  {step.actorBadge}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Current step permitted action & authorized caller summary */}
      <div className="mt-6 flex flex-col justify-between gap-3 rounded-[14px] border border-line bg-muted p-4 sm:flex-row sm:items-center">
        <div>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-violet-700">
            NEXT PERMITTED CONTRACT TRANSITION
          </span>
          <p className="mt-1 text-sm font-medium text-ink-950">
            {nextPermittedActionSummary}
          </p>
        </div>
        <div className="shrink-0 rounded-lg border border-line bg-surface px-3 py-2 text-right">
          <span className="block font-mono text-[10px] uppercase tracking-[0.08em] text-ink-600">
            AUTHORIZED CALLER
          </span>
          <span className="font-mono text-xs font-semibold text-ink-950">
            {nextPermittedActor}
          </span>
        </div>
      </div>
    </Surface>
  );
}
