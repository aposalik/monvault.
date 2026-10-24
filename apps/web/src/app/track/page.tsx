import type { Metadata } from "next";
import Link from "next/link";
import { OrderTrackingExperience } from "@/components/orders/order-tracking-experience";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { StatusChip } from "@/components/ui/status-chip";
import { getPostgreSqlOrders } from "@/lib/db/orders-repository";

export const metadata: Metadata = {
  title: "Track Your Order",
  description:
    "Look up your monvault. order by Order ID, reference hash, or connected wallet, monitor shipment progress, and confirm delivery to release escrow.",
};

export default async function TrackOrderPage() {
  const orders = await getPostgreSqlOrders();

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-950">
      <SiteHeader />

      <main
        id="main-content"
        className="flex-1 px-5 py-10 md:px-10 md:py-14 lg:px-[72px] lg:py-16"
      >
        <div className="mx-auto w-full max-w-[1296px]">
          {/* Page Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 border-b border-line pb-8 sm:flex-row sm:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusChip label="ORDER TRACKING & ESCROW" tone="violet" />
                <StatusChip label="MONVAULTESCROW" tone="info" />
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink-950 md:text-5xl">
                Track &amp; manage your escrow orders.
              </h1>
              <p className="mt-2 max-w-2xl text-base leading-7 text-ink-600">
                Look up any order by ID, reference hash, or carrier tracking
                number, inspect its live on-chain escrow status, and confirm
                delivery or open a dispute.
              </p>
            </div>

            <Link
              href="/shop"
              className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700 hover:underline"
            >
              ← Return to Shop
            </Link>
          </div>

          <OrderTrackingExperience initialOrders={orders} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
