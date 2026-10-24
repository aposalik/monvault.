import type { Metadata } from "next";
import { ShopMarketplace } from "@/components/catalog/shop-marketplace";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { StatusChip } from "@/components/ui/status-chip";
import { getMarketplaceProducts } from "@/lib/db/products-repository";

export const metadata: Metadata = {
  title: "Marketplace Shop",
  description:
    "Shop hardware, studio audio, mechanical keyboards, security tokens, and wearables protected by Monad smart contract escrow.",
};

export default async function ShopPage() {
  const products = await getMarketplaceProducts();

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-950">
      <SiteHeader />

      <main
        id="main-content"
        className="flex-1 px-5 py-10 md:px-10 md:py-14 lg:px-[72px] lg:py-16"
      >
        <div className="mx-auto w-full max-w-[1296px]">
          {/* Marketplace Header Banner */}
          <div className="mb-8 flex flex-col justify-between gap-6 border-b border-line pb-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <StatusChip label="ESCROW-PROTECTED MARKETPLACE" tone="violet" />
                <StatusChip label="NATIVE MON SETTLEMENT" tone="success" />
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink-950 md:text-5xl">
                Hardware &amp; gear protected until delivery.
              </h1>
              <p className="mt-2.5 text-base leading-7 text-ink-600">
                Every item in the marketplace is backed by{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-ink-950">
                  MonVaultEscrow
                </code>
                . Funds stay locked in the smart contract until your order
                arrives and you confirm delivery.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 rounded-2xl border border-line bg-surface px-5 py-3.5 text-center sm:gap-6">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                  CATALOG
                </p>
                <p className="mt-0.5 font-mono text-base font-semibold text-ink-950 tabular-nums">
                  {products.length} Items
                </p>
              </div>
              <div className="border-x border-line px-4">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                  CURRENCY
                </p>
                <p className="mt-0.5 font-mono text-base font-semibold text-violet-700">
                  MON
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                  ESCROW FEE
                </p>
                <p className="mt-0.5 font-mono text-base font-semibold text-success-700 tabular-nums">
                  0%
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Search, Category Filters, Sort & Product Grid */}
          <ShopMarketplace initialProducts={products} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
