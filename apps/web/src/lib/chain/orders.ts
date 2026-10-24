import { getAddress, isAddressEqual, type Address, type Hex } from "viem";

import type { ChainOrder, OrderPermissions, OrderStatus } from "@/types/chain";

export type ContractOrderTuple = readonly [
  orderRef: Hex,
  buyer: Address,
  seller: Address,
  amount: bigint,
  reviewEndsAt: bigint,
  status: number,
];

const STATUS_BY_VALUE: Readonly<Record<number, OrderStatus | undefined>> = {
  1: "paid",
  2: "shipped",
  3: "completed",
  4: "disputed",
};

export function normalizeOrderStatus(value: number): OrderStatus {
  const status = STATUS_BY_VALUE[value];
  if (!status) {
    throw new Error(`Unsupported MonVaultEscrow order status: ${value}.`);
  }
  return status;
}

export function normalizeContractOrder(id: bigint, value: ContractOrderTuple): ChainOrder {
  const [orderRef, buyer, seller, amountWei, reviewEndsAt, rawStatus] = value;

  if (id <= 0n) throw new Error("Order ID must be greater than zero.");
  if (amountWei <= 0n) throw new Error("Escrow amount must be greater than zero.");

  const deadline = Number(reviewEndsAt);
  if (!Number.isSafeInteger(deadline)) {
    throw new Error("Review deadline cannot be represented safely in JavaScript.");
  }

  return {
    id,
    orderRef,
    buyer: getAddress(buyer),
    seller: getAddress(seller),
    amountWei,
    reviewEndsAt: deadline === 0 ? null : deadline,
    status: normalizeOrderStatus(rawStatus),
  };
}

export function getOrderPermissions(
  order: ChainOrder,
  connectedAddress: Address | undefined,
  nowSeconds: number,
): OrderPermissions {
  const isBuyer = Boolean(
    connectedAddress && isAddressEqual(getAddress(connectedAddress), order.buyer),
  );
  const isSeller = Boolean(
    connectedAddress && isAddressEqual(getAddress(connectedAddress), order.seller),
  );
  const reviewIsOpen =
    order.reviewEndsAt !== null && Number.isFinite(nowSeconds) && nowSeconds < order.reviewEndsAt;
  const reviewHasEnded =
    order.reviewEndsAt !== null && Number.isFinite(nowSeconds) && nowSeconds >= order.reviewEndsAt;

  return {
    canMarkShipped: isSeller && order.status === "paid",
    canConfirmDelivery: isBuyer && order.status === "shipped",
    canOpenDispute:
      isBuyer &&
      (order.status === "paid" || (order.status === "shipped" && reviewIsOpen)),
    canClaimAfterTimeout: isSeller && order.status === "shipped" && reviewHasEnded,
  };
}
