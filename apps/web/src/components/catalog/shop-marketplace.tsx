"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import {
  type DemoProduct,
  MARKETPLACE_CATEGORIES,
  type ProductCategory,
} from "@/data/catalog";
import type { ProductSortOption } from "@/lib/db/postgres";
import { ProductCard } from "./product-card";

export interface ShopMarketplaceProps {
  initialProducts: DemoProduct[];
}

const SORT_OPTIONS: Array<{ value: ProductSortOption; label: string }> = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function ShopMarketplace({ initialProducts }: ShopMarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    "All" | ProductCategory
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<ProductSortOption>("popular");

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: initialProducts.length };
    for (const product of initialProducts) {
      counts[product.category] = (counts[product.category] ?? 0) + 1;
    }
    return counts;
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    if (selectedCategory !== "All") {
      list = list.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.specs.some(
            (s) =>
              s.label.toLowerCase().includes(q) ||
              s.value.toLowerCase().includes(q),
          ),
      );
    }

    list.sort((a, b) => {
      if (sortBy === "price-asc") return a.priceNumeric - b.priceNumeric;
      if (sortBy === "price-desc") return b.priceNumeric - a.priceNumeric;
      if (sortBy === "rating") return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });

    return list;
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  function handleResetFilters() {
    setSelectedCategory("All");
    setSearchQuery("");
    setSortBy("popular");
  }

  return (
    <div>
      {/* Search, Category Filter Pills, and Sort Toolbar */}
      <Surface tone="raised" radius="card" className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <label htmlFor="marketplace-search" className="sr-only">
              Search marketplace products
            </label>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 fill-none stroke-ink-600 stroke-[1.8]"
            >
              <circle cx="9" cy="9" r="6" />
              <path d="m13.5 13.5 3.5 3.5" strokeLinecap="round" />
            </svg>
            <input
              id="marketplace-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keyboards, studio audio, hardware wallets, specs…"
              className="min-h-11 w-full rounded-xl border border-line bg-canvas pl-10 pr-9 py-2.5 text-sm text-ink-950 placeholder:text-ink-600/70 focus:border-violet-600 focus:outline-none"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search query"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md px-1.5 py-0.5 font-mono text-xs text-ink-600 hover:bg-muted hover:text-ink-950 cursor-pointer"
              >
                ✕
              </button>
            ) : null}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <label
              htmlFor="marketplace-sort"
              className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-600"
            >
              Sort by
            </label>
            <select
              id="marketplace-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as ProductSortOption)}
              className="min-h-11 rounded-xl border border-line bg-canvas px-3.5 py-2 text-sm font-medium text-ink-950 focus:border-violet-600 focus:outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Product categories"
          className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4"
        >
          {MARKETPLACE_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            const count = categoryCounts[category] ?? 0;

            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(category)}
                className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? "border-ink-950 bg-ink-950 text-white"
                    : "border-line bg-canvas text-ink-800 hover:bg-muted hover:text-ink-950"
                }`}
              >
                <span>{category}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 font-mono text-[11px] font-semibold leading-none tabular-nums ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-muted text-ink-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </Surface>

      {/* Active Result Summary */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-sm text-ink-600">
        <p>
          Showing{" "}
          <strong className="font-mono font-semibold text-ink-950 tabular-nums">
            {filteredProducts.length}
          </strong>{" "}
          of{" "}
          <strong className="font-mono font-semibold text-ink-950 tabular-nums">
            {initialProducts.length}
          </strong>{" "}
          escrow-protected products
          {selectedCategory !== "All" ? (
            <>
              {" "}
              in{" "}
              <span className="font-semibold text-violet-700">
                {selectedCategory}
              </span>
            </>
          ) : null}
        </p>

        {selectedCategory !== "All" || searchQuery.trim().length > 0 ? (
          <button
            type="button"
            onClick={handleResetFilters}
            className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700 underline hover:text-ink-950 cursor-pointer"
          >
            Reset filters
          </button>
        ) : null}
      </div>

      {/* Product Grid or Empty Filter State */}
      {filteredProducts.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <Surface tone="raised" radius="card" className="mt-6 p-10 text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
            NO MATCHING PRODUCTS
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink-950">
            No products matched your search or category filter.
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-600">
            Try clearing your search query or switching back to all marketplace
            categories.
          </p>
          <div className="mt-5 flex justify-center">
            <Button
              variant="secondary"
              size="md"
              onClick={handleResetFilters}
            >
              Show all products
            </Button>
          </div>
        </Surface>
      )}
    </div>
  );
}
