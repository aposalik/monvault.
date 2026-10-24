type ErrorLike = {
  cause?: unknown;
  code?: number;
  data?: { errorName?: string };
  message?: string;
  name?: string;
  shortMessage?: string;
};

const CONTRACT_ERROR_MESSAGES: Readonly<Record<string, string>> = {
  InvalidPayment: "The escrow payment must be greater than zero.",
  InvalidSeller: "The configured seller wallet is invalid.",
  InvalidOrderReference: "The order reference is invalid.",
  DuplicateOrderReference: "This order reference has already been used.",
  OrderNotFound: "The requested escrow order does not exist.",
  UnauthorizedBuyer: "Connect the buyer wallet that created this order.",
  UnauthorizedSeller: "Connect the seller wallet recorded for this order.",
  InvalidOrderStatus: "This action is not valid for the order's current state.",
  DisputeNotAllowed: "A dispute cannot be opened for the order's current state.",
  ReviewWindowActive: "The seller cannot claim while the buyer review window is active.",
  ReviewWindowClosed: "The buyer review window has already closed.",
  TransferFailed: "The contract could not transfer payment to the seller.",
  ReentrantCall: "The contract rejected an unsafe repeated payout call.",
};

function errorChain(error: unknown): ErrorLike[] {
  const chain: ErrorLike[] = [];
  const seen = new Set<unknown>();
  let current = error;

  while (current && typeof current === "object" && !seen.has(current)) {
    seen.add(current);
    const entry = current as ErrorLike;
    chain.push(entry);
    current = entry.cause;
  }

  return chain;
}

export function normalizeChainError(error: unknown): string {
  const chain = errorChain(error);

  if (
    chain.some(
      (entry) =>
        entry.code === 4001 ||
        entry.name === "UserRejectedRequestError" ||
        entry.message?.toLowerCase().includes("user rejected") ||
        entry.shortMessage?.toLowerCase().includes("user rejected"),
    )
  ) {
    return "The wallet request was cancelled. No transaction was submitted.";
  }

  for (const entry of chain) {
    const errorName = entry.data?.errorName;
    if (errorName && CONTRACT_ERROR_MESSAGES[errorName]) {
      return CONTRACT_ERROR_MESSAGES[errorName];
    }
  }

  if (chain.some((entry) => entry.code === 4902)) {
    return "Monad Testnet is not configured in this wallet.";
  }

  const conciseMessage = chain.find((entry) => entry.shortMessage)?.shortMessage;
  if (conciseMessage) return conciseMessage;

  return "The wallet or Monad RPC could not complete this request. No success was recorded.";
}

export function isMissingOrderError(error: unknown): boolean {
  return errorChain(error).some((entry) => entry.data?.errorName === "OrderNotFound");
}
