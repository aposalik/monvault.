"use client";

import Image from "next/image";
import Link from "next/link";
import { EmptyCart } from "@/components/catalog/empty-cart";
import { MonAmount } from "@/components/catalog/mon-amount";
import { SellerIdentity } from "@/components/catalog/seller-identity";
import { ButtonLink } from "@/components/ui/button";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { StatusChip } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";
import { useCartSelection } from "@/data/cart-store";

export default function CartPage() {
  const {
    items,
    totalItems,
    subtotalFormatted,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
  } = useCartSelection();

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-950">
      <SiteHeader />

      <main
        id="main-content"
        className="flex-1 px-5 py-10 md:px-10 md:py-14 lg:px-[72px] lg:py-16"
      >
        <div className="mx-auto w-full max-w-[1296px]">
          {/* Cart Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 border-b border-line pb-8 sm:flex-row sm:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusChip label="SHOPPING CART" tone="violet" />
                {totalItems > 0 ? (
                  <StatusChip
                    label={`${totalItems} ${totalItems === 1 ? "ITEM" : "ITEMS"}`}
                    tone="neutral"
                  />
                ) : null}
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink-950 md:text-5xl">
                Your Shopping Cart
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {items.length > 0 ? (
                <button
                  type="button"
                  onClick={clearCart}
                  className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-danger-700 hover:underline cursor-pointer"
                >
                  Clear cart
                </button>
              ) : null}
              <Link
                href="/shop"
                className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700 hover:underline"
              >
                ← Continue shopping
              </Link>
            </div>
          </div>

          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
              {/* Left Column: Cart Line Items */}
              <div className="space-y-4">
                {items.map(({ product, quantity, lineTotalFormatted }) => (
                  <Surface
                    key={product.slug}
                    tone="raised"
                    radius="card"
                    className="border border-line p-5 md:p-6"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                      {/* Product Thumbnail */}
                      <Link
                        href={`/products/${product.slug}`}
                        className="block w-full shrink-0 overflow-hidden rounded-2xl border border-line bg-muted/50 p-3 sm:w-36"
                      >
                        <Image
                          src={product.imageSrc}
                          alt={product.imageAlt}
                          width={240}
                          height={180}
                          className="aspect-[4/3] h-full w-full object-contain"
                        />
                      </Link>

                      {/* Product Info & Controls */}
                      <div className="flex flex-1 flex-col justify-between gap-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-violet-700">
                              {product.category} · {product.sku}
                            </span>
                            <h2 className="mt-1 text-xl font-semibold tracking-[-0.025em] text-ink-950">
                              <Link
                                href={`/products/${product.slug}`}
                                className="hover:text-violet-700"
                              >
                                {product.title}
                              </Link>
                            </h2>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(product.slug)}
                            aria-label={`Remove ${product.title} from cart`}
                            className="rounded-lg border border-line bg-canvas px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-danger-700 transition-colors hover:bg-danger-100 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>

                        {/* Seller Identity */}
                        <SellerIdentity
                          name={product.sellerName}
                          address={product.sellerAddress}
                          compact
                        />

                        {/* Quantity Controls + Unit Price & Line Subtotal */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-600">
                              QTY
                            </span>
                            <div className="inline-flex items-center rounded-xl border border-line bg-canvas">
                              <button
                                type="button"
                                onClick={() => decrementItem(product.slug)}
                                aria-label={`Decrease quantity of ${product.title}`}
                                className="inline-flex size-9 items-center justify-center rounded-l-xl font-mono text-base font-semibold text-ink-950 transition-colors hover:bg-muted cursor-pointer"
                              >
                                −
                              </button>
                              <span className="min-w-10 px-2 text-center font-mono text-sm font-semibold text-ink-950 tabular-nums">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => incrementItem(product.slug)}
                                disabled={quantity >= product.stock}
                                aria-label={`Increase quantity of ${product.title}`}
                                className="inline-flex size-9 items-center justify-center rounded-r-xl font-mono text-base font-semibold text-ink-950 transition-colors hover:bg-muted disabled:opacity-40 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-mono text-[11px] text-ink-600 tabular-nums">
                              ({product.priceMon} MON each)
                            </span>
                          </div>

                          {/* Line Total in MON */}
                          <div className="text-right">
                            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-600">
                              LINE TOTAL
                            </p>
                            <MonAmount amount={lineTotalFormatted} size="lg" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Surface>
                ))}
              </div>

              {/* Right Column: Order Summary + Escrow Protection Notice + Proceed to Checkout */}
              <div className="space-y-6 lg:sticky lg:top-24">
                <Surface
                  tone="raised"
                  radius="card"
                  className="border border-line p-6 md:p-8"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-line pb-4">
                    <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
                      ORDER SUMMARY
                    </h2>
                    <StatusChip label="MONAD ESCROW" tone="violet" />
                  </div>

                  <dl className="mt-5 space-y-3 border-b border-line pb-5 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-ink-600">
                        Items ({totalItems}{" "}
                        {totalItems === 1 ? "unit" : "units"})
                      </dt>
                      <dd className="font-mono font-semibold text-ink-950 tabular-nums">
                        {subtotalFormatted} MON
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-ink-600">Escrow protection fee</dt>
                      <dd className="font-mono font-semibold text-success-700 tabular-nums">
                        0.00 MON
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-ink-600">Settlement currency</dt>
                      <dd className="font-mono text-xs font-semibold text-ink-950">
                        Native MON
                      </dd>
                    </div>
                  </dl>

                  {/* Subtotal in MON */}
                  <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-950">
                      SUBTOTAL
                    </span>
                    <MonAmount amount={subtotalFormatted} size="xl" />
                  </div>

                  {/* Monad Escrow Security Notice */}
                  <div className="mt-6 rounded-2xl border border-violet-600/30 bg-lilac-150/40 p-4">
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-violet-700">
                      PROTECTED BY MONAD ESCROW
                    </p>
                    <p className="mt-1.5 text-xs leading-5 text-ink-800">
                      Your payment of{" "}
                      <strong className="font-mono font-semibold text-ink-950">
                        {subtotalFormatted} MON
                      </strong>{" "}
                      is held securely in the{" "}
                      <code className="font-mono text-[11px] text-ink-950">
                        MonVaultEscrow
                      </code>{" "}
                      smart contract and released to the seller only after you
                      confirm delivery.
                    </p>
                  </div>

                  {/* Proceed to Checkout CTA */}
                  <div className="mt-6 space-y-3">
                    <ButtonLink
                      href="/checkout"
                      variant="primary"
                      size="lg"
                      className="w-full"
                    >
                      Proceed to Checkout →
                    </ButtonLink>
                    <ButtonLink
                      href="/shop"
                      variant="secondary"
                      size="md"
                      className="w-full"
                    >
                      Continue Shopping
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
