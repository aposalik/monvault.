"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MonAmount } from "@/components/catalog/mon-amount";
import { SellerIdentity } from "@/components/catalog/seller-identity";
import { StatusChip } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";
import { useCartSelection } from "@/data/cart-store";
import { getDefaultProduct, getProductBySlug } from "@/data/catalog";
import {
  buildOpaqueOrderRefPreview,
  type CheckoutActionState,
  type CheckoutWalletStatus,
  type CreateOrderPresentationInput,
  DEFAULT_DEMO_DELIVERY,
  type PrivateDeliveryDraft,
  SAMPLE_MONAD_EXPLORER_BASE,
} from "./checkout-types";
import { DeliveryDetailsForm } from "./delivery-details-form";
import { PrivacySplitBanner } from "./privacy-split-banner";
import { WalletConfirmationPanel } from "./wallet-confirmation-panel";

const SAMPLE_CONFIRMED_TX =
  "0x8a91e04b7d23c91f52b0931a4c601872f490b1d452c7a8d96e3f1b20495a1001" as const;
const SAMPLE_REVERTED_TX =
  "0x3e1094c28f71a62d05b8419c7e2041f893a2c6b174d0e5f91a203b4c5d6e7f80" as const;

type InspectorPreset =
  | "ready"
  | "disconnected"
  | "wrong-network"
  | "awaiting-signature"
  | "confirming"
  | "rejected"
  | "reverted"
  | "confirmed";

export interface CheckoutExperienceProps {
  /**
   * Optional typed callback supplied by Salik's S3/S4 chain layer.
   * When omitted, the checkout runs the deterministic two-stage
   * signature -> receipt preview flow.
   */
  onCreateOrderAction?: (input: CreateOrderPresentationInput) => Promise<void>;
}

export function CheckoutExperience({
  onCreateOrderAction,
}: CheckoutExperienceProps) {
  const searchParams = useSearchParams();
  const querySlug = searchParams.get("product");
  const { product: cartProduct, selectProduct } = useCartSelection();

  useEffect(() => {
    if (querySlug && getProductBySlug(querySlug)) {
      selectProduct(querySlug);
    }
  }, [querySlug, selectProduct]);

  const activeProduct =
    (querySlug ? getProductBySlug(querySlug) : null) ??
    cartProduct ??
    getDefaultProduct();

  const [delivery, setDelivery] = useState<PrivateDeliveryDraft>(
    DEFAULT_DEMO_DELIVERY,
  );
  const [walletStatus, setWalletStatus] =
    useState<CheckoutWalletStatus>("connected");
  const [actionState, setActionState] = useState<CheckoutActionState>({
    phase: "idle",
  });
  const [activePreset, setActivePreset] = useState<InspectorPreset>("ready");

  const opaqueOrderRef = buildOpaqueOrderRefPreview(activeProduct.slug);
  const deliveryValid =
    delivery.recipientName.trim().length > 0 &&
    delivery.cityAndDistrict.trim().length > 0 &&
    delivery.deliveryLine.trim().length > 0;

  const isFormLocked =
    actionState.phase === "awaiting-signature" ||
    actionState.phase === "confirming" ||
    actionState.phase === "confirmed";

  function applyPreset(preset: InspectorPreset) {
    setActivePreset(preset);
    switch (preset) {
      case "ready":
        setWalletStatus("connected");
        setActionState({ phase: "idle" });
        break;
      case "disconnected":
        setWalletStatus("disconnected");
        setActionState({ phase: "idle" });
        break;
      case "wrong-network":
        setWalletStatus("wrong-network");
        setActionState({ phase: "idle" });
        break;
      case "awaiting-signature":
        setWalletStatus("connected");
        setActionState({ phase: "awaiting-signature" });
        break;
      case "confirming":
        setWalletStatus("connected");
        setActionState({
          phase: "confirming",
          txHash: SAMPLE_CONFIRMED_TX,
          explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${SAMPLE_CONFIRMED_TX}`,
        });
        break;
      case "rejected":
        setWalletStatus("connected");
        setActionState({
          phase: "rejected",
          message: "User rejected the createOrder signature request in wallet.",
        });
        break;
      case "reverted":
        setWalletStatus("connected");
        setActionState({
          phase: "reverted",
          reasonCode: "DuplicateOrderReference()",
          message:
            "MonVaultEscrow reverted with DuplicateOrderReference(). This order reference was already used.",
          txHash: SAMPLE_REVERTED_TX,
          explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${SAMPLE_REVERTED_TX}`,
        });
        break;
      case "confirmed":
        setWalletStatus("connected");
        setActionState({
          phase: "confirmed",
          orderId: "1",
          txHash: SAMPLE_CONFIRMED_TX,
          explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${SAMPLE_CONFIRMED_TX}`,
        });
        break;
    }
  }

  async function handleSubmitOrder() {
    if (onCreateOrderAction) {
      await onCreateOrderAction({
        productSlug: activeProduct.slug,
        amountMon: activeProduct.priceMon,
        sellerAddress: activeProduct.sellerAddress,
        opaqueOrderRef,
        privateDelivery: delivery,
      });
      return;
    }

    // Deterministic two-step preview: awaiting-signature -> confirming receipt -> confirmed
    setActivePreset("awaiting-signature");
    setActionState({ phase: "awaiting-signature" });

    await new Promise((resolve) => window.setTimeout(resolve, 900));

    setActivePreset("confirming");
    setActionState({
      phase: "confirming",
      txHash: SAMPLE_CONFIRMED_TX,
      explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${SAMPLE_CONFIRMED_TX}`,
    });

    await new Promise((resolve) => window.setTimeout(resolve, 1100));

    setActivePreset("confirmed");
    setActionState({
      phase: "confirmed",
      orderId: "1",
      txHash: SAMPLE_CONFIRMED_TX,
      explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${SAMPLE_CONFIRMED_TX}`,
    });
  }

  return (
    <div className="space-y-8">
      {/* Interactive UI State Inspector Bar for testing all F3 acceptance states */}
      <Surface tone="muted" radius="card" className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-violet-700">
              CHECKOUT UI STATE INSPECTOR (S3/S4 HANDOFF READY)
            </span>
          </div>
          <span className="font-mono text-[11px] text-ink-600">
            Preview every wallet &amp; contract state before live RPC connection
          </span>
        </div>

        <div
          role="tablist"
          aria-label="Preview checkout wallet and transaction states"
          className="mt-3 flex flex-wrap gap-2"
        >
          {(
            [
              { id: "ready", label: "1. Connected (Ready)" },
              { id: "disconnected", label: "2. Disconnected" },
              { id: "wrong-network", label: "3. Wrong Network" },
              { id: "awaiting-signature", label: "4. Awaiting Signature" },
              { id: "confirming", label: "5. Confirming Receipt" },
              { id: "rejected", label: "6. User Rejected" },
              { id: "reverted", label: "7. Contract Reverted" },
              { id: "confirmed", label: "8. Receipt Confirmed" },
            ] as Array<{ id: InspectorPreset; label: string }>
          ).map((item) => {
            const isSelected = activePreset === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => applyPreset(item.id)}
                className={`min-h-9 rounded-lg border px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors cursor-pointer ${
                  isSelected
                    ? "border-2 border-violet-600 bg-violet-600 text-white"
                    : "border-line bg-surface text-ink-800 hover:bg-canvas"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </Surface>

      {/* Public vs Private Information Explanation */}
      <PrivacySplitBanner />

      {/* Main two-column desktop layout: Order summary + Wallet action visible together */}
      <div className="grid items-start gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        {/* Left column: Private delivery form + Order item summary */}
        <div className="space-y-6">
          <DeliveryDetailsForm
            value={delivery}
            onChange={setDelivery}
            disabled={isFormLocked}
          />

          {/* Compact order item summary card */}
          <Surface tone="raised" radius="card" className="p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
                ORDER ITEM &amp; SELLER SUMMARY
              </span>
              <Link
                href="/cart"
                className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700 hover:underline"
              >
                Change in cart →
              </Link>
            </div>

            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="w-full shrink-0 overflow-hidden rounded-[14px] border border-line bg-muted sm:w-36">
                <Image
                  src={activeProduct.imageSrc}
                  alt={activeProduct.imageAlt}
                  width={280}
                  height={210}
                  className="aspect-[4/3] h-full w-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusChip label={activeProduct.sku} tone="neutral" />
                  <StatusChip label="QUANTITY: 1" tone="violet" />
                </div>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink-950">
                  {activeProduct.name}
                </h3>
                <p className="mt-1 text-sm leading-6 text-ink-600">
                  {activeProduct.tagline}
                </p>
                <div className="mt-3">
                  <MonAmount amount={activeProduct.priceMon} size="lg" />
                </div>
              </div>
            </div>

            <SellerIdentity
              name={activeProduct.sellerName}
              address={activeProduct.sellerAddress}
              className="mt-5"
            />
          </Surface>
        </div>

        {/* Right column: Sticky wallet confirmation panel */}
        <div className="lg:sticky lg:top-24">
          <WalletConfirmationPanel
            product={activeProduct}
            opaqueOrderRef={opaqueOrderRef}
            walletStatus={walletStatus}
            actionState={actionState}
            deliveryValid={deliveryValid}
            onConnectWallet={() => applyPreset("ready")}
            onSwitchNetwork={() => applyPreset("ready")}
            onSubmitOrder={handleSubmitOrder}
            onResetAction={() => applyPreset("ready")}
          />
        </div>
      </div>
    </div>
  );
}
