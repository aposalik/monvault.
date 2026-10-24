import {
  type DemoProduct,
  type ProductCategory,
  getProductBySlug,
} from "@/data/catalog";
import {
  type ProductQueryFilters,
  type ProductRow,
  queryPgProductBySlug,
  queryPgProducts,
} from "./postgres";

export function mapProductRowToCatalogProduct(row: ProductRow): DemoProduct {
  const staticMatch = getProductBySlug(row.slug);
  const specEntries = Object.entries(row.specs ?? {}).map(([label, value]) => ({
    label,
    value: String(value),
  }));

  return {
    id: `prod-${String(row.id).padStart(3, "0")}`,
    dbId: row.id,
    slug: row.slug,
    sku: staticMatch?.sku ?? `MV-${row.category.slice(0, 3).toUpperCase()}-0${row.id}`,
    category: row.category as ProductCategory,
    name: row.title,
    title: row.title,
    tagline:
      staticMatch?.tagline ??
      `${row.description.slice(0, 74).trimEnd()}...`,
    description: row.description,
    priceMon: Number(row.price_mon).toFixed(2),
    priceNumeric: Number(row.price_mon),
    sellerName: row.seller_name,
    sellerAddress: row.seller_address,
    imageSrc: row.image_url,
    imageAlt: row.title,
    gallery:
      Array.isArray(row.gallery) && row.gallery.length > 0
        ? row.gallery
        : [row.image_url],
    stock: row.stock,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    badge: row.badge,
    specs: specEntries.length > 0 ? specEntries : (staticMatch?.specs ?? []),
    specsRecord: row.specs ?? {},
    dispatchNote: "Protected by MonVaultEscrow until delivery confirmation.",
    reviewWindowMinutes: 5,
  };
}

export async function getMarketplaceProducts(
  filters: ProductQueryFilters = {},
): Promise<DemoProduct[]> {
  const rows = await queryPgProducts(filters);
  return rows.map(mapProductRowToCatalogProduct);
}

export async function getMarketplaceProductBySlug(
  slug: string,
): Promise<DemoProduct | null> {
  const row = await queryPgProductBySlug(slug);
  return row ? mapProductRowToCatalogProduct(row) : null;
}
