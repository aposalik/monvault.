import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CheckoutExperience } from "@/components/checkout/checkout-experience";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { StatusChip } from "@/components/ui/status-chip";

export const metadata: Metadata = {
  title: "Escrow Checkout",
  description:
    "Lock native MON in MonVaultEscrow on Monad while keeping your shipping address private off-chain.",
};

export default function CheckoutPage() {
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
                <StatusChip label="DELIVERY-PROTECTED CHECKOUT" tone="violet" />
                <StatusChip label="MONVAULTESCROW" tone="info" />
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-ink-950 md:text-5xl">
                Complete your escrow order.
              </h1>
              <p className="mt-2 max-w-2xl text-base leading-7 text-ink-600">
                Enter your shipping address, review your order total in native{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-ink-950">
                  MON
                </code>
                , and lock payment in{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-ink-950">
                  MonVaultEscrow
                </code>{" "}
                until delivery is confirmed.
              </p>
            </div>

            <Link
              href="/cart"
              className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700 hover:underline"
            >
              ← Return to Cart
            </Link>
          </div>

          <Suspense
            fallback={
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="h-[460px] rounded-[24px] bg-muted" />
                <div className="h-[520px] rounded-[24px] bg-muted" />
              </div>
            }
          >
            <CheckoutExperience />
          </Suspense>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
