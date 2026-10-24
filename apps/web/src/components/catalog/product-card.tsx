import Image from "next/image";
import Link from "next/link";
import { Surface } from "@/components/ui/surface";
import type { DemoProduct } from "@/data/catalog";
import { QuickAddToCartButton } from "./add-to-cart-button";
import { MonAmount } from "./mon-amount";

export interface ProductCardProps {
  product: DemoProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <Surface
      tone="raised"
      radius="card"
      className="group flex flex-col justify-between overflow-hidden border border-line transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-violet-600/50 hover:shadow-[0_18px_40px_rgba(16,11,43,0.08)]"
    >
      {/* Product Image Header with Category & Badge */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block border-b border-line bg-muted/40 p-4 transition-colors group-hover:bg-muted/70"
        aria-label={`View ${product.name}`}
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-md border border-line bg-surface px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-600">
            {product.category}
          </span>
          {product.badge ? (
            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-violet-700">
              {product.badge}
            </span>
          ) : null}
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[14px]">
          <Image
            src={product.imageSrc}
            alt={product.imageAlt}
            width={640}
            height={480}
            className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-[1.03]"
          />
        </div>
      </Link>

      {/* Card Body: Rating, Title, Seller Trust Badge, Stock, Price & Add to Cart */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {/* Rating + Stock Indicator */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="inline-flex items-center gap-1 font-medium text-ink-950">
              <span aria-hidden="true" className="text-warning-700">
                ★
              </span>
              <span className="font-mono font-semibold tabular-nums">
                {product.rating.toFixed(2)}
              </span>
              <span className="text-ink-600 tabular-nums">
                ({product.reviewCount})
              </span>
            </div>

            <span
              className={`font-mono text-[11px] font-semibold tabular-nums ${
                product.stock <= 0
                  ? "text-danger-700"
                  : isLowStock
                    ? "text-warning-700"
                    : "text-success-700"
              }`}
            >
              {product.stock <= 0
                ? "Out of stock"
                : isLowStock
                  ? `Only ${product.stock} left`
                  : `${product.stock} in stock`}
            </span>
          </div>

          {/* Product Title */}
          <h2 className="mt-2 line-clamp-2 text-lg font-semibold leading-snug tracking-[-0.02em] text-ink-950">
            <Link
              href={`/products/${product.slug}`}
              className="hover:text-violet-700"
            >
              {product.title}
            </Link>
          </h2>

          {/* Short Description */}
          <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-ink-600">
            {product.description}
          </p>

          {/* Seller Trust Badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-line bg-canvas px-2.5 py-1 text-[11px] text-ink-800">
            <span
              aria-hidden="true"
              className="inline-flex size-4 items-center justify-center rounded-full bg-success-100 font-mono text-[10px] font-bold text-success-700"
            >
              ✓
            </span>
            <span className="font-medium text-ink-950">
              {product.sellerName}
            </span>
            <span className="text-ink-600">· Escrow Protected</span>
          </div>
        </div>

        {/* Price in MON + Direct Add to Cart Button */}
        <div className="mt-5 flex items-center justify-between gap-2 border-t border-line pt-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-600">
              ESCROW PRICE
            </p>
            <MonAmount amount={product.priceMon} size="lg" />
          </div>

          <QuickAddToCartButton slug={product.slug} stock={product.stock} />
        </div>
      </div>
    </Surface>
  );
}
