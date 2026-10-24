import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import type { DemoProduct } from "@/data/catalog";
import { MonAmount } from "./mon-amount";
import { SellerIdentity } from "./seller-identity";

export interface ProductCardProps {
  product: DemoProduct;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  return (
    <Surface
      tone="raised"
      radius="card"
      selected={featured}
      className="group flex flex-col justify-between overflow-hidden transition-transform duration-150 ease-out hover:-translate-y-1"
    >
      {/* Product visual occupies ~60% of card height per DESIGN.md section 8 */}
      <Link
        href={`/products/${product.slug}`}
        className="block border-b border-line bg-muted/50 p-4 transition-colors group-hover:bg-muted"
        aria-label={`Inspect ${product.name}`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[16px]">
          <Image
            src={product.imageSrc}
            alt={product.imageAlt}
            width={640}
            height={480}
            className="h-full w-full object-cover"
          />
        </div>
      </Link>

      {/* Compact metadata + single action (no legal boilerplate inside card) */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-violet-700">
              {product.category}
            </span>
            {featured ? (
              <span className="rounded-full bg-lilac-150 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-violet-700">
                DEMO RUNBOOK ITEM
              </span>
            ) : null}
          </div>

          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink-950">
            <Link
              href={`/products/${product.slug}`}
              className="hover:text-violet-700"
            >
              {product.name}
            </Link>
          </h2>

          <p className="mt-1.5 text-sm leading-6 text-ink-600">
            {product.tagline}
          </p>

          <SellerIdentity
            name={product.sellerName}
            address={product.sellerAddress}
            compact
            className="mt-3"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <MonAmount
            amount={product.priceMon}
            size="md"
            showTestnetTag={false}
          />
          <ButtonLink
            href={`/products/${product.slug}`}
            variant={featured ? "primary" : "secondary"}
            size="md"
          >
            Inspect item
          </ButtonLink>
        </div>
      </div>
    </Surface>
  );
}
