import { NextResponse } from "next/server";
import { queryPgProductBySlug } from "@/lib/db/postgres";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const product = await queryPgProductBySlug(slug);

  if (!product) {
    return NextResponse.json(
      { error: "Product not found", slug },
      { status: 404 },
    );
  }

  return NextResponse.json({
    source: "postgresql",
    product,
  });
}
