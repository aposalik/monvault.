import type {
  NormalizedOrderView,
  OrderStatus,
  OrderTransactionRecord,
} from "@/lib/orders/presentation";

const BUYER_WALLET =
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" as `0x${string}`;
const SELLER_WALLET =
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" as `0x${string}`;
const EXPLORER_BASE = "https://testnet.monadvision.com/tx";

export interface OrderRecordRow extends NormalizedOrderView {
  carrier: string | null;
  trackingNumber: string | null;
  createdAt: string;
}

const SEEDED_PG_ORDERS: OrderRecordRow[] = [
  {
    orderId: "101",
    orderRef:
      "0x5f9c281073747564696f6865616470686f6e6573000000000000000000000101",
    productSlug: "studio-headphones",
    productName: "Reference Planar Studio Headphones",
    productSku: "MV-AUDIO-01",
    productImageSrc: "/visuals/products/studio-headphones.svg",
    productImageAlt: "Reference Planar Studio Headphones",
    amountMon: "45.00",
    buyerAddress: BUYER_WALLET,
    sellerName: "Ankara Precision Lab",
    sellerAddress: SELLER_WALLET,
    status: "shipped",
    carrier: "DHL Express",
    trackingNumber: "DHL-TR-8849201",
    reviewEndsAtSeconds: 272,
    demoTrackingRef: "DHL Express · DHL-TR-8849201",
    privateDeliverySummary:
      "Söğütözü Cad. No: 42, Floor 4 · Çankaya, Ankara",
    settlementMethod: undefined,
    createdAt: "2026-10-24T08:15:00.000Z",
    transactions: [
      {
        label: "01 · ESCROW DEPOSIT (CREATEORDER)",
        txHash:
          "0x8a91e04b7d23c91f52b0931a4c601872f490b1d452c7a8d96e3f1b20495a1001",
        explorerUrl: `${EXPLORER_BASE}/0x8a91e04b7d23c91f52b0931a4c601872f490b1d452c7a8d96e3f1b20495a1001`,
        state: "confirmed",
      },
      {
        label: "02 · SELLER SHIPMENT (MARKSHIPPED)",
        txHash:
          "0x4f72c18e9a05d31b64e8207c3b519684e210a9c341b6d7e85f2a0c19384b2002",
        explorerUrl: `${EXPLORER_BASE}/0x4f72c18e9a05d31b64e8207c3b519684e210a9c341b6d7e85f2a0c19384b2002`,
        state: "confirmed",
      },
    ],
  },
  {
    orderId: "102",
    orderRef:
      "0x7b14d920776972656c6573736b6579626f617264000000000000000000000102",
    productSlug: "wireless-custom-keyboard",
    productName: "Aether 75% CNC Aluminum Mechanical Keyboard",
    productSku: "MV-KEY-02",
    productImageSrc: "/visuals/products/wireless-custom-keyboard.svg",
    productImageAlt: "Aether 75% CNC Aluminum Mechanical Keyboard",
    amountMon: "62.50",
    buyerAddress: BUYER_WALLET,
    sellerName: "Ankara Precision Lab",
    sellerAddress: SELLER_WALLET,
    status: "paid",
    carrier: null,
    trackingNumber: null,
    reviewEndsAtSeconds: null,
    demoTrackingRef: null,
    privateDeliverySummary:
      "Tunalı Hilmi Cad. No: 88, Apt 7 · Çankaya, Ankara",
    settlementMethod: undefined,
    createdAt: "2026-10-24T08:40:00.000Z",
    transactions: [
      {
        label: "01 · ESCROW DEPOSIT (CREATEORDER)",
        txHash:
          "0x1c84a7029e53d10f92b4831a7c501928f490b1d452c7a8d96e3f1b20495a2001",
        explorerUrl: `${EXPLORER_BASE}/0x1c84a7029e53d10f92b4831a7c501928f490b1d452c7a8d96e3f1b20495a2001`,
        state: "confirmed",
      },
    ],
  },
  {
    orderId: "103",
    orderRef:
      "0x9e31c480636f6c6473746f726167657369676e65720000000000000000000103",
    productSlug: "cold-storage-signer",
    productName: "VaultAir QR Cold-Storage Hardware Signer",
    productSku: "MV-SEC-03",
    productImageSrc: "/visuals/products/cold-storage-signer.svg",
    productImageAlt: "VaultAir QR Cold-Storage Hardware Signer",
    amountMon: "54.00",
    buyerAddress: BUYER_WALLET,
    sellerName: "Ankara Precision Lab",
    sellerAddress: SELLER_WALLET,
    status: "completed",
    carrier: "UPS Express Saver",
    trackingNumber: "1Z999AA10192837465",
    reviewEndsAtSeconds: 0,
    demoTrackingRef: "UPS Express Saver · 1Z999AA10192837465",
    privateDeliverySummary:
      "ODTÜ Teknokent Ikizler Bina B-12 · Çankaya, Ankara",
    settlementMethod: "buyer-confirmed",
    createdAt: "2026-10-23T19:20:00.000Z",
    transactions: [
      {
        label: "01 · ESCROW DEPOSIT (CREATEORDER)",
        txHash:
          "0x3a61e04b7d23c91f52b0931a4c601872f490b1d452c7a8d96e3f1b20495a3001",
        explorerUrl: `${EXPLORER_BASE}/0x3a61e04b7d23c91f52b0931a4c601872f490b1d452c7a8d96e3f1b20495a3001`,
        state: "confirmed",
      },
      {
        label: "02 · SELLER SHIPMENT (MARKSHIPPED)",
        txHash:
          "0x5b72c18e9a05d31b64e8207c3b519684e210a9c341b6d7e85f2a0c19384b3002",
        explorerUrl: `${EXPLORER_BASE}/0x5b72c18e9a05d31b64e8207c3b519684e210a9c341b6d7e85f2a0c19384b3002`,
        state: "confirmed",
      },
      {
        label: "03 · BUYER RELEASE (CONFIRMDELIVERY)",
        txHash:
          "0x9d31b64e8207c3b519684e210a9c341b6d7e85f2a0c19384b20028a91e04b3003",
        explorerUrl: `${EXPLORER_BASE}/0x9d31b64e8207c3b519684e210a9c341b6d7e85f2a0c19384b20028a91e04b3003`,
        state: "confirmed",
      },
    ],
  },
  {
    orderId: "104",
    orderRef:
      "0x4d82f1907468756e646572626f6c74646f636b00000000000000000000000104",
    productSlug: "thunderbolt-nvme-dock",
    productName: "ProStation Thunderbolt 4 NVMe Studio Dock",
    productSku: "MV-HW-04",
    productImageSrc: "/visuals/products/thunderbolt-nvme-dock.svg",
    productImageAlt: "ProStation Thunderbolt 4 NVMe Studio Dock",
    amountMon: "78.00",
    buyerAddress: BUYER_WALLET,
    sellerName: "Ankara Precision Lab",
    sellerAddress: SELLER_WALLET,
    status: "disputed",
    carrier: "Aras Kargo Priority",
    trackingNumber: "ARK-552019482",
    reviewEndsAtSeconds: 180,
    demoTrackingRef: "Aras Kargo Priority · ARK-552019482",
    privateDeliverySummary:
      "Bilkent Cyberpark Tepe Binası No: 14 · Çankaya, Ankara",
    settlementMethod: undefined,
    createdAt: "2026-10-23T15:10:00.000Z",
    transactions: [
      {
        label: "01 · ESCROW DEPOSIT (CREATEORDER)",
        txHash:
          "0x6c91e04b7d23c91f52b0931a4c601872f490b1d452c7a8d96e3f1b20495a4001",
        explorerUrl: `${EXPLORER_BASE}/0x6c91e04b7d23c91f52b0931a4c601872f490b1d452c7a8d96e3f1b20495a4001`,
        state: "confirmed",
      },
      {
        label: "02 · SELLER SHIPMENT (MARKSHIPPED)",
        txHash:
          "0x7d72c18e9a05d31b64e8207c3b519684e210a9c341b6d7e85f2a0c19384b4002",
        explorerUrl: `${EXPLORER_BASE}/0x7d72c18e9a05d31b64e8207c3b519684e210a9c341b6d7e85f2a0c19384b4002`,
        state: "confirmed",
      },
      {
        label: "03 · BUYER DISPUTE LOCK (OPENDISPUTE)",
        txHash:
          "0x2c7a8d96e3f1b20495a10018a91e04b7d23c91f52b0931a4c601872f490b4004",
        explorerUrl: `${EXPLORER_BASE}/0x2c7a8d96e3f1b20495a10018a91e04b7d23c91f52b0931a4c601872f490b4004`,
        state: "confirmed",
      },
    ],
  },
  {
    orderId: "105",
    orderRef:
      "0x8f41b29074616374696c656d6163726f6b657970616400000000000000000105",
    productSlug: "tactile-macro-keypad",
    productName: "CNC Rotary Tactile Macro Keypad",
    productSku: "MV-KEY-01",
    productImageSrc: "/visuals/products/tactile-macro-keypad.svg",
    productImageAlt: "CNC Rotary Tactile Macro Keypad",
    amountMon: "29.00",
    buyerAddress: BUYER_WALLET,
    sellerName: "Ankara Precision Lab",
    sellerAddress: SELLER_WALLET,
    status: "shipped",
    carrier: "FedEx International Priority",
    trackingNumber: "FDX-774920184",
    reviewEndsAtSeconds: 0,
    demoTrackingRef: "FedEx International Priority · FDX-774920184",
    privateDeliverySummary:
      "Atatürk Bulvarı No: 156, Suite 9 · Kavaklıdere, Ankara",
    settlementMethod: undefined,
    createdAt: "2026-10-23T12:00:00.000Z",
    transactions: [
      {
        label: "01 · ESCROW DEPOSIT (CREATEORDER)",
        txHash:
          "0x5a91e04b7d23c91f52b0931a4c601872f490b1d452c7a8d96e3f1b20495a5001",
        explorerUrl: `${EXPLORER_BASE}/0x5a91e04b7d23c91f52b0931a4c601872f490b1d452c7a8d96e3f1b20495a5001`,
        state: "confirmed",
      },
      {
        label: "02 · SELLER SHIPMENT (MARKSHIPPED)",
        txHash:
          "0x8e72c18e9a05d31b64e8207c3b519684e210a9c341b6d7e85f2a0c19384b5002",
        explorerUrl: `${EXPLORER_BASE}/0x8e72c18e9a05d31b64e8207c3b519684e210a9c341b6d7e85f2a0c19384b5002`,
        state: "confirmed",
      },
    ],
  },
];

// Alias order IDs "1", "2", "3" to "101", "102", "104" so legacy links (/orders/1) resolve cleanly
const LEGACY_ID_MAP: Record<string, string> = {
  "1": "101",
  "2": "102",
  "3": "104",
};

interface SupabaseOrderRow {
  order_id: string;
  order_ref: `0x${string}`;
  product_slug: string;
  product_title: string;
  product_sku: string;
  product_image_url: string;
  amount_mon: number | string;
  buyer_address: `0x${string}`;
  seller_name: string;
  seller_address: `0x${string}`;
  status: OrderStatus;
  carrier: string | null;
  tracking_number: string | null;
  delivery_summary: string;
  review_remaining_seconds: number | null;
  settlement_method?: "buyer-confirmed" | "seller-timeout-claim" | null;
  transactions: OrderTransactionRecord[];
  created_at: string;
}

export async function getPostgreSqlOrders(): Promise<OrderRecordRow[]> {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const url = new URL("/rest/v1/orders", supabaseUrl);
      url.searchParams.set("select", "*");
      url.searchParams.set("order", "created_at.desc");

      const response = await fetch(url.toString(), {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 15 },
      });

      if (response.ok) {
        const rows = (await response.json()) as SupabaseOrderRow[];
        if (Array.isArray(rows) && rows.length > 0) {
          return rows.map((row) => ({
            orderId: row.order_id,
            orderRef: row.order_ref,
            productSlug: row.product_slug,
            productName: row.product_title,
            productSku: row.product_sku,
            productImageSrc: row.product_image_url,
            productImageAlt: row.product_title,
            amountMon: Number(row.amount_mon).toFixed(2),
            buyerAddress: row.buyer_address,
            sellerName: row.seller_name,
            sellerAddress: row.seller_address,
            status: row.status,
            carrier: row.carrier,
            trackingNumber: row.tracking_number,
            reviewEndsAtSeconds: row.review_remaining_seconds,
            demoTrackingRef:
              row.carrier && row.tracking_number
                ? `${row.carrier} · ${row.tracking_number}`
                : row.tracking_number,
            privateDeliverySummary: row.delivery_summary,
            settlementMethod: row.settlement_method ?? undefined,
            transactions: Array.isArray(row.transactions)
              ? row.transactions
              : [],
            createdAt: row.created_at,
          }));
        }
      }
    } catch {
      // Fallback to SQL-seeded order list
    }
  }

  return SEEDED_PG_ORDERS;
}

export async function findPostgreSqlOrderByIdOrRef(
  query: string,
): Promise<OrderRecordRow | null> {
  const orders = await getPostgreSqlOrders();
  const normalized = query.trim().replace(/^#/, "").toLowerCase();
  const mappedId = LEGACY_ID_MAP[normalized] ?? normalized;

  return (
    orders.find(
      (order) =>
        order.orderId.toLowerCase() === mappedId ||
        order.orderRef.toLowerCase() === normalized ||
        order.orderRef.toLowerCase().includes(normalized) ||
        (order.trackingNumber &&
          order.trackingNumber.toLowerCase() === normalized),
    ) ?? null
  );
}

export interface OrderFulfillmentUpdateInput {
  orderId: string;
  sellerAddress: string;
  carrier?: string;
  trackingNumber?: string;
  status?: OrderStatus;
  reviewEndsAtSeconds?: number | null;
  settlementMethod?: "buyer-confirmed" | "seller-timeout-claim";
  newTransaction?: OrderTransactionRecord;
}

export async function updatePostgreSqlOrderFulfillment(
  input: OrderFulfillmentUpdateInput,
): Promise<{ ok: boolean; error?: string; order?: OrderRecordRow }> {
  const index = SEEDED_PG_ORDERS.findIndex(
    (item) => item.orderId === input.orderId,
  );
  if (index === -1) {
    return { ok: false, error: `Order #${input.orderId} not found.` };
  }

  const target = SEEDED_PG_ORDERS[index];
  if (
    target.sellerAddress.toLowerCase() !==
    input.sellerAddress.trim().toLowerCase()
  ) {
    return {
      ok: false,
      error: "UnauthorizedSeller: Only the order seller wallet can modify fulfillment.",
    };
  }

  const updatedCarrier = input.carrier ?? target.carrier;
  const updatedTracking = input.trackingNumber ?? target.trackingNumber;
  const updatedTransactions = input.newTransaction
    ? [...target.transactions, input.newTransaction]
    : target.transactions;

  const updatedOrder: OrderRecordRow = {
    ...target,
    status: input.status ?? target.status,
    carrier: updatedCarrier,
    trackingNumber: updatedTracking,
    demoTrackingRef:
      updatedCarrier && updatedTracking
        ? `${updatedCarrier} · ${updatedTracking}`
        : updatedTracking ?? target.demoTrackingRef,
    reviewEndsAtSeconds:
      input.reviewEndsAtSeconds !== undefined
        ? input.reviewEndsAtSeconds
        : target.reviewEndsAtSeconds,
    settlementMethod: input.settlementMethod ?? target.settlementMethod,
    transactions: updatedTransactions,
  };

  SEEDED_PG_ORDERS[index] = updatedOrder;

  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const url = new URL("/rest/v1/orders", supabaseUrl);
      url.searchParams.set("order_id", `eq.${input.orderId}`);
      await fetch(url.toString(), {
        method: "PATCH",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: updatedOrder.status,
          carrier: updatedOrder.carrier,
          tracking_number: updatedOrder.trackingNumber,
          review_remaining_seconds: updatedOrder.reviewEndsAtSeconds,
          settlement_method: updatedOrder.settlementMethod ?? null,
          transactions: updatedOrder.transactions,
        }),
      });
    } catch {
      // Local in-memory PostgreSQL mirror already updated
    }
  }

  return { ok: true, order: updatedOrder };
}

export interface CreatePostgreSqlOrderInput {
  orderRef: `0x${string}`;
  productSlug: string;
  productName: string;
  productSku: string;
  productImageSrc: string;
  amountMon: string;
  buyerAddress: `0x${string}`;
  sellerName: string;
  sellerAddress: `0x${string}`;
  deliverySummary: string;
  txHash: `0x${string}`;
  explorerUrl: string;
}

export async function createPostgreSqlOrder(
  input: CreatePostgreSqlOrderInput,
): Promise<OrderRecordRow> {
  const nextNumericId =
    Math.max(
      105,
      ...SEEDED_PG_ORDERS.map((o) => Number.parseInt(o.orderId, 10) || 100),
    ) + 1;
  const orderId = String(nextNumericId);

  const newOrder: OrderRecordRow = {
    orderId,
    orderRef: input.orderRef,
    productSlug: input.productSlug,
    productName: input.productName,
    productSku: input.productSku,
    productImageSrc: input.productImageSrc,
    productImageAlt: input.productName,
    amountMon: Number.parseFloat(input.amountMon).toFixed(2),
    buyerAddress: input.buyerAddress,
    sellerName: input.sellerName,
    sellerAddress: input.sellerAddress,
    status: "paid",
    carrier: null,
    trackingNumber: null,
    reviewEndsAtSeconds: null,
    demoTrackingRef: null,
    privateDeliverySummary: input.deliverySummary,
    settlementMethod: undefined,
    createdAt: new Date().toISOString(),
    transactions: [
      {
        label: "01 · ESCROW DEPOSIT (CREATEORDER)",
        txHash: input.txHash,
        explorerUrl: input.explorerUrl,
        state: "confirmed",
      },
    ],
  };

  SEEDED_PG_ORDERS.unshift(newOrder);

  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const url = new URL("/rest/v1/orders", supabaseUrl);
      await fetch(url.toString(), {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: newOrder.orderId,
          order_ref: newOrder.orderRef,
          product_slug: newOrder.productSlug,
          product_title: newOrder.productName,
          product_sku: newOrder.productSku,
          product_image_url: newOrder.productImageSrc,
          amount_mon: Number(newOrder.amountMon),
          buyer_address: newOrder.buyerAddress,
          seller_name: newOrder.sellerName,
          seller_address: newOrder.sellerAddress,
          status: newOrder.status,
          carrier: null,
          tracking_number: null,
          delivery_summary: newOrder.privateDeliverySummary,
          review_remaining_seconds: null,
          settlement_method: null,
          transactions: newOrder.transactions,
        }),
      });
    } catch {
      // Local in-memory PostgreSQL mirror already updated
    }
  }

  return newOrder;
}
