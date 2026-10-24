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
        chipLabel: "PAID INTO ESCROW",
        chipTone: "violet",
        primaryCopy: "Paid into Escrow — Awaiting Seller Dispatch",
        supportingCopy:
          "Your payment is locked in the MonVaultEscrow smart contract. The seller is notified to ship your item and cannot withdraw funds early.",
        nextPermittedActor: "Seller (to ship) or Buyer (to dispute)",
        nextPermittedActionSummary:
          "Seller calls markShipped(orderId) once dispatched, or buyer may open a dispute.",
      };

    case "shipped": {
      const isExpired = remainingSeconds !== null && remainingSeconds <= 0;
      if (isExpired) {
        return {
          chipLabel: "REVIEW PERIOD ENDED",
          chipTone: "warning",
          primaryCopy: "Review Period Ended — Eligible for Settlement",
          supportingCopy:
            "The delivery review window has ended without a dispute. The seller may claim payment, or the buyer can confirm delivery.",
          nextPermittedActor: "Seller (timeout claim) or Buyer (confirm)",
          nextPermittedActionSummary:
            "Seller can claim escrow via claimAfterTimeout(orderId), or buyer can confirm delivery.",
        };
      }

      return {
        chipLabel: "SHIPPED · IN REVIEW",
        chipTone: "warning",
        primaryCopy: "Order Shipped — Inspect & Confirm Delivery",
        supportingCopy:
          "Your package has been dispatched by the seller. Confirm delivery once received to release escrow funds, or open a dispute if there is an issue.",
        nextPermittedActor: "Buyer Wallet",
        nextPermittedActionSummary:
          "Buyer calls confirmDelivery(orderId) to release payment to the seller, or openDispute(orderId) to freeze funds.",
      };
    }

    case "completed":
      return {
        chipLabel: "COMPLETED",
        chipTone: "success",
        primaryCopy: "Completed — Escrow Released to Seller",
        supportingCopy:
          settlementMethod === "seller-timeout-claim"
            ? "Escrow funds were released to the seller after the delivery review period concluded without a dispute."
            : "Delivery was confirmed by the buyer and escrowed MON has been transferred to the seller.",
        nextPermittedActor: "None (Settled)",
        nextPermittedActionSummary:
          "Order settlement is complete. Escrowed MON has been released to the seller wallet.",
      };

    case "disputed":
      return {
        chipLabel: "DISPUTED · FUNDS FROZEN",
        chipTone: "danger",
        primaryCopy: "Disputed — Escrow Funds Frozen",
        supportingCopy:
          "The buyer opened a dispute for this order. Funds remain locked inside MonVaultEscrow and automatic seller payouts are disabled.",
        nextPermittedActor: "None (Escrow Frozen)",
        nextPermittedActionSummary:
          "Both confirmDelivery and claimAfterTimeout are blocked while the order is in DISPUTED state.",
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
      title: "Paid into Escrow",
      detail:
        status === "paid"
          ? "Funds locked in MonVaultEscrow smart contract. Waiting for seller dispatch."
          : "Funds locked in MonVaultEscrow smart contract on Monad.",
      state: status === "paid" ? "current" : "done",
      actorBadge: "MONVAULT ESCROW",
    },
    {
      stepNumber: 2,
      title: "Shipped",
      detail:
        status === "paid"
          ? "Seller dispatches item and records carrier & tracking reference."
          : "Seller has dispatched the item; carrier & tracking reference recorded.",
      state: status === "paid" ? "upcoming" : "done",
      actorBadge: "SELLER DISPATCH",
    },
    {
      stepNumber: 3,
      title: "Delivered / Review Period",
      detail:
        status === "shipped"
          ? isExpired
            ? "Review window ended without a dispute; ready for settlement."
            : "Buyer inspects package and confirms receipt or opens a dispute."
          : status === "paid"
            ? "Starts automatically once seller marks the order shipped."
            : "Delivery review period completed.",
      state:
        status === "shipped"
          ? "current"
          : status === "paid"
            ? "upcoming"
            : "done",
      actorBadge: "BUYER REVIEW",
    },
    {
      stepNumber: 4,
      title:
        status === "disputed"
          ? "Disputed"
          : status === "completed"
            ? "Completed"
            : "Completed / Disputed",
      detail:
        status === "completed"
          ? "Escrow released to seller wallet on-chain."
          : status === "disputed"
            ? "Buyer opened a dispute; escrow funds are frozen in the contract."
            : "Escrow releases to seller upon confirmation, or freezes on dispute.",
      state:
        status === "completed" || status === "disputed"
          ? "current"
          : "upcoming",
      actorBadge: status === "disputed" ? "FUNDS FROZEN" : "SETTLEMENT",
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
      plainStatus:
        "Review timer starts once the seller marks the order shipped.",
      isExpired: false,
    };
  }

  const clamped = Math.max(0, remainingSeconds);
  const minutes = Math.floor(clamped / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (clamped % 60).toString().padStart(2, "0");
  const clock = `${minutes}:${seconds}`;

  if (clamped === 0) {
    return {
      clock: "00:00",
      plainStatus:
        "Review period ended without a dispute. Seller is eligible to claim payment, or buyer may confirm delivery.",
      isExpired: true,
    };
  }

  return {
    clock,
    plainStatus: `${minutes}m ${seconds}s remaining in buyer review window. Confirm delivery or open a dispute before 00:00.`,
    isExpired: false,
  };
}
