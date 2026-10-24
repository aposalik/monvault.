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
  DEFAULT_DELIVERY_DRAFT,
  type PrivateDeliveryDraft,
  SAMPLE_MONAD_EXPLORER_BASE,
} from "./checkout-types";
import { DeliveryDetailsForm } from "./delivery-details-form";
import { PrivacySplitBanner } from "./privacy-split-banner";
import { WalletConfirmationPanel } from "./wallet-confirmation-panel";

const DEFAULT_BUYER_WALLET =
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" as `0x${string}`;

const SAMPLE_CONFIRMED_TX =
  "0x8a91e04b7d23c91f52b0931a4c601872f490b1d452c7a8d96e3f1b20495a1006" as const;

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}

export interface CheckoutExperienceProps {
  onCreateOrderAction?: (input: CreateOrderPresentationInput) => Promise<void>;
}

export function CheckoutExperience({
  onCreateOrderAction,
}: CheckoutExperienceProps) {
  const searchParams = useSearchParams();
  const querySlug = searchParams.get("product");
  const {
    items: cartItems,
    product: cartProduct,
    totalItems,
    subtotalFormatted,
    selectProduct,
    clearCart,
  } = useCartSelection();

  useEffect(() => {
    if (querySlug && getProductBySlug(querySlug)) {
      selectProduct(querySlug);
    }
  }, [querySlug, selectProduct]);

  const activeProduct =
    (querySlug ? getProductBySlug(querySlug) : null) ??
    cartProduct ??
    getDefaultProduct();

  const checkoutLineItems =
    cartItems.length > 0
      ? cartItems
      : [{ product: activeProduct, quantity: 1 }];

  const totalAmountMon =
    cartItems.length > 0 ? subtotalFormatted : activeProduct.priceMon;
  const itemCount = cartItems.length > 0 ? totalItems : 1;

  const [delivery, setDelivery] = useState<PrivateDeliveryDraft>(
    DEFAULT_DELIVERY_DRAFT,
  );
  const [buyerAddress, setBuyerAddress] =
    useState<`0x${string}`>(DEFAULT_BUYER_WALLET);
  const [walletStatus, setWalletStatus] =
    useState<CheckoutWalletStatus>("connected");
  const [actionState, setActionState] = useState<CheckoutActionState>({
    phase: "idle",
  });

  // Detect connected EIP-1193 wallet account when available
  useEffect(() => {
    if (typeof window === "undefined") return;
    const eth = (window as unknown as { ethereum?: EthereumProvider }).ethereum;
    if (!eth) return;

    eth
      .request({ method: "eth_accounts" })
      .then((accounts) => {
        if (Array.isArray(accounts) && typeof accounts[0] === "string") {
          setBuyerAddress(accounts[0] as `0x${string}`);
          setWalletStatus("connected");
        }
      })
      .catch(() => {
        // Keep ready state
      });
  }, []);

  async function handleConnectWallet() {
    if (typeof window !== "undefined") {
      const eth = (window as unknown as { ethereum?: EthereumProvider })
        .ethereum;
      if (eth) {
        try {
          const accounts = await eth.request({
            method: "eth_requestAccounts",
          });
          if (Array.isArray(accounts) && typeof accounts[0] === "string") {
            setBuyerAddress(accounts[0] as `0x${string}`);
          }
        } catch {
          // Fallback to default testnet buyer address
        }
      }
    }
    setWalletStatus("connected");
  }

  const opaqueOrderRef = buildOpaqueOrderRefPreview(activeProduct.slug);
  const deliveryValid =
    delivery.recipientName.trim().length > 0 &&
    delivery.cityAndDistrict.trim().length > 0 &&
    delivery.deliveryLine.trim().length > 0;

  const isFormLocked =
    actionState.phase === "awaiting-signature" ||
    actionState.phase === "confirming" ||
    actionState.phase === "confirmed";

  async function handleSubmitOrder() {
    if (onCreateOrderAction) {
      await onCreateOrderAction({
        productSlug: activeProduct.slug,
        amountMon: totalAmountMon,
        sellerAddress: activeProduct.sellerAddress,
        opaqueOrderRef,
        privateDelivery: delivery,
      });
      return;
    }

    setActionState({ phase: "awaiting-signature" });
    await new Promise((resolve) => window.setTimeout(resolve, 750));

    const explorerUrl = `${SAMPLE_MONAD_EXPLORER_BASE}/${SAMPLE_CONFIRMED_TX}`;
    setActionState({
      phase: "confirming",
      txHash: SAMPLE_CONFIRMED_TX,
      explorerUrl,
    });
    await new Promise((resolve) => window.setTimeout(resolve, 900));

    // Persist the newly created order into the shared PostgreSQL repository
    let createdOrderId = "106";
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderRef: opaqueOrderRef,
          productSlug: activeProduct.slug,
          productName:
            checkoutLineItems.length > 1
              ? `${activeProduct.name} (+${checkoutLineItems.length - 1} more)`
              : activeProduct.name,
          productSku: activeProduct.sku,
          productImageSrc: activeProduct.imageSrc,
          amountMon: totalAmountMon,
          buyerAddress,
          sellerName: activeProduct.sellerName,
          sellerAddress: activeProduct.sellerAddress,
          deliverySummary: `${delivery.deliveryLine} · ${delivery.cityAndDistrict}`,
          txHash: SAMPLE_CONFIRMED_TX,
          explorerUrl,
        }),
      });
      if (response.ok) {
        const data = (await response.json()) as {
          order?: { orderId?: string };
        };
        if (data.order?.orderId) {
          createdOrderId = data.order.orderId;
        }
      }
    } catch {
      // Fallback order ID if offline
    }

    clearCart();

    setActionState({
      phase: "confirmed",
      orderId: createdOrderId,
      txHash: SAMPLE_CONFIRMED_TX,
      explorerUrl,
    });
  }

  return (
    <div className="space-y-8">
      {/* Privacy & Escrow Architecture Summary */}
      <PrivacySplitBanner />

      {/* Main two-column desktop layout: Shipping & Order summary + Wallet confirmation */}
      <div className="grid items-start gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        {/* Left column: Private delivery form + Order items summary */}
        <div className="space-y-6">
          <DeliveryDetailsForm
            value={delivery}
            onChange={setDelivery}
            disabled={isFormLocked}
          />

          {/* Order Items Summary Card */}
          <Surface tone="raised" radius="card" className="p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
                ORDER ITEMS ({itemCount})
              </span>
              <Link
                href="/cart"
                className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700 hover:underline"
              >
                Edit Cart →
              </Link>
            </div>

            <div className="mt-5 divide-y divide-line">
              {checkoutLineItems.map(({ product, quantity }) => (
                <div
                  key={product.slug}
                  className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                >
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-[12px] border border-line bg-canvas p-2">
                    <Image
                      src={product.imageSrc}
                      alt={product.imageAlt}
                      fill
                      sizes="96px"
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusChip label={product.sku} tone="neutral" />
                      <StatusChip label={`QTY: ${quantity}`} tone="violet" />
                    </div>
                    <h3 className="mt-1.5 text-lg font-semibold tracking-[-0.025em] text-ink-950">
                      {product.name}
                    </h3>
                  </div>

                  <div className="sm:text-right">
                    <MonAmount
                      amount={(product.priceNumeric * quantity).toFixed(2)}
                      size="md"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
                TOTAL ESCROW DEPOSIT
              </span>
              <MonAmount amount={totalAmountMon} size="lg" />
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
            totalAmountMon={totalAmountMon}
            itemCount={itemCount}
            opaqueOrderRef={opaqueOrderRef}
            buyerAddress={buyerAddress}
            walletStatus={walletStatus}
            actionState={actionState}
            deliveryValid={deliveryValid}
            onConnectWallet={handleConnectWallet}
            onSwitchNetwork={() => setWalletStatus("connected")}
            onSubmitOrder={handleSubmitOrder}
          />
        </div>
      </div>
    </div>
  );
}
