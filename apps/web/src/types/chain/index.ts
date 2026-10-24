import type { Address, Hash, Hex } from "viem";

export type OrderStatus = "paid" | "shipped" | "completed" | "disputed";

export type ChainOrder = {
  id: bigint;
  orderRef: Hex;
  buyer: Address;
  seller: Address;
  amountWei: bigint;
  reviewEndsAt: number | null;
  status: OrderStatus;
};

export type OrderPermissions = {
  canMarkShipped: boolean;
  canConfirmDelivery: boolean;
  canOpenDispute: boolean;
  canClaimAfterTimeout: boolean;
};

export type WalletConnectionState =
  | { phase: "disconnected" }
  | { phase: "connecting" }
  | { phase: "wrong-network"; address: Address; chainId: number }
  | { phase: "ready"; address: Address }
  | { phase: "failed"; message: string };

export type OrderActionState =
  | { phase: "idle" }
  | { phase: "awaiting-signature" }
  | { phase: "confirming"; txHash: Hash }
  | { phase: "confirmed"; txHash: Hash }
  | { phase: "failed"; message: string; txHash?: Hash };

export type TransactionProof = {
  txHash: Hash;
  explorerUrl: string;
  blockNumber: bigint;
};

export type CreateOrderInput = {
  orderRef: Hex;
  seller: Address;
  amountWei: bigint;
};

export type CreateOrderResult = {
  orderId: bigint;
  proof: TransactionProof;
};

export type OrderReadState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "ready"; order: ChainOrder }
  | { phase: "missing" }
  | { phase: "failed"; message: string };
