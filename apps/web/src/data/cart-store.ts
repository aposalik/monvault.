"use client";

import { useMemo, useSyncExternalStore } from "react";
import { type DemoProduct, getProductBySlug } from "./catalog";

const CART_STORAGE_KEY = "monvault_cart_items_v2";
const CART_EVENT_NAME = "monvault:cart-updated";

export interface StoredCartEntry {
  slug: string;
  quantity: number;
}

export interface CartLineItem {
  product: DemoProduct;
  quantity: number;
  lineTotalMon: number;
  lineTotalFormatted: string;
}

let cachedRawJson = "[]";
let cachedEntries: StoredCartEntry[] = [];
const EMPTY_ENTRIES: StoredCartEntry[] = [];

function readStoredEntries(): StoredCartEntry[] {
  if (typeof window === "undefined") {
    return EMPTY_ENTRIES;
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      cachedRawJson = "[]";
      cachedEntries = EMPTY_ENTRIES;
      return cachedEntries;
    }

    if (raw === cachedRawJson) {
      return cachedEntries;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      cachedRawJson = raw;
      cachedEntries = EMPTY_ENTRIES;
      return cachedEntries;
    }

    const valid: StoredCartEntry[] = [];
    for (const entry of parsed) {
      if (
        entry &&
        typeof entry === "object" &&
        "slug" in entry &&
        typeof entry.slug === "string" &&
        "quantity" in entry &&
        typeof entry.quantity === "number" &&
        entry.quantity > 0
      ) {
        const product = getProductBySlug(entry.slug);
        if (product) {
          valid.push({
            slug: entry.slug,
            quantity: Math.min(Math.floor(entry.quantity), product.stock),
          });
        }
      }
    }

    cachedRawJson = raw;
    cachedEntries = valid;
    return cachedEntries;
  } catch {
    return EMPTY_ENTRIES;
  }
}

function writeStoredEntries(entries: StoredCartEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(entries);
    cachedRawJson = raw;
    cachedEntries = entries;
    window.localStorage.setItem(CART_STORAGE_KEY, raw);
    window.dispatchEvent(new CustomEvent(CART_EVENT_NAME));
  } catch {
    // Ignore storage errors in restricted browsing modes
  }
}

export function addCartItem(slug: string, quantityToAdd = 1): void {
  const product = getProductBySlug(slug);
  if (!product || product.stock <= 0) return;

  const current = [...readStoredEntries()];
  const index = current.findIndex((item) => item.slug === slug);

  if (index >= 0) {
    const nextQty = Math.min(
      current[index].quantity + quantityToAdd,
      product.stock,
    );
    current[index] = { slug, quantity: nextQty };
  } else {
    current.push({
      slug,
      quantity: Math.min(Math.max(1, quantityToAdd), product.stock),
    });
  }

  writeStoredEntries(current);
}

export function incrementCartItem(slug: string): void {
  addCartItem(slug, 1);
}

export function decrementCartItem(slug: string): void {
  const current = [...readStoredEntries()];
  const index = current.findIndex((item) => item.slug === slug);
  if (index < 0) return;

  const nextQty = current[index].quantity - 1;
  if (nextQty <= 0) {
    current.splice(index, 1);
  } else {
    current[index] = { slug, quantity: nextQty };
  }
  writeStoredEntries(current);
}

export function removeCartItem(slug: string): void {
  const current = readStoredEntries().filter((item) => item.slug !== slug);
  writeStoredEntries(current);
}

export function clearCartSelection(): void {
  writeStoredEntries([]);
}

export function setCartProductSlug(slug: string): void {
  const current = readStoredEntries();
  if (current.some((item) => item.slug === slug)) return;
  addCartItem(slug, 1);
}

function subscribeToCart(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(CART_EVENT_NAME, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(CART_EVENT_NAME, handler);
  };
}

export function useCartSelection() {
  const entries = useSyncExternalStore(
    subscribeToCart,
    readStoredEntries,
    () => EMPTY_ENTRIES,
  );

  return useMemo(() => {
    const items: CartLineItem[] = [];
    let totalItems = 0;
    let subtotalMon = 0;

    for (const entry of entries) {
      const product = getProductBySlug(entry.slug);
      if (!product) continue;

      const lineTotalMon = Number((product.priceNumeric * entry.quantity).toFixed(2));
      items.push({
        product,
        quantity: entry.quantity,
        lineTotalMon,
        lineTotalFormatted: lineTotalMon.toFixed(2),
      });
      totalItems += entry.quantity;
      subtotalMon = Number((subtotalMon + lineTotalMon).toFixed(2));
    }

    const primaryProduct = items[0]?.product ?? null;

    return {
      items,
      totalItems,
      subtotalMon,
      subtotalFormatted: subtotalMon.toFixed(2),
      product: primaryProduct,
      addItem: addCartItem,
      incrementItem: incrementCartItem,
      decrementItem: decrementCartItem,
      removeItem: removeCartItem,
      selectProduct: setCartProductSlug,
      clearCart: clearCartSelection,
    };
  }, [entries]);
}
