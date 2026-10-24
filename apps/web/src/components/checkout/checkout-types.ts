export type CheckoutWalletStatus =
  | "connected"
  | "disconnected"
  | "wrong-network";

export type CheckoutActionState =
  | { phase: "idle" }
  | { phase: "awaiting-signature" }
  | { phase: "confirming"; txHash: `0x${string}`; explorerUrl: string }
  | {
      phase: "confirmed";
      txHash: `0x${string}`;
      explorerUrl: string;
      orderId: string;
    }
  | {
      phase: "rejected";
      message: string;
    }
  | {
      phase: "reverted";
      message: string;
      reasonCode?: string;
      txHash?: `0x${string}`;
      explorerUrl?: string;
    };

export interface PrivateDeliveryDraft {
  recipientName: string;
  cityAndDistrict: string;
  deliveryLine: string;
  contactNote: string;
}

export interface CreateOrderPresentationInput {
  productSlug: string;
  amountMon: string;
  sellerAddress: `0x${string}`;
  opaqueOrderRef: `0x${string}`;
  privateDelivery: PrivateDeliveryDraft;
}

export const DEFAULT_DELIVERY_DRAFT: PrivateDeliveryDraft = {
  recipientName: "Kaan Demir",
  cityAndDistrict: "Çankaya, Ankara",
  deliveryLine: "Söğütözü Cad. No: 42, Floor 4",
  contactNote: "Deliver to reception desk",
};

export const SAMPLE_MONAD_EXPLORER_BASE = "https://testnet.monadvision.com/tx";

/**
 * Generates a deterministic 32-byte hex reference representing the opaque
 * off-chain order reference hash passed to createOrder(bytes32 orderRef, address seller).
 * Personal delivery fields are never encoded into this value.
 */
export function buildOpaqueOrderRefPreview(productSlug: string): `0x${string}` {
  const clean = productSlug.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const hexSeed = Array.from(clean)
    .map((ch) => ch.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
  const padded = `5f9c2810${hexSeed}`.padEnd(64, "0").slice(0, 64);
  return `0x${padded}`;
}
