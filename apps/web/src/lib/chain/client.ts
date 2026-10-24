import {
  createPublicClient,
  custom,
  decodeEventLog,
  formatEther,
  http,
  parseEther,
  type EIP1193Provider,
} from "viem";
import { monVaultEscrowAbi } from "./abi";
import {
  DEMO_SELLER_ADDRESS,
  MONVAULT_CONTRACT_ADDRESS,
  monadTestnet,
} from "./config";

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
  }
}

export const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
});

export type EscrowOrderStatus =
  | "none"
  | "paid"
  | "shipped"
  | "completed"
  | "disputed";

export interface OnChainOrder {
  orderId: string;
  orderRef: `0x${string}`;
  buyer: `0x${string}`;
  seller: `0x${string}`;
  amountWei: bigint;
  amountMon: string;
  reviewEndsAt: number;
  status: EscrowOrderStatus;
  rawStatus: number;
}

const STATUS_MAP: Record<number, EscrowOrderStatus> = {
  0: "none",
  1: "paid",
  2: "shipped",
  3: "completed",
  4: "disputed",
};

export async function fetchOnChainOrder(
  orderId: number | string | bigint,
): Promise<OnChainOrder | null> {
  try {
    const idBigInt = BigInt(orderId);
    if (idBigInt <= BigInt(0)) return null;

    const result = await publicClient.readContract({
      address: MONVAULT_CONTRACT_ADDRESS,
      abi: monVaultEscrowAbi,
      functionName: "getOrder",
      args: [idBigInt],
    });

    const [orderRef, buyer, seller, amount, reviewEndsAt, statusNum] = result;

    if (statusNum === 0) return null;

    return {
      orderId: idBigInt.toString(),
      orderRef,
      buyer,
      seller,
      amountWei: amount,
      amountMon: formatEther(amount),
      reviewEndsAt: Number(reviewEndsAt),
      status: STATUS_MAP[statusNum] || "none",
      rawStatus: statusNum,
    };
  } catch (err) {
    console.error("Failed to fetch order from contract:", err);
    return null;
  }
}

export function getExplorerTxUrl(txHash: string): string {
  const base =
    monadTestnet.blockExplorers?.default.url ||
    "https://testnet.monadvision.com";
  return `${base}/tx/${txHash}`;
}

export function getExplorerAddressUrl(address: string): string {
  const base =
    monadTestnet.blockExplorers?.default.url ||
    "https://testnet.monadvision.com";
  return `${base}/address/${address}`;
}

export async function submitCreateOrderOnChain(input: {
  orderRef: `0x${string}`;
  sellerAddress?: `0x${string}`;
  amountMon: string;
}): Promise<{ txHash: `0x${string}`; orderId: string }> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error(
      "No Web3 wallet found. Please install MetaMask to pay with test MON.",
    );
  }

  const { createWalletClient } = await import("viem");
  const walletClient = createWalletClient({
    chain: monadTestnet,
    transport: custom(window.ethereum),
  });

  const [account] = await walletClient.requestAddresses();
  if (!account) {
    throw new Error("No wallet account selected.");
  }

  // Ensure network is Monad Testnet (10143)
  try {
    await walletClient.switchChain({ id: monadTestnet.id });
  } catch (err) {
    const switchError = err as { code?: number; data?: { originalError?: { code?: number } } };
    if (switchError?.code === 4902 || switchError?.data?.originalError?.code === 4902) {
      await walletClient.addChain({ chain: monadTestnet });
    }
  }

  const seller = input.sellerAddress || DEMO_SELLER_ADDRESS;
  const value = parseEther(input.amountMon);

  const hash = await walletClient.writeContract({
    address: MONVAULT_CONTRACT_ADDRESS,
    abi: monVaultEscrowAbi,
    functionName: "createOrder",
    args: [input.orderRef, seller],
    value,
    account,
  });

  const receipt = await publicClient.waitForTransactionReceipt({
    hash,
    confirmations: 1,
  });

  if (receipt.status !== "success") {
    throw new Error(`Transaction reverted on-chain with hash: ${hash}`);
  }

  // Parse OrderPaid event to extract real orderId
  let emittedOrderId = "1";
  for (const log of receipt.logs) {
    try {
      const decoded = decodeEventLog({
        abi: monVaultEscrowAbi,
        data: log.data,
        topics: log.topics,
      });
      if (decoded.eventName === "OrderPaid") {
        const args = decoded.args as { orderId: bigint };
        emittedOrderId = args.orderId.toString();
        break;
      }
    } catch {
      // not an OrderPaid event log
    }
  }

  return {
    txHash: hash,
    orderId: emittedOrderId,
  };
}
