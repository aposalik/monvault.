"use client";

import Image from "next/image";
import Link from "next/link";
import { EmptyCart } from "@/components/catalog/empty-cart";
import { MonAmount } from "@/components/catalog/mon-amount";
import { OneSellerBoundary } from "@/components/catalog/one-seller-boundary";
import { SellerIdentity } from "@/components/catalog/seller-identity";
import { Button, ButtonLink } from "@/components/ui/button";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { StatusChip } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";
import { useCartSelection } from "@/data/cart-store";
import { demoProducts } from "@/data/catalog";

const LIFECYCLE_PREVIEW = [
  {
    step: "01",
    label: "Buyer funds escrow",
    detail: "Exact test MON locked in MonVaultEscrow",
  },
  {
    step: "02",
    label: "Seller marks shipped",
    detail: "Starts 5-minute buyer review window",
  },
  {
    step: "03",
    label: "Confirm, timeout, or dispute",
    detail: "Contract enforces payout or freeze",
  },
];

export default function CartPage() {
  const { product, selectProduct, clearCart } = useCartSelection();

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-950">
      <SiteHeader />

      <main
        id="main-content"
        className="flex-1 px-5 py-12 md:px-10 md:py-16 lg:px-[72px] lg:py-20"
      >
        <div className="mx-auto w-full max-w-[1296px]">
          <div className="mb-8 flex flex-col justify-between gap-4 border-b border-line pb-8 sm:flex-row sm:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusChip label="ONE-ORDER ESCROW CART" tone="violet" />
                <StatusChip label="MONAD TESTNET" tone="neutral" />
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-ink-950 md:text-5xl">
                Review your escrow order.
              </h1>
            </div>
            <Link
              href="/shop"
              className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700 hover:underline"
            >
              ← Browse all demo items
            </Link>
          </div>

          {!product ? (
            <EmptyCart onRestoreDefault={(slug) => selectProduct(slug)} />
          ) : (
            <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
              {/* Left column: Active escrow item + one-seller boundary + quick item switcher */}
              <div className="space-y-6">
                <Surface tone="raised" radius="card" className="p-6 md:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
                      ACTIVE ESCROW ITEM (QUANTITY: 1)
                    </span>
                    <button
                      type="button"
                      onClick={clearCart}
                      className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-danger-700 hover:underline cursor-pointer"
                    >
                      Remove item
                    </button>
                  </div>

                  <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
                    <Link
                      href={`/products/${product.slug}`}
                      className="block w-full shrink-0 overflow-hidden rounded-[16px] border border-line bg-muted sm:w-48"
                    >
                      <Image
                        src={product.imageSrc}
                        alt={product.imageAlt}
                        width={320}
                        height={240}
                        className="aspect-[4/3] h-full w-full object-cover"
                      />
                    </Link>

                    <div className="flex-1">
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-violet-700">
                        {product.sku} · {product.category}
                      </span>
                      <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-ink-950">
                        <Link
                          href={`/products/${product.slug}`}
                          className="hover:text-violet-700"
                        >
                          {product.name}
                        </Link>
                      </h2>
                      <p className="mt-1.5 text-sm leading-6 text-ink-600">
                        {product.tagline}
                      </p>
                      <div className="mt-4">
                        <MonAmount amount={product.priceMon} size="lg" />
                      </div>
                    </div>
                  </div>

                  <SellerIdentity
                    name={product.sellerName}
                    address={product.sellerAddress}
                    className="mt-6"
                  />
                </Surface>

                <OneSellerBoundary />

                {/* Switch active demo item without leaving cart */}
                <Surface tone="canvas" radius="card" className="p-6">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
                    SWITCH DEMO ORDER ITEM
                  </span>
                  <p className="mt-1 text-xs text-ink-600">
                    Because each escrow transaction locks funds for one item,
                    you can switch which seeded product is active below:
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {demoProducts.map((item) => {
                      const isCurrent = item.slug === product.slug;
                      return (
                        <Button
                          key={item.id}
                          variant={isCurrent ? "primary" : "secondary"}
                          size="md"
                          onClick={() => selectProduct(item.slug)}
                          className="justify-between text-left"
                        >
                          <span className="truncate text-xs">
                            {item.name} ({item.priceMon} MON)
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </Surface>
              </div>

              {/* Right column: Test MON subtotal + compact escrow lifecycle preview + checkout CTA */}
              <div className="space-y-6">
                <Surface tone="raised" radius="card" className="p-6 md:p-8">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
                    ESCROW ORDER SUMMARY
                  </span>

                  <dl className="mt-5 space-y-3.5 border-b border-line pb-5 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-ink-600">Item price</dt>
                      <dd className="font-mono font-semibold text-ink-950 tabular-nums">
                        {product.priceMon} test MON
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-ink-600">Platform escrow fee</dt>
                      <dd className="font-mono font-medium text-success-700 tabular-nums">
                        0.00 test MON
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-ink-600">Shipment tracking</dt>
                      <dd className="font-mono text-xs text-ink-800">
                        OFF-CHAIN DEMO REF
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-950">
                      TOTAL TO ESCROW
                    </span>
                    <MonAmount
                      amount={product.priceMon}
                      size="xl"
                      showTestnetTag={false}
                    />
                  </div>
                  <p className="mt-1 text-xs text-ink-600">
                    Plus standard Monad testnet gas when signing{" "}
                    <code className="font-mono text-[11px]">createOrder</code>.
                    No fake carrier arrival estimates are shown.
                  </p>

                  {/* Compact escrow lifecycle preview */}
                  <div className="mt-6 rounded-[14px] border border-line bg-muted p-4">
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-800">
                      ESCROW LIFECYCLE PREVIEW
                    </p>
                    <ol className="mt-3 space-y-2.5">
                      {LIFECYCLE_PREVIEW.map((item) => (
                        <li
                          key={item.step}
                          className="flex items-start gap-3 text-xs"
                        >
                          <span className="rounded bg-surface px-1.5 py-0.5 font-mono font-semibold text-violet-700 tabular-nums">
                            {item.step}
                          </span>
                          <div>
                            <p className="font-semibold text-ink-950">
                              {item.label}
                            </p>
                            <p className="text-ink-600">{item.detail}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="mt-6 space-y-3">
                    <ButtonLink
                      href={`/checkout?product=${encodeURIComponent(product.slug)}`}
                      variant="primary"
                      size="lg"
                      className="w-full"
                    >
                      Proceed to escrow checkout
                    </ButtonLink>
                    <ButtonLink
                      href="/shop"
                      variant="secondary"
                      size="md"
                      className="w-full"
                    >
                      Continue browsing shop
                    </ButtonLink>
                  </div>
                </Surface>
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
