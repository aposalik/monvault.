import { StatusChip } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";
import {
  formatReviewCountdown,
  type OrderStatus,
} from "@/lib/orders/presentation";

export interface ReviewCountdownCardProps {
  status: OrderStatus;
  remainingSeconds: number | null;
  onAdjustPreviewSeconds?: (seconds: number) => void;
}

export function ReviewCountdownCard({
  status,
  remainingSeconds,
  onAdjustPreviewSeconds,
}: ReviewCountdownCardProps) {
  const { clock, plainStatus, isExpired } =
    formatReviewCountdown(remainingSeconds);

  const isShipped = status === "shipped";
  const isCompleted = status === "completed";
  const isDisputed = status === "disputed";

  return (
    <Surface tone="raised" radius="card" className="p-6 md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
          FIVE-MINUTE DEMO REVIEW WINDOW
        </span>
        {isCompleted ? (
          <StatusChip label="WINDOW CLOSED · SETTLED" tone="success" />
        ) : isDisputed ? (
          <StatusChip label="FROZEN BY DISPUTE" tone="danger" />
        ) : isShipped && isExpired ? (
          <StatusChip label="TIMEOUT REACHED" tone="warning" />
        ) : isShipped ? (
          <StatusChip label="COUNTDOWN ACTIVE" tone="warning" />
        ) : (
          <StatusChip label="AWAITING SHIPMENT" tone="neutral" />
        )}
      </div>

      <div className="mt-5 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
            {isCompleted
              ? "FINAL REVIEW TIMER STATE"
              : isDisputed
                ? "DISPUTE LOCK ACTIVE"
                : "TIME REMAINING FOR BUYER REVIEW"}
          </p>

          {/* Fixed-width tabular-nums display prevents any layout shift on 1s updates */}
          <div className="mt-2 flex items-baseline gap-3">
            <span
              className="inline-block min-w-[5.5ch] font-mono text-4xl font-semibold tracking-[-0.04em] text-ink-950 tabular-nums sm:text-5xl"
              aria-label={`Review countdown clock ${
                isCompleted ? "00:00" : isDisputed ? "LOCKED" : clock
              }`}
            >
              {isCompleted ? "00:00" : isDisputed ? "HOLD" : clock}
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
              {isDisputed ? "ESCROW FROZEN" : "MM:SS (300S WINDOW)"}
            </span>
          </div>

          {/* Non-color accessible text explanation required by F4 */}
          <p className="mt-2 text-sm font-medium text-ink-950">
            {isCompleted
              ? "Order is completed; seller has been paid."
              : isDisputed
                ? "Dispute opened before deadline; seller timeout claim is permanently blocked."
                : plainStatus}
          </p>
        </div>

        {isShipped && onAdjustPreviewSeconds ? (
          <div className="flex flex-col gap-1.5 rounded-[14px] border border-line bg-canvas p-3">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-600">
              DEMO TIMER CONTROLS
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => onAdjustPreviewSeconds(272)}
                className="rounded-lg border border-line bg-surface px-2.5 py-1 font-mono text-[11px] font-semibold text-ink-800 hover:bg-muted cursor-pointer"
              >
                Reset 04:32
              </button>
              <button
                type="button"
                onClick={() => onAdjustPreviewSeconds(15)}
                className="rounded-lg border border-line bg-surface px-2.5 py-1 font-mono text-[11px] font-semibold text-ink-800 hover:bg-muted cursor-pointer"
              >
                Jump to 00:15
              </button>
              <button
                type="button"
                onClick={() => onAdjustPreviewSeconds(0)}
                className="rounded-lg border border-warning-700/30 bg-warning-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-warning-700 hover:bg-warning-700 hover:text-white cursor-pointer"
              >
                Expire (00:00)
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Explicit seller timeout claim rule disclosure required by F4 */}
      <div className="mt-5 rounded-[14px] border border-line bg-muted p-4 text-xs leading-5 text-ink-800">
        <strong className="font-semibold text-ink-950">
          Timeout claim rule (<code className="font-mono">reviewEndsAt</code>):
        </strong>{" "}
        Shipping sets{" "}
        <code className="font-mono text-[11px]">
          reviewEndsAt = block.timestamp + 5 minutes
        </code>
        . While the timer is active, only the buyer can release funds or open a
        dispute. If the 5-minute window expires without a buyer dispute,{" "}
        <strong className="font-semibold text-ink-950">
          the seller has the right to claim the escrowed test MON
        </strong>{" "}
        by calling{" "}
        <code className="font-mono text-[11px]">
          claimAfterTimeout(orderId)
        </code>
        .
      </div>
    </Surface>
  );
}
