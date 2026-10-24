"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MonAmount } from "@/components/catalog/mon-amount";
import { SellerIdentity } from "@/components/catalog/seller-identity";
import { SAMPLE_MONAD_EXPLORER_BASE } from "@/components/checkout/checkout-types";
import { Button, ButtonLink } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";
import {
  TransactionProof,
  truncateHex,
} from "@/components/ui/transaction-proof";
import { DEMO_SELLER, getDefaultProduct } from "@/data/catalog";
import { fetchOnChainOrder, getExplorerTxUrl, type OnChainOrder } from "@/lib/chain/client";
import { useDemoShipments } from "@/lib/orders/demo-tracking-store";
import {
  type ConnectedWalletRole,
  getOrderStatusCopy,
  type NormalizedOrderView,
  type OrderActionState,
  type OrderCallerPermissions,
  type OrderStatus,
} from "@/lib/orders/presentation";
import { BuyerDecisionPanels } from "./buyer-decision-panels";
import { EscrowTimeline } from "./escrow-timeline";
import { ReviewCountdownCard } from "./review-countdown-card";

const BUYER_WALLET =
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" as `0x${string}`;
const STRANGER_WALLET =
  "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" as `0x${string}`;

const TX_PAID =
  "0x8a91e04b7d23c91f52b0931a4c601872f490b1d452c7a8d96e3f1b20495a1001" as const;
const TX_SHIPPED =
  "0x4f72c18e9a05d31b64e8207c3b519684e210a9c341b6d7e85f2a0c19384b2002" as const;
const TX_SETTLED =
  "0x9d31b64e8207c3b519684e210a9c341b6d7e85f2a0c19384b20028a91e04b3003" as const;
const TX_DISPUTED =
  "0x2c7a8d96e3f1b20495a10018a91e04b7d23c91f52b0931a4c601872f490b4004" as const;

type TrackingInspectorPreset =
  | "shipped-active"
  | "paid"
  | "shipped-expired"
  | "completed-buyer"
  | "completed-timeout"
  | "disputed"
  | "pending-tx"
  | "wrong-wallet"
  | "missing-order";

export interface OrderTrackingExperienceProps {
  orderId: string;
}

export function OrderTrackingExperience({
  orderId,
}: OrderTrackingExperienceProps) {
  const defaultProduct = getDefaultProduct();

  const initialMissing = orderId === "999" || orderId === "missing";

  const [isMissingOrder, setIsMissingOrder] = useState(initialMissing);
  const [onChainOrder, setOnChainOrder] = useState<OnChainOrder | null>(null);
  const [status, setStatus] = useState<OrderStatus>(
    orderId === "1" ? "paid" : orderId === "2" ? "paid" : orderId === "3" ? "disputed" : "shipped",
  );
  const [settlementMethod, setSettlementMethod] = useState<
    "buyer-confirmed" | "seller-timeout-claim" | undefined
  >(undefined);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(
    orderId === "1" || orderId === "2" ? null : 272,
  );
  const [walletRole, setWalletRole] = useState<ConnectedWalletRole>("buyer");
  const [actionState, setActionState] = useState<OrderActionState>({
    phase: "idle",
  });
  const [activePreset, setActivePreset] = useState<TrackingInspectorPreset>(
    initialMissing
      ? "missing-order"
      : orderId === "1" || orderId === "2"
        ? "paid"
        : orderId === "3"
          ? "disputed"
          : "shipped-active",
  );

  // Automatically fetch real on-chain order from Monad testnet
  useEffect(() => {
    let active = true;
    async function loadChainOrder() {
      try {
        const live = await fetchOnChainOrder(orderId);
        if (!active || !live) return;

        setOnChainOrder(live);
        setIsMissingOrder(false);
        const mappedStatus = live.status === "none" ? "paid" : (live.status as OrderStatus);
        setStatus(mappedStatus);
        setActivePreset(mappedStatus as TrackingInspectorPreset);

        if (mappedStatus === "shipped") {
          const nowSec = Math.floor(Date.now() / 1000);
          setRemainingSeconds(Math.max(0, live.reviewEndsAt - nowSec));
        } else {
          setRemainingSeconds(null);
        }
      } catch (err) {
        console.warn("Could not query on-chain contract state:", err);
      }
    }
    loadChainOrder();
    return () => {
      active = false;
    };
  }, [orderId]);

  // Display-only 1s countdown ticker while order is in SHIPPED state
  useEffect(() => {
    if (status !== "shipped" || remainingSeconds === null) return;
    if (remainingSeconds <= 0) return;

    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === null || prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [status, remainingSeconds]);

  function applyPreset(preset: TrackingInspectorPreset) {
    setActivePreset(preset);
    setActionState({ phase: "idle" });

    switch (preset) {
      case "paid":
        setIsMissingOrder(false);
        setWalletRole("buyer");
        setStatus("paid");
        setSettlementMethod(undefined);
        setRemainingSeconds(null);
        break;
      case "shipped-active":
        setIsMissingOrder(false);
        setWalletRole("buyer");
        setStatus("shipped");
        setSettlementMethod(undefined);
        setRemainingSeconds(272);
        break;
      case "shipped-expired":
        setIsMissingOrder(false);
        setWalletRole("buyer");
        setStatus("shipped");
        setSettlementMethod(undefined);
        setRemainingSeconds(0);
        break;
      case "completed-buyer":
        setIsMissingOrder(false);
        setWalletRole("buyer");
        setStatus("completed");
        setSettlementMethod("buyer-confirmed");
        setRemainingSeconds(0);
        break;
      case "completed-timeout":
        setIsMissingOrder(false);
        setWalletRole("buyer");
        setStatus("completed");
        setSettlementMethod("seller-timeout-claim");
        setRemainingSeconds(0);
        break;
      case "disputed":
        setIsMissingOrder(false);
        setWalletRole("buyer");
        setStatus("disputed");
        setSettlementMethod(undefined);
        setRemainingSeconds(180);
        break;
      case "pending-tx":
        setIsMissingOrder(false);
        setWalletRole("buyer");
        setStatus("shipped");
        setSettlementMethod(undefined);
        setRemainingSeconds(240);
        setActionState({
          phase: "confirming",
          actionName: `confirmDelivery(${orderId})`,
          txHash: TX_SETTLED,
          explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_SETTLED}`,
        });
        break;
      case "wrong-wallet":
        setIsMissingOrder(false);
        setWalletRole("stranger");
        setStatus("shipped");
        setSettlementMethod(undefined);
        setRemainingSeconds(260);
        break;
      case "missing-order":
        setIsMissingOrder(true);
        break;
    }
  }

  // Normalized permissions from contract state/action layer
  const isReviewWindowOpen =
    remainingSeconds === null || remainingSeconds > 0;
  const permissions: OrderCallerPermissions = {
    connectedRole: walletRole,
    connectedAddress:
      walletRole === "buyer"
        ? BUYER_WALLET
        : walletRole === "seller"
          ? DEMO_SELLER.address
          : walletRole === "stranger"
            ? STRANGER_WALLET
            : undefined,
    canConfirmDelivery: walletRole === "buyer" && status === "shipped",
    canOpenDispute:
      walletRole === "buyer" &&
      (status === "paid" || (status === "shipped" && isReviewWindowOpen)),
    canMarkShipped: walletRole === "seller" && status === "paid",
    canClaimAfterTimeout:
      walletRole === "seller" &&
      status === "shipped" &&
      remainingSeconds !== null &&
      remainingSeconds <= 0,
  };

  async function handleConfirmDelivery() {
    setActionState({
      phase: "awaiting-signature",
      actionName: `confirmDelivery(${orderId})`,
    });
    await new Promise((resolve) => window.setTimeout(resolve, 800));

    setActionState({
      phase: "confirming",
      actionName: `confirmDelivery(${orderId})`,
      txHash: TX_SETTLED,
      explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_SETTLED}`,
    });
    await new Promise((resolve) => window.setTimeout(resolve, 1000));

    // Only update status AFTER receipt confirms (never optimistic)
    setStatus("completed");
    setSettlementMethod("buyer-confirmed");
    setRemainingSeconds(0);
    setActivePreset("completed-buyer");
    setActionState({
      phase: "confirmed",
      actionName: `confirmDelivery(${orderId})`,
      txHash: TX_SETTLED,
      explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_SETTLED}`,
    });
  }

  async function handleOpenDispute() {
    setActionState({
      phase: "awaiting-signature",
      actionName: `openDispute(${orderId})`,
    });
    await new Promise((resolve) => window.setTimeout(resolve, 800));

    setActionState({
      phase: "confirming",
      actionName: `openDispute(${orderId})`,
      txHash: TX_DISPUTED,
      explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_DISPUTED}`,
    });
    await new Promise((resolve) => window.setTimeout(resolve, 1000));

    // Only update status AFTER receipt confirms
    setStatus("disputed");
    setSettlementMethod(undefined);
    setActivePreset("disputed");
    setActionState({
      phase: "confirmed",
      actionName: `openDispute(${orderId})`,
      txHash: TX_DISPUTED,
      explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_DISPUTED}`,
    });
  }

  const { getShipment } = useDemoShipments();
  const storedShipment = getShipment(orderId);

  const verifiedDepositTx =
    orderId === "1"
      ? ("0xf17cf16b9272ba1f2adf219a61bc002d4a9b9c25663144afbae191a7f8dcc3b0" as const)
      : TX_PAID;

  const orderModel: NormalizedOrderView = {
    orderId,
    orderRef:
      onChainOrder?.orderRef ??
      (orderId === "1"
        ? "0xd0af8cf291f6ddb7eaa6f912221fc878baac3bbca3f8355f2976924f291c2892"
        : "0x5f9c281073747564696f6865616470686f6e6573000000000000000000000000"),
    productSlug: defaultProduct.slug,
    productName: defaultProduct.name,
    productSku: defaultProduct.sku,
    productImageSrc: defaultProduct.imageSrc,
    productImageAlt: defaultProduct.imageAlt,
    amountMon: onChainOrder?.amountMon ?? defaultProduct.priceMon,
    buyerAddress: (onChainOrder?.buyer as `0x${string}`) ?? BUYER_WALLET,
    sellerName: DEMO_SELLER.name,
    sellerAddress: (onChainOrder?.seller as `0x${string}`) ?? DEMO_SELLER.address,
    status,
    reviewEndsAtSeconds: remainingSeconds,
    demoTrackingRef:
      status === "paid"
        ? null
        : storedShipment
          ? `${storedShipment.trackingRef} (Off-Chain Demo Ref)`
          : "MV-DEMO-TRK-9041 (Off-Chain Demo Ref)",
    privateDeliverySummary:
      "Monad Blitz Demo Desk · Floor 2, Çankaya, Ankara (Off-chain record)",
    settlementMethod,
    transactions: [
      {
        label: "01 · ESCROW DEPOSIT (CREATEORDER)",
        txHash: verifiedDepositTx,
        explorerUrl: getExplorerTxUrl(verifiedDepositTx),
        state: "confirmed",
      },
      ...(status !== "paid"
        ? [
            {
              label: "02 · SELLER SHIPMENT (MARKSHIPPED)",
              txHash: TX_SHIPPED,
              explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_SHIPPED}`,
              state: "confirmed" as const,
            },
          ]
        : []),
      ...(status === "completed"
        ? [
            {
              label:
                settlementMethod === "seller-timeout-claim"
                  ? "03 · TIMEOUT CLAIM (CLAIMAFTERTIMEOUT)"
                  : "03 · BUYER RELEASE (CONFIRMDELIVERY)",
              txHash: TX_SETTLED,
              explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_SETTLED}`,
              state: "confirmed" as const,
            },
          ]
        : []),
      ...(status === "disputed"
        ? [
            {
              label: "03 · BUYER DISPUTE LOCK (OPENDISPUTE)",
              txHash: TX_DISPUTED,
              explorerUrl: `${SAMPLE_MONAD_EXPLORER_BASE}/${TX_DISPUTED}`,
              state: "confirmed" as const,
            },
          ]
        : []),
    ],
  };

  const statusCopy = getOrderStatusCopy(
    status,
    remainingSeconds,
    settlementMethod,
  );

  return (
    <div className="space-y-8">
      {/* Interactive State Inspector Bar for testing all F4 states */}
      <Surface tone="muted" radius="card" className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-violet-700">
            ORDER TRACKING STATE INSPECTOR (S4 HANDOFF READY)
          </span>
          <span className="font-mono text-[11px] text-ink-600">
            Inspect every contract status, timer boundary, and wallet role
          </span>
        </div>

        <div
          role="tablist"
          aria-label="Preview order tracking states"
          className="mt-3 flex flex-wrap gap-2"
        >
          {(
            [
              { id: "shipped-active", label: "1. SHIPPED (04:32 Window)" },
              { id: "paid", label: "2. PAID (Awaiting Ship)" },
              { id: "shipped-expired", label: "3. SHIPPED (00:00 Timeout)" },
              { id: "completed-buyer", label: "4. COMPLETED (Confirmed)" },
              { id: "completed-timeout", label: "5. COMPLETED (Timeout Claim)" },
              { id: "disputed", label: "6. DISPUTED (Frozen)" },
              { id: "pending-tx", label: "7. Pending Receipt" },
              { id: "wrong-wallet", label: "8. Wrong Wallet" },
              { id: "missing-order", label: "9. Missing Order" },
            ] as Array<{ id: TrackingInspectorPreset; label: string }>
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

      {/* Missing / OrderNotFound() state */}
      {isMissingOrder ? (
        <Surface
          tone="raised"
          radius="card"
          className="mx-auto max-w-2xl p-8 text-center md:p-12"
        >
          <div className="flex justify-center">
            <StatusChip label="ORDER NOT FOUND ON-CHAIN" tone="danger" />
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-ink-950">
            Order #{orderId} does not exist in{" "}
            <code className="font-mono text-2xl">MonVaultEscrow</code>.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base leading-7 text-ink-600">
            Calling <code className="font-mono text-xs">getOrder({orderId})</code>{" "}
            reverted with <code className="font-mono text-xs">OrderNotFound()</code>{" "}
            because its status is <code className="font-mono text-xs">Status.NONE</code>.
            Verify the order ID or fund a new escrow order at checkout.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              variant="primary"
              size="lg"
              onClick={() => applyPreset("shipped-active")}
            >
              Inspect active Order #1
            </Button>
            <ButtonLink href="/shop" variant="secondary" size="lg">
              Return to testnet shop
            </ButtonLink>
          </div>
        </Surface>
      ) : (
        <>
          {/* Status-first hero banner per DESIGN.md section 9 */}
          <Surface tone="raised" radius="card" className="p-6 md:p-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <StatusChip
                    label={statusCopy.chipLabel}
                    tone={statusCopy.chipTone}
                  />
                  <span className="rounded-full border border-line bg-canvas px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-800 tabular-nums">
                    ORDER #{orderModel.orderId}
                  </span>
                  <span className="font-mono text-xs text-ink-600">
                    REF: {truncateHex(orderModel.orderRef, 10, 6)}
                  </span>
                </div>

                <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink-950 md:text-5xl">
                  {statusCopy.primaryCopy}
                </h1>
                <p className="mt-2.5 max-w-2xl text-base leading-7 text-ink-600 md:text-lg">
                  {statusCopy.supportingCopy}
                </p>
              </div>

              <div className="shrink-0 rounded-[18px] border border-line bg-canvas p-5 lg:min-w-[260px]">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                  ESCROWED AMOUNT
                </span>
                <div className="mt-1.5">
                  <MonAmount amount={orderModel.amountMon} size="xl" />
                </div>
                <p className="mt-2 font-mono text-[11px] text-ink-600">
                  {status === "completed"
                    ? "Released from contract to seller"
                    : status === "disputed"
                      ? "Frozen inside MonVaultEscrow"
                      : "Held by MonVaultEscrow contract"}
                </p>
              </div>
            </div>
          </Surface>

          {/* 5-step Escrow Timeline */}
          <EscrowTimeline
            status={status}
            remainingSeconds={remainingSeconds}
            nextPermittedActor={statusCopy.nextPermittedActor}
            nextPermittedActionSummary={statusCopy.nextPermittedActionSummary}
          />

          {/* Main two-column operational layout */}
          <div className="grid items-start gap-8 lg:grid-cols-[1.12fr_0.88fr]">
            {/* Left column: Countdown + Buyer Decision Panels */}
            <div className="space-y-6">
              <ReviewCountdownCard
                status={status}
                remainingSeconds={remainingSeconds}
                onAdjustPreviewSeconds={(secs) => setRemainingSeconds(secs)}
              />

              <BuyerDecisionPanels
                orderId={orderModel.orderId}
                amountMon={orderModel.amountMon}
                buyerAddress={orderModel.buyerAddress}
                sellerName={orderModel.sellerName}
                sellerAddress={orderModel.sellerAddress}
                status={status}
                remainingSeconds={remainingSeconds}
                permissions={permissions}
                actionState={actionState}
                onConfirmDelivery={handleConfirmDelivery}
                onOpenDispute={handleOpenDispute}
                onResetActionState={() => setActionState({ phase: "idle" })}
              />
            </div>

            {/* Right column: Transaction Proof Ledger + Off-Chain Shipment Metadata */}
            <div className="space-y-6">
              {/* On-chain transaction evidence */}
              <Surface tone="raised" radius="card" className="p-6 md:p-7">
                <div className="flex items-center justify-between gap-2 border-b border-line pb-4">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
                    ON-CHAIN TRANSACTION PROOF
                  </span>
                  <StatusChip label="MONAD EXPLORER" tone="info" />
                </div>

                <div className="mt-5 space-y-3.5">
                  {orderModel.transactions.map((tx) => (
                    <TransactionProof
                      key={tx.label}
                      label={tx.label}
                      hash={tx.txHash}
                      explorerUrl={tx.explorerUrl}
                      state={tx.state}
                    />
                  ))}
                </div>
              </Surface>

              {/* Order item + clearly labelled off-chain shipment & delivery details */}
              <Surface tone="raised" radius="card" className="p-6 md:p-7">
                <div className="flex items-center justify-between gap-2 border-b border-line pb-4">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
                    ORDER ITEM &amp; OFF-CHAIN SHIPMENT
                  </span>
                  <StatusChip label="OFF-CHAIN METADATA" tone="neutral" />
                </div>

                <div className="mt-5 flex items-center gap-4">
                  <div className="w-24 shrink-0 overflow-hidden rounded-[12px] border border-line bg-muted">
                    <Image
                      src={orderModel.productImageSrc}
                      alt={orderModel.productImageAlt}
                      width={160}
                      height={120}
                      className="aspect-[4/3] h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-violet-700">
                      {orderModel.productSku}
                    </span>
                    <h3 className="text-lg font-semibold text-ink-950">
                      <Link
                        href={`/products/${orderModel.productSlug}`}
                        className="hover:text-violet-700"
                      >
                        {orderModel.productName}
                      </Link>
                    </h3>
                    <MonAmount
                      amount={orderModel.amountMon}
                      size="sm"
                      showTestnetTag={false}
                    />
                  </div>
                </div>

                <dl className="mt-5 space-y-3 border-t border-line pt-4 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
                      DEMO TRACKING REFERENCE
                    </dt>
                    <dd className="font-mono font-semibold text-ink-950">
                      {orderModel.demoTrackingRef ??
                        "Awaiting seller shipment"}
                    </dd>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
                      BUYER WALLET (ON-CHAIN)
                    </dt>
                    <dd className="font-mono text-ink-800">
                      {truncateHex(orderModel.buyerAddress, 8, 6)}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
                      PRIVATE DELIVERY RECORD (NEVER ON-CHAIN)
                    </dt>
                    <dd className="mt-1 rounded-lg border border-line bg-canvas px-3 py-2 text-ink-800">
                      {orderModel.privateDeliverySummary}
                    </dd>
                  </div>
                </dl>

                <SellerIdentity
                  name={orderModel.sellerName}
                  address={orderModel.sellerAddress}
                  className="mt-5"
                />

                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
                  <span className="text-xs text-ink-600">
                    Testing the seller side of this order?
                  </span>
                  <Link
                    href="/seller/orders"
                    className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700 hover:underline"
                  >
                    Open Seller Operations →
                  </Link>
                </div>
              </Surface>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
