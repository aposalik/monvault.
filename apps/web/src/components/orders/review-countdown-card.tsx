import { StatusChip } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";
import {
  formatReviewCountdown,
  type OrderStatus,
} from "@/lib/orders/presentation";

export interface ReviewCountdownCardProps {
  status: OrderStatus;
  remainingSeconds: number | null;
}

export function ReviewCountdownCard({
  status,
  remainingSeconds,
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
          BUYER DELIVERY REVIEW WINDOW
        </span>
        {isCompleted ? (
          <StatusChip label="SETTLED" tone="success" />
        ) : isDisputed ? (
          <StatusChip label="FROZEN BY DISPUTE" tone="danger" />
        ) : isShipped && isExpired ? (
          <StatusChip label="REVIEW PERIOD ENDED" tone="warning" />
        ) : isShipped ? (
          <StatusChip label="REVIEW ACTIVE" tone="warning" />
        ) : (
          <StatusChip label="STARTS ON SHIPMENT" tone="neutral" />
        )}
      </div>

      <div className="mt-5">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
          {isCompleted
            ? "SETTLEMENT STATUS"
            : isDisputed
              ? "DISPUTE LOCK ACTIVE"
              : "REMAINING REVIEW TIME"}
        </p>

        {/* Fixed-width tabular-nums display prevents layout shift */}
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
            {isDisputed ? "ESCROW FROZEN" : "CONTRACT REVIEW WINDOW"}
          </span>
        </div>

        <p className="mt-2 text-sm font-medium text-ink-950">
          {isCompleted
            ? "Order is completed; escrowed MON has been released to the seller."
            : isDisputed
              ? "Dispute opened before deadline; automatic seller payout is blocked."
              : plainStatus}
        </p>
      </div>

      <div className="mt-5 rounded-[14px] border border-line bg-muted p-4 text-xs leading-5 text-ink-800">
        <strong className="font-semibold text-ink-950">
          On-chain review rule (<code className="font-mono">reviewEndsAt</code>
          ):
        </strong>{" "}
        When the seller marks the order shipped,{" "}
        <code className="font-mono text-[11px]">MonVaultEscrow</code> starts the
        buyer review window. Confirm delivery once your package arrives to
        release funds immediately, or open a dispute if there is an issue. If
        the review window ends without a dispute, the seller becomes eligible to
        claim payment.
      </div>
    </Surface>
  );
}
