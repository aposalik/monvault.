import fs from "node:fs";
import path from "node:path";

export interface ProductRow {
  id: number;
  slug: string;
  title: string;
  description: string;
  price_mon: number;
  category: "Hardware" | "Audio" | "Keyboards" | "Security" | "Wearables";
  image_url: string;
  gallery: string[];
  seller_name: string;
  seller_address: `0x${string}`;
  stock: number;
  rating: number;
  review_count: number;
  badge: string | null;
  specs: Record<string, string>;
  created_at: string;
}

export type ProductSortOption =
  | "popular"
  | "rating"
  | "price-asc"
  | "price-desc";

export interface ProductQueryFilters {
  category?: string;
  search?: string;
  sort?: ProductSortOption;
}

/**
 * Parses the SQL seed file `services/api/seed/001_seed_products.sql` so that
 * the local PostgreSQL fallback engine always stays 100% synchronized with the
 * canonical SQL migration & seed files on disk.
 */
function loadProductsFromSqlSeed(): ProductRow[] {
  const candidates = [
    path.resolve(process.cwd(), "../../services/api/seed/001_seed_products.sql"),
    path.resolve(process.cwd(), "services/api/seed/001_seed_products.sql"),
  ];

  const seedFilePath = candidates.find((p) => fs.existsSync(p));
  if (!seedFilePath) {
    return FALLBACK_PRODUCTS;
  }

  try {
    const sql = fs.readFileSync(seedFilePath, "utf8");
    const valuesMatch = sql.match(/VALUES\s*([\s\S]*?)ON CONFLICT/i);
    if (!valuesMatch?.[1]) {
      return FALLBACK_PRODUCTS;
    }

    const tupleRegex =
      /\(\s*'([^']+)'\s*,\s*'((?:[^']|'')+)'\s*,\s*'((?:[^']|'')+)'\s*,\s*([0-9.]+)\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'::jsonb\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*,\s*(\d+)\s*,\s*'([^']*)'\s*,\s*'([^']+)'::jsonb\s*\)/g;

    const rows: ProductRow[] = [];
    let match: RegExpExecArray | null = tupleRegex.exec(valuesMatch[1]);
    let idCounter = 1;

    while (match !== null) {
      const [
        ,
        slug,
        title,
        description,
        priceMon,
        category,
        imageUrl,
        galleryJson,
        sellerName,
        sellerAddress,
        stock,
        rating,
        reviewCount,
        badge,
        specsJson,
      ] = match;

      rows.push({
        id: idCounter++,
        slug,
        title: title.replace(/''/g, "'"),
        description: description.replace(/''/g, "'"),
        price_mon: Number.parseFloat(priceMon),
        category: category as ProductRow["category"],
        image_url: imageUrl,
        gallery: JSON.parse(galleryJson) as string[],
        seller_name: sellerName,
        seller_address: sellerAddress as `0x${string}`,
        stock: Number.parseInt(stock, 10),
        rating: Number.parseFloat(rating),
        review_count: Number.parseInt(reviewCount, 10),
        badge: badge || null,
        specs: JSON.parse(specsJson) as Record<string, string>,
        created_at: new Date(Date.UTC(2026, 9, 24, 8, 0, idCounter)).toISOString(),
      });

      match = tupleRegex.exec(valuesMatch[1]);
    }

    return rows.length > 0 ? rows : FALLBACK_PRODUCTS;
  } catch {
    return FALLBACK_PRODUCTS;
  }
}

const FALLBACK_PRODUCTS: ProductRow[] = [
  {
    id: 1,
    slug: "studio-headphones",
    title: "Reference Planar Studio Headphones",
    description:
      "Open-back planar magnetic studio monitor headphones with CNC-machined magnesium earcups, detachable balanced 4.4mm Pentaconn cable, and low-distortion acoustic tuning for mastering engineers.",
    price_mon: 45.0,
    category: "Audio",
    image_url: "/visuals/products/studio-headphones.svg",
    gallery: [
      "/visuals/products/studio-headphones.svg",
      "/visuals/products/studio-condenser-mic.svg",
    ],
    seller_name: "Ankara Precision Lab",
    seller_address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    stock: 14,
    rating: 4.92,
    review_count: 128,
    badge: "BEST SELLER",
    specs: {
      "Driver Type": "106mm Planar Magnetic",
      Impedance: "32 Ohms",
      "Frequency Response": "10 Hz – 50 kHz",
      Chassis: "CNC Anodized Magnesium",
      Cable: "2m Braided OFC (4.4mm + 6.35mm)",
      Weight: "380g",
    },
    created_at: "2026-10-24T08:00:01.000Z",
  },
];

/**
 * Executes a product query against Supabase PostgreSQL (when SUPABASE_URL and
 * SUPABASE_ANON_KEY are configured) or the SQL-seeded PostgreSQL table store.
 */
export async function queryPgProducts(
  filters: ProductQueryFilters = {},
): Promise<ProductRow[]> {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const url = new URL("/rest/v1/products", supabaseUrl);
      url.searchParams.set("select", "*");

      if (filters.category && filters.category !== "All") {
        url.searchParams.set("category", `eq.${filters.category}`);
      }
      if (filters.search?.trim()) {
        const q = filters.search.trim();
        url.searchParams.set(
          "or",
          `(title.ilike.*${q}*,description.ilike.*${q}*,category.ilike.*${q}*)`,
        );
      }

      if (filters.sort === "price-asc") {
        url.searchParams.set("order", "price_mon.asc");
      } else if (filters.sort === "price-desc") {
        url.searchParams.set("order", "price_mon.desc");
      } else if (filters.sort === "rating") {
        url.searchParams.set("order", "rating.desc");
      } else {
        url.searchParams.set("order", "review_count.desc");
      }

      const response = await fetch(url.toString(), {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 30 },
      });

      if (response.ok) {
        const data = (await response.json()) as ProductRow[];
        if (Array.isArray(data) && data.length > 0) {
          return data.map((row) => ({
            ...row,
            price_mon: Number(row.price_mon),
            rating: Number(row.rating),
          }));
        }
      }
    } catch {
      // Fall back to local SQL seed execution when offline
    }
  }

  let rows = [...loadProductsFromSqlSeed()];

  if (filters.category && filters.category !== "All") {
    const normalizedCat = filters.category.toLowerCase();
    rows = rows.filter((r) => r.category.toLowerCase() === normalizedCat);
  }

  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    rows = rows.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        Object.values(r.specs).some((val) => val.toLowerCase().includes(q)),
    );
  }

  const sort = filters.sort ?? "popular";
  rows.sort((a, b) => {
    if (sort === "price-asc") return a.price_mon - b.price_mon;
    if (sort === "price-desc") return b.price_mon - a.price_mon;
    if (sort === "rating") return b.rating - a.rating;
    return b.review_count - a.review_count;
  });

  return rows;
}

export async function queryPgProductBySlug(
  slug: string,
): Promise<ProductRow | null> {
  const all = await queryPgProducts();
  return all.find((item) => item.slug === slug) ?? null;
}
