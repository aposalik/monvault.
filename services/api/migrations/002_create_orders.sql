-- monvault. PostgreSQL Schema Migration 002: Orders & Off-Chain Shipment Metadata
-- Stores off-chain delivery metadata and mirrors indexed MonVaultEscrow contract state

CREATE TABLE IF NOT EXISTS orders (
  order_id TEXT PRIMARY KEY,
  order_ref TEXT NOT NULL UNIQUE,
  product_slug TEXT NOT NULL,
  product_title TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_image_url TEXT NOT NULL,
  amount_mon NUMERIC(12, 2) NOT NULL CHECK (amount_mon > 0),
  buyer_address TEXT NOT NULL,
  seller_name TEXT NOT NULL DEFAULT 'Ankara Precision Lab',
  seller_address TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('paid', 'shipped', 'completed', 'disputed')),
  carrier TEXT,
  tracking_number TEXT,
  delivery_summary TEXT NOT NULL,
  review_remaining_seconds INTEGER,
  settlement_method TEXT,
  transactions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_buyer_address ON orders (buyer_address);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
