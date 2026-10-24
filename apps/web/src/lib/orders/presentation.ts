import type { StatusTone } from "@/components/ui/status-chip";

export type OrderStatus = "paid" | "shipped" | "completed" | "disputed";

export type ConnectedWalletRole =
  | "buyer"
  | "seller"
  | "stranger"
  | "disconnected";

export type OrderActionState =
  | { phase: "idle" }
  | { phase: "awaiting-signature"; actionName: string }
  | {
      phase: "confirming";
      actionName: string;
      txHash: `0x${string}`;
      explorerUrl: string;
    }
  | {
      phase: "confirmed";
      actionName: string;
      txHash: `0x${string}`;
      explorerUrl: string;
    }
  | {
      phase: "failed";
      actionName: string;
      message: string;
      txHash?: `0x${string}`;
      explorerUrl?: string;
    };

export type OrderActions = {
  onMarkShipped?: () => Promise<void>;
  onConfirmDelivery?: () => Promise<void>;
  onOpenDispute?: () => Promise<void>;
  onClaimAfterTimeout?: () => Promise<void>;
};

export interface OrderCallerPermissions {
  canConfirmDelivery: boolean;
  canOpenDispute: boolean;
  canMarkShipped: boolean;
  canClaimAfterTimeout: boolean;
  connectedRole: ConnectedWalletRole;
  connectedAddress?: `0x${string}`;
}

export interface OrderTransactionRecord {
  label: string;
  txHash: `0x${string}`;
  explorerUrl: string;
  state: "confirmed" | "pending" | "failed";
}

export interface NormalizedOrderView {
  orderId: string;
  orderRef: `0x${string}`;
  productSlug: string;
  productName: string;
  productSku: string;
  productImageSrc: string;
  productImageAlt: string;
  amountMon: string;
  buyerAddress: `0x${string}`;
  sellerName: string;
  sellerAddress: `0x${string}`;
  status: OrderStatus;
  reviewEndsAtSeconds: number | null;
  demoTrackingRef: string | null;
  privateDeliverySummary: string;
  settlementMethod?: "buyer-confirmed" | "seller-timeout-claim";
  transactions: OrderTransactionRecord[];
}

export interface StatusCopyPresentation {
  chipLabel: string;
  chipTone: StatusTone;
  primaryCopy: string;
  supportingCopy: string;
  nextPermittedActor: string;
  nextPermittedActionSummary: string;
}

export function getOrderStatusCopy(
  status: OrderStatus,
  remainingSeconds: number | null,
  settlementMethod?: "buyer-confirmed" | "seller-timeout-claim",
): StatusCopyPresentation {
  switch (status) {
    case "paid":
      return {
        chipLabel: "FUNDS SECURED",
        chipTone: "violet",
        primaryCopy: "Funds secured in escrow",
        supportingCopy: "The seller can ship, but cannot receive payment yet.",
        nextPermittedActor: "Seller (to ship) or Buyer (to dispute)",
        nextPermittedActionSummary:
          "Seller calls markShipped(orderId) to start the 5-minute review window, or buyer may open a dispute.",
      };

    case "shipped": {
      const isExpired =
        remainingSeconds !== null && remainingSeconds <= 0;
      if (isExpired) {
        return {
          chipLabel: "00:00 REVIEW EXPIRED",
          chipTone: "warning",
          primaryCopy: "Review window ended — seller may claim payment",
          supportingCopy:
            "The five-minute review timer expired without a dispute. The seller now has the right to call claimAfterTimeout(orderId), or the buyer may still confirm delivery before the seller claims.",
          nextPermittedActor: "Seller (timeout claim) or Buyer (confirm)",
          nextPermittedActionSummary:
            "Seller can claim escrow via claimAfterTimeout(orderId); openDispute reverts now that reviewEndsAt has passed.",
        };
      }

      const mm = Math.floor((remainingSeconds ?? 272) / 60)
        .toString()
        .padStart(2, "0");
      const ss = ((remainingSeconds ?? 272) % 60).toString().padStart(2, "0");

      return {
        chipLabel: `${mm}:${ss} TO REVIEW`,
        chipTone: "warning",
        primaryCopy: "Seller shipped your order",
        supportingCopy:
          "Confirm delivery or open a dispute before the review timer ends. If the five-minute window expires without a dispute, the seller has the right to claim payment.",
        nextPermittedActor: "Recorded buyer wallet",
        nextPermittedActionSummary:
          "Buyer calls confirmDelivery(orderId) to release funds immediately, or openDispute(orderId) before the timer reaches 00:00.",
      };
    }

    case "completed":
      return {
        chipLabel: "SELLER PAID",
        chipTone: "success",
        primaryCopy: "Seller paid",
        supportingCopy:
          settlementMethod === "seller-timeout-claim"
            ? "Payment was released to the seller via claimAfterTimeout after the five-minute review window ended without a dispute."
            : "Payment was released by buyer confirmation or the review timeout.",
        nextPermittedActor: "None (terminal state)",
        nextPermittedActionSummary:
          "Escrow is settled. All escrowed test MON has been transferred to the seller wallet.",
      };

    case "disputed":
      return {
        chipLabel: "DISPUTE OPEN",
        chipTone: "danger",
        primaryCopy: "Dispute open",
        supportingCopy: "Funds remain locked; automated payout is disabled.",
        nextPermittedActor: "None in MVP (funds frozen)",
        nextPermittedActionSummary:
          "Both confirmDelivery and seller claimAfterTimeout revert while status is DISPUTED.",
      };
  }
}

export interface TimelineStepItem {
  stepNumber: number;
  title: string;
  detail: string;
  state: "done" | "current" | "upcoming";
  actorBadge: string;
}

export function getEscrowTimelineSteps(
  status: OrderStatus,
  remainingSeconds: number | null,
): TimelineStepItem[] {
  const isExpired = remainingSeconds !== null && remainingSeconds <= 0;

  return [
    {
      stepNumber: 1,
      title: "Buyer paid",
      detail: "Exact test MON sent to createOrder(orderRef, seller).",
      state: "done",
      actorBadge: "BUYER WALLET",
    },
    {
      stepNumber: 2,
      title: "Funds locked",
      detail:
        status === "paid"
          ? "Held in MonVaultEscrow. Waiting for seller to ship."
          : "Escrow deposit verified on Monad testnet.",
      state: status === "paid" ? "current" : "done",
      actorBadge: "MONVAULTESCROW",
    },
    {
      stepNumber: 3,
      title: "Seller shipped",
      detail:
        status === "paid"
          ? "Seller marks shipped and starts 5-minute review window."
          : "Order marked shipped; 5-minute review deadline recorded.",
      state: status === "paid" ? "upcoming" : "done",
      actorBadge: "SELLER WALLET",
    },
    {
      stepNumber: 4,
      title: "Buyer review",
      detail:
        status === "shipped"
          ? isExpired
            ? "5-minute window ended without dispute; seller can claim."
            : "Buyer can confirm delivery or open a dispute before 00:00."
          : status === "paid"
            ? "5-minute countdown starts after shipment."
            : "Review window completed.",
      state:
        status === "shipped"
          ? "current"
          : status === "paid"
            ? "upcoming"
            : "done",
      actorBadge: "05:00 WINDOW",
    },
    {
      stepNumber: 5,
      title:
        status === "disputed"
          ? "Dispute open"
          : status === "completed"
            ? "Seller paid"
            : "Seller paid / dispute open",
      detail:
        status === "completed"
          ? "Exact test MON transferred to seller wallet."
          : status === "disputed"
            ? "Funds frozen in contract; timeout claim blocked."
            : "Terminal settlement via confirmation, timeout claim, or dispute.",
      state:
        status === "completed" || status === "disputed"
          ? "current"
          : "upcoming",
      actorBadge: "SETTLEMENT",
    },
  ];
}

export function formatReviewCountdown(remainingSeconds: number | null): {
  clock: string;
  plainStatus: string;
  isExpired: boolean;
} {
  if (remainingSeconds === null) {
    return {
      clock: "05:00",
      plainStatus: "5-minute review timer starts once the seller marks shipped",
      isExpired: false,
    };
  }

  if (remainingSeconds <= 0) {
    return {
      clock: "00:00",
      plainStatus:
        "Review window expired — seller now has the right to claim payment",
      isExpired: true,
    };
  }

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const clock = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return {
    clock,
    plainStatus: `${minutes}m ${seconds
      .toString()
      .padStart(2, "0")}s remaining before seller can claim after timeout`,
    isExpired: false,
  };
}
