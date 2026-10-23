import type { Metadata } from "next";
import Link from "next/link";
import { OrderTrackingExperience } from "@/components/orders/order-tracking-experience";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";

interface OrderTrackingPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export async function generateMetadata({
  params,
}: OrderTrackingPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order #${id} Escrow Status`,
    description: `Inspect Monad testnet escrow status, five-minute buyer review timer, and transaction evidence for Order #${id}.`,
  };
}

export default async function OrderTrackingPage({
  params,
}: OrderTrackingPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-950">
      <SiteHeader />

      <main
        id="main-content"
        className="flex-1 px-5 py-10 md:px-10 md:py-14 lg:px-[72px] lg:py-16"
      >
        <div className="mx-auto w-full max-w-[1296px]">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-ink-600"
            >
              <Link href="/shop" className="hover:text-violet-700">
                Shop
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/checkout" className="hover:text-violet-700">
                Checkout
              </Link>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-ink-950">Order #{id}</span>
            </nav>

            <Link
              href="/seller/orders"
              className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700 hover:underline"
            >
              Switch to seller dashboard →
            </Link>
          </div>

          <OrderTrackingExperience orderId={id} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
