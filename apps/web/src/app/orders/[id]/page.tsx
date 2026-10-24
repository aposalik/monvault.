import type { Metadata } from "next";
import Link from "next/link";
import { OrderTrackingExperience } from "@/components/orders/order-tracking-experience";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { getPostgreSqlOrders } from "@/lib/db/orders-repository";

interface OrderTrackingPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return [
    { id: "101" },
    { id: "102" },
    { id: "103" },
    { id: "104" },
    { id: "105" },
    { id: "1" },
    { id: "2" },
    { id: "3" },
  ];
}

export async function generateMetadata({
  params,
}: OrderTrackingPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order #${id} Escrow Status`,
    description: `Inspect Monad escrow status, shipment tracking, and buyer actions for Order #${id}.`,
  };
}

export default async function OrderTrackingPage({
  params,
}: OrderTrackingPageProps) {
  const { id } = await params;
  const orders = await getPostgreSqlOrders();

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
              <Link href="/track" className="hover:text-violet-700">
                ← All Orders
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-ink-950">ORDER #{id}</span>
            </nav>

            <Link
              href="/shop"
              className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700 hover:underline"
            >
              ← Return to Shop
            </Link>
          </div>

          <OrderTrackingExperience
            initialOrders={orders}
            initialOrderId={id}
          />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
