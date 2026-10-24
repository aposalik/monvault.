-- monvault. PostgreSQL Schema Migration 001: Marketplace Products Catalog
-- Compatible with Supabase PostgreSQL / standard PostgreSQL 15+

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price_mon NUMERIC(12, 2) NOT NULL CHECK (price_mon > 0),
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  seller_name TEXT NOT NULL DEFAULT 'Ankara Precision Lab',
  seller_address TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5.00),
  review_count INTEGER NOT NULL DEFAULT 0,
  badge TEXT,
  specs JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_price_mon ON products (price_mon);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products (rating DESC);
