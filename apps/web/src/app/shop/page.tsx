import type { Metadata } from "next";
import { OneSellerBoundary } from "@/components/catalog/one-seller-boundary";
import { ProductCard } from "@/components/catalog/product-card";
import { ButtonLink } from "@/components/ui/button";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { StatusChip } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";
import { DEMO_SELLER, demoProducts } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Testnet Shop",
  description:
    "Browse seeded demo hardware items to test monvault. delivery-protected checkout on Monad testnet.",
};

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-950">
      <SiteHeader />

      <main
        id="main-content"
        className="flex-1 px-5 py-12 md:px-10 md:py-16 lg:px-[72px] lg:py-20"
      >
        <div className="mx-auto w-full max-w-[1296px]">
          {/* Page header */}
          <div className="flex flex-col justify-between gap-6 border-b border-line pb-10 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <StatusChip label="SEEDED DEMO CATALOG" tone="violet" />
                <StatusChip label="NATIVE TEST MON" tone="neutral" />
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-ink-950 md:text-5xl">
                Escrow on every demo order.
              </h1>
              <p className="mt-3 text-base leading-7 text-ink-600 md:text-lg">
                Choose any item below to walk through a complete Monad testnet
                escrow cycle: lock test MON in{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-ink-950">
                  MonVaultEscrow
                </code>
                , mark it shipped from the seller view, and release or dispute
                within the five-minute review window.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="/cart" variant="secondary" size="md">
                View active escrow cart
              </ButtonLink>
              <ButtonLink href="/seller/orders" variant="quiet" size="md">
                Switch to seller view →
              </ButtonLink>
            </div>
          </div>

          {/* One-seller contract boundary notice */}
          <OneSellerBoundary compact className="mt-6" />

          {/* Editorial catalog grid */}
          <section aria-label="Demo products" className="mt-10">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {demoProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  featured={index === 0}
                />
              ))}
            </div>
          </section>

          {/* Concise explainer strip below grid */}
          <Surface tone="muted" radius="card" className="mt-14 p-6 md:p-8">
            <div className="grid gap-6 lg:grid-cols-3">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
                  01 / NO REAL MONEY
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-800">
                  All catalog prices use faucet{" "}
                  <strong className="font-semibold text-ink-950">
                    test MON
                  </strong>{" "}
                  on Monad testnet. Never connect a mainnet vault wallet.
                </p>
              </div>
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
                  02 / ONE RECORDED MERCHANT
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-800">
                  Every seeded item is fulfilled by{" "}
                  <strong className="font-semibold text-ink-950">
                    {DEMO_SELLER.name}
                  </strong>{" "}
                  so you can test both buyer and seller actions cleanly.
                </p>
              </div>
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
                  03 / HONEST DELIVERY ORACLE
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-800">
                  The smart contract enforces fund lock and release rules; the
                  buyer’s confirmation or dispute acts as the delivery signal.
                </p>
              </div>
            </div>
          </Surface>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
