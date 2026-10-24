import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartActions } from "@/components/catalog/add-to-cart-button";
import { MonAmount } from "@/components/catalog/mon-amount";
import { ProductCard } from "@/components/catalog/product-card";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { SellerIdentity } from "@/components/catalog/seller-identity";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { StatusChip } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";
import {
  getMarketplaceProductBySlug,
  getMarketplaceProducts,
} from "@/lib/db/products-repository";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getMarketplaceProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getMarketplaceProductBySlug(slug);
  if (!product) {
    return { title: "Product Not Found" };
  }
  return {
    title: `${product.title} (${product.priceMon} MON)`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    getMarketplaceProductBySlug(slug),
    getMarketplaceProducts(),
  ]);

  if (!product) {
    notFound();
  }

  const relatedProducts = allProducts
    .filter((item) => item.slug !== product.slug)
    .slice(0, 3);

  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-950">
      <SiteHeader />

      <main
        id="main-content"
        className="flex-1 px-5 py-10 md:px-10 md:py-14 lg:px-[72px] lg:py-16"
      >
        <div className="mx-auto w-full max-w-[1296px]">
          {/* Breadcrumb navigation */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-ink-600"
          >
            <Link href="/shop" className="hover:text-violet-700">
              ← Back to Shop
            </Link>
            <span aria-hidden="true">/</span>
            <span>{product.category}</span>
            <span aria-hidden="true">/</span>
            <span className="text-ink-950">{product.sku}</span>
          </nav>

          {/* Main 2-Column Product Detail Grid */}
          <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Left column: Photo Gallery + Escrow Protection Guarantee Banner */}
            <div className="space-y-6">
              <ProductGallery
                images={product.gallery}
                title={product.title}
                badge={product.badge}
              />

              {/* Escrow Protection Guarantee Banner */}
              <Surface
                tone="raised"
                radius="card"
                className="border border-violet-600/30 bg-lilac-150/40 p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
                    MONVAULT ESCROW GUARANTEE
                  </span>
                  <StatusChip label="100% PROTECTED" tone="violet" />
                </div>
                <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-ink-950">
                  Your {product.priceMon} MON stays locked until you confirm
                  delivery.
                </h2>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-ink-800">
                  <li>
                    • <strong>Zero upfront merchant risk:</strong> Funds are
                    deposited into{" "}
                    <code className="font-mono text-xs text-ink-950">
                      MonVaultEscrow.sol
                    </code>{" "}
                    on Monad at checkout.
                  </li>
                  <li>
                    • <strong>Buyer delivery review window:</strong> Once the
                    seller marks the order shipped, you can inspect your package
                    and either confirm delivery or open a dispute.
                  </li>
                  <li>
                    • <strong>Private shipping data:</strong> Your street
                    address and contact notes never enter blockchain calldata.
                  </li>
                </ul>
              </Surface>
            </div>

            {/* Right column: Product Info, Rating, Stock, Price, Add to Cart, Seller & Specs */}
            <div className="space-y-6">
              <Surface tone="raised" radius="card" className="p-6 md:p-8">
                {/* Category + Rating + Stock Row */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <StatusChip label={product.category} tone="violet" />
                    <span className="font-mono text-xs text-ink-600">
                      SKU: {product.sku}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1 text-xs">
                    <span aria-hidden="true" className="text-warning-700">
                      ★
                    </span>
                    <span className="font-mono font-semibold text-ink-950 tabular-nums">
                      {product.rating.toFixed(2)}
                    </span>
                    <span className="text-ink-600 tabular-nums">
                      ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-ink-950 md:text-4xl">
                  {product.title}
                </h1>
                <p className="mt-3 text-base leading-7 text-ink-600">
                  {product.description}
                </p>

                {/* Price + Stock Status Box */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-canvas p-5">
                  <div>
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                      ESCROW PRICE (NATIVE MON)
                    </p>
                    <div className="mt-1">
                      <MonAmount amount={product.priceMon} size="xl" />
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-semibold tabular-nums ${
                        product.stock <= 0
                          ? "bg-danger-100 text-danger-700"
                          : isLowStock
                            ? "bg-warning-100 text-warning-700"
                            : "bg-success-100 text-success-700"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="size-2 rounded-full bg-current"
                      />
                      {product.stock <= 0
                        ? "Out of Stock"
                        : isLowStock
                          ? `Low Stock · ${product.stock} left`
                          : `In Stock · ${product.stock} available`}
                    </span>
                    <p className="mt-1 font-mono text-[11px] text-ink-600">
                      Instant Monad escrow lock
                    </p>
                  </div>
                </div>

                {/* Add to Cart + Direct Escrow Checkout */}
                <div className="mt-6">
                  <AddToCartActions
                    slug={product.slug}
                    priceMon={product.priceMon}
                    stock={product.stock}
                  />
                </div>

                {/* Seller Identity */}
                <div className="mt-6 border-t border-line pt-6">
                  <SellerIdentity
                    name={product.sellerName}
                    address={product.sellerAddress}
                  />
                </div>
              </Surface>

              {/* Technical Specifications Table (from PostgreSQL JSONB specs) */}
              <Surface tone="raised" radius="card" className="p-6 md:p-7">
                <div className="flex items-center justify-between gap-2 border-b border-line pb-4">
                  <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
                    TECHNICAL SPECIFICATIONS
                  </h2>
                  <span className="font-mono text-[11px] text-ink-600">
                    {product.specs.length} verified attributes
                  </span>
                </div>

                <dl className="mt-4 divide-y divide-line text-sm">
                  {product.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex flex-col justify-between gap-1 py-3 sm:flex-row sm:items-center"
                    >
                      <dt className="font-medium text-ink-600">{spec.label}</dt>
                      <dd className="font-mono text-xs font-semibold text-ink-950 sm:text-right">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Surface>
            </div>
          </div>

          {/* Related Marketplace Products */}
          {relatedProducts.length > 0 ? (
            <section className="mt-16 border-t border-line pt-12">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
                    MORE FROM THE MARKETPLACE
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-ink-950">
                    Other escrow-protected items
                  </h2>
                </div>
                <Link
                  href="/shop"
                  className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700 hover:text-ink-950"
                >
                  View all products →
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
