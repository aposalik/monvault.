"use client";

import { useSyncExternalStore } from "react";
import {
  type DemoProduct,
  getDefaultProduct,
  getProductBySlug,
} from "./catalog";

const CART_STORAGE_KEY = "monvault_active_cart_slug_v1";
const CART_EVENT_NAME = "monvault:cart-updated";

export function readCartSlug(): string | null {
  if (typeof window === "undefined") {
    return getDefaultProduct().slug;
  }

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (stored === "__EMPTY__") {
      return null;
    }
    if (stored && getProductBySlug(stored)) {
      return stored;
    }
    return getDefaultProduct().slug;
  } catch {
    return getDefaultProduct().slug;
  }
}

export function setCartProductSlug(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, slug);
    window.dispatchEvent(new CustomEvent(CART_EVENT_NAME));
  } catch {
    // Ignore storage errors in restricted browsing modes
  }
}

export function clearCartSelection(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, "__EMPTY__");
    window.dispatchEvent(new CustomEvent(CART_EVENT_NAME));
  } catch {
    // Ignore storage errors
  }
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

export function useCartSelection(): {
  product: DemoProduct | null;
  selectProduct: (slug: string) => void;
  clearCart: () => void;
} {
  const slug = useSyncExternalStore(
    subscribeToCart,
    readCartSlug,
    () => getDefaultProduct().slug,
  );

  const product = slug ? (getProductBySlug(slug) ?? null) : null;

  return {
    product,
    selectProduct: setCartProductSlug,
    clearCart: clearCartSelection,
  };
}
