import { NextResponse } from "next/server";
import {
  type ProductSortOption,
  queryPgProducts,
} from "@/lib/db/postgres";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;
  const search = searchParams.get("q") ?? undefined;
  const sort = (searchParams.get("sort") as ProductSortOption | null) ?? "popular";

  const products = await queryPgProducts({ category, search, sort });

  return NextResponse.json({
    source: "postgresql",
    count: products.length,
    products,
  });
}
