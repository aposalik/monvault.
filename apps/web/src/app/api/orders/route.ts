import { NextResponse } from "next/server";
import {
  type CreatePostgreSqlOrderInput,
  createPostgreSqlOrder,
  findPostgreSqlOrderByIdOrRef,
  getPostgreSqlOrders,
  type OrderFulfillmentUpdateInput,
  updatePostgreSqlOrderFulfillment,
} from "@/lib/db/orders-repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  const wallet = searchParams.get("wallet")?.trim().toLowerCase();

  if (query) {
    const order = await findPostgreSqlOrderByIdOrRef(query);
    if (!order) {
      return NextResponse.json(
        { error: "Order not found", query },
        { status: 404 },
      );
    }
    return NextResponse.json({ source: "postgresql", order });
  }

  let orders = await getPostgreSqlOrders();
  if (wallet) {
    orders = orders.filter(
      (o) =>
        o.buyerAddress.toLowerCase() === wallet ||
        o.sellerAddress.toLowerCase() === wallet,
    );
  }

  return NextResponse.json({
    source: "postgresql",
    count: orders.length,
    orders,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreatePostgreSqlOrderInput;
    if (!body.productSlug || !body.amountMon || !body.buyerAddress) {
      return NextResponse.json(
        { error: "Missing required order parameters." },
        { status: 400 },
      );
    }
    const order = await createPostgreSqlOrder(body);
    return NextResponse.json({ source: "postgresql", order }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid order creation payload." },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as OrderFulfillmentUpdateInput;
    if (!body.orderId || !body.sellerAddress) {
      return NextResponse.json(
        { error: "orderId and sellerAddress are required." },
        { status: 400 },
      );
    }

    const result = await updatePostgreSqlOrderFulfillment(body);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error ?? "Fulfillment update failed." },
        { status: 403 },
      );
    }

    return NextResponse.json({
      source: "postgresql",
      order: result.order,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 },
    );
  }
}
