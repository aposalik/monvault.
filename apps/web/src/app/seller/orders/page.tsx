import type { Metadata } from "next";
import Link from "next/link";
import { SellerOrdersExperience } from "@/components/seller/seller-orders-experience";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { StatusChip } from "@/components/ui/status-chip";

export const metadata: Metadata = {
  title: "Seller Escrow Operations",
  description:
    "View orders funded into MonVaultEscrow, record off-chain demo tracking references, mark orders shipped, and claim undisputed payouts after timeout.",
};

export default function SellerOrdersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-950">
      <SiteHeader />

      <main
        id="main-content"
        className="flex-1 px-5 py-10 md:px-10 md:py-14 lg:px-[72px] lg:py-16"
      >
        <div className="mx-auto w-full max-w-[1296px]">
          <div className="mb-8 flex flex-col justify-between gap-4 border-b border-line pb-8 sm:flex-row sm:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusChip label="SELLER OPERATIONS VIEW" tone="violet" />
                <StatusChip label="DEMO / OFF-CHAIN TRACKING" tone="info" />
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-ink-950 md:text-5xl">
                Fulfill funded escrow orders.
              </h1>
              <p className="mt-2 max-w-2xl text-base leading-7 text-ink-600">
                Inspect orders where buyers have locked test MON in{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-ink-950">
                  MonVaultEscrow
                </code>
                , save a clearly labelled off-chain demo tracking reference,
                call <code className="font-mono text-xs">markShipped(orderId)</code>{" "}
                to start the 5-minute buyer review window, or claim after
                timeout.
              </p>
            </div>

            <Link
              href="/orders/1"
              className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700 hover:underline"
            >
              Switch to buyer tracking (/orders/1) →
            </Link>
          </div>

          <SellerOrdersExperience />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
