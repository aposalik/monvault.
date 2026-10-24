import type { Metadata } from "next";
import { SellerOrdersExperience } from "@/components/seller/seller-orders-experience";
import { StatusChip } from "@/components/ui/status-chip";
import { getPostgreSqlOrders } from "@/lib/db/orders-repository";
import { getMarketplaceProducts } from "@/lib/db/products-repository";

export const metadata: Metadata = {
  title: "All Escrow Orders · Merchant Portal",
  description:
    "View orders funded into MonVaultEscrow, record carrier tracking references, mark orders shipped, and claim undisputed payouts after timeout.",
};

export default async function SellerOrdersPage() {
  const [orders, products] = await Promise.all([
    getPostgreSqlOrders(),
    getMarketplaceProducts(),
  ]);

  return (
    <div className="mx-auto w-full max-w-[1296px]">
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-line pb-8 sm:flex-row sm:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip label="ISOLATED MERCHANT PORTAL" tone="violet" />
            <StatusChip label="SHARED POSTGRESQL + ESCROW CONTRACT" tone="info" />
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-ink-950 md:text-5xl">
            Merchant Escrow Order Queue
          </h1>
          <p className="mt-2 max-w-2xl text-base leading-7 text-ink-600">
            Inspect incoming orders where buyers have locked native MON in{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-ink-950">
              MonVaultEscrow
            </code>
            , enter shipping carrier and tracking references, call{" "}
            <code className="font-mono text-xs">markShipped(orderId)</code> to
            start the buyer review period, or claim undisputed payouts via{" "}
            <code className="font-mono text-xs">claimAfterTimeout(orderId)</code>.
          </p>
        </div>
      </div>

      <SellerOrdersExperience
        initialOrders={orders}
        initialProducts={products}
      />
    </div>
  );
}
