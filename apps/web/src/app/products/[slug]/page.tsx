import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartActions } from "@/components/catalog/add-to-cart-button";
import { MonAmount } from "@/components/catalog/mon-amount";
import { OneSellerBoundary } from "@/components/catalog/one-seller-boundary";
import { SellerIdentity } from "@/components/catalog/seller-identity";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { StatusChip } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";
import { demoProducts, getProductBySlug } from "@/data/catalog";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return demoProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return { title: "Product Not Found" };
  }
  return {
    title: `${product.name} (${product.priceMon} test MON)`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-950">
      <SiteHeader />

      <main
        id="main-content"
        className="flex-1 px-5 py-10 md:px-10 md:py-14 lg:px-[72px] lg:py-20"
      >
        <div className="mx-auto w-full max-w-[1296px]">
          {/* Breadcrumb navigation */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-ink-600"
          >
            <Link href="/shop" className="hover:text-violet-700">
              ← Back to testnet shop
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink-950">{product.sku}</span>
          </nav>

          {/* Two-column desktop composition; Mobile order: product, price, seller, escrow explanation, action */}
          <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            {/* Left column: Product visual + technical specifications */}
            <div className="space-y-6">
              <Surface tone="raised" radius="card" className="overflow-hidden p-4 sm:p-6">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] bg-muted">
                  <Image
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    width={640}
                    height={480}
                    priority
                    className="h-full w-full object-cover"
                  />
                </div>
              </Surface>

              {/* Hardware specifications (desktop below visual) */}
              <Surface tone="raised" radius="card" className="p-6">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
                  SEEDED PRODUCT SPECIFICATIONS
                </span>
                <dl className="mt-4 divide-y divide-line text-sm">
                  {product.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex flex-wrap items-center justify-between gap-2 py-3"
                    >
                      <dt className="font-mono text-xs uppercase tracking-[0.06em] text-ink-600">
                        {spec.label}
                      </dt>
                      <dd className="font-medium text-ink-950">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </Surface>
            </div>

            {/* Right column: Product header -> Price -> Seller -> Escrow explanation -> Action */}
            <div className="space-y-6">
              <Surface tone="raised" radius="card" className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusChip label={product.category} tone="violet" />
                  <StatusChip label="ESCROW-PROTECTED DEMO" tone="info" />
                </div>

                {/* 1. Product title & description */}
                <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink-950 md:text-4xl">
                  {product.name}
                </h1>
                <p className="mt-3 text-base leading-7 text-ink-600">
                  {product.description}
                </p>

                {/* 2. Price in test MON */}
                <div className="mt-6 rounded-[14px] border border-line bg-canvas p-4">
                  <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                    ESCROW DEPOSIT AMOUNT
                  </span>
                  <div className="mt-1.5">
                    <MonAmount amount={product.priceMon} size="xl" />
                  </div>
                  <p className="mt-1.5 text-xs text-ink-600">
                    Exact amount locked in{" "}
                    <code className="font-mono text-[11px] text-ink-950">
                      MonVaultEscrow.createOrder
                    </code>{" "}
                    at checkout.
                  </p>
                </div>

                {/* 3. Seller identity */}
                <SellerIdentity
                  name={product.sellerName}
                  address={product.sellerAddress}
                  className="mt-4"
                />

                {/* 4. Concise escrow explanation (truthful, no overclaiming) */}
                <div className="mt-5 rounded-[14px] border border-line bg-muted p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-violet-700">
                      CONTRACT-ENFORCED RELEASE RULES
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-ink-800 tabular-nums">
                      05:00 REVIEW WINDOW
                    </span>
                  </div>
                  <ul className="mt-2.5 space-y-1.5 text-xs leading-5 text-ink-800">
                    <li>
                      • Your{" "}
                      <strong className="font-semibold text-ink-950">
                        {product.priceMon} test MON
                      </strong>{" "}
                      is held by the smart contract while the seller prepares
                      shipment.
                    </li>
                    <li>
                      • When the seller marks the order shipped, a{" "}
                      <strong className="font-semibold text-ink-950">
                        5-minute demo review timer
                      </strong>{" "}
                      starts.
                    </li>
                    <li>
                      • Confirm delivery to pay the seller immediately, or open
                      a dispute before the timer expires to freeze funds.
                    </li>
                    <li>
                      • Physical delivery is confirmed by your wallet action—not
                      autonomously verified by the blockchain.
                    </li>
                  </ul>
                </div>

                {/* 5. Primary purchase actions */}
                <div className="mt-6 border-t border-line pt-6">
                  <AddToCartActions
                    slug={product.slug}
                    priceMon={product.priceMon}
                  />
                </div>
              </Surface>

              <OneSellerBoundary />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
