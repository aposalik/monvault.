"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { useCartSelection } from "@/data/cart-store";

export interface QuickAddToCartButtonProps {
  slug: string;
  stock: number;
}

export function QuickAddToCartButton({
  slug,
  stock,
}: QuickAddToCartButtonProps) {
  const { items, addItem } = useCartSelection();
  const [justAdded, setJustAdded] = useState(false);

  const existingEntry = items.find((item) => item.product.slug === slug);
  const currentQty = existingEntry?.quantity ?? 0;

  function handleAdd() {
    if (stock <= 0 || currentQty >= stock) return;
    addItem(slug, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  }

  if (stock <= 0) {
    return (
      <span className="inline-flex min-h-10 items-center justify-center rounded-xl border border-line bg-muted px-3.5 py-2 font-mono text-xs font-semibold uppercase tracking-[0.06em] text-ink-600">
        Out of Stock
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={currentQty >= stock}
      className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60 ${
        justAdded
          ? "border border-success-700 bg-success-100 text-success-700"
          : currentQty > 0
            ? "border border-violet-600 bg-violet-100 text-violet-700 hover:bg-violet-600 hover:text-white"
            : "border border-ink-950 bg-ink-950 text-white hover:bg-violet-600 hover:border-violet-600"
      }`}
    >
      {justAdded ? (
        <>
          <span aria-hidden="true">✓</span>
          <span>Added ({currentQty})</span>
        </>
      ) : currentQty > 0 ? (
        <>
          <span>+ In Cart ({currentQty})</span>
        </>
      ) : (
        <span>+ Add to Cart</span>
      )}
    </button>
  );
}

export interface AddToCartActionsProps {
  slug: string;
  priceMon: string;
  stock?: number;
}

export function AddToCartActions({
  slug,
  priceMon,
  stock = 10,
}: AddToCartActionsProps) {
  const { items, addItem } = useCartSelection();
  const [feedback, setFeedback] = useState(false);

  const existingEntry = items.find((item) => item.product.slug === slug);
  const currentQty = existingEntry?.quantity ?? 0;

  function handleAddToCart() {
    if (stock <= 0 || currentQty >= stock) return;
    addItem(slug, 1);
    setFeedback(true);
    window.setTimeout(() => setFeedback(false), 1800);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="primary"
          size="lg"
          disabled={stock <= 0 || currentQty >= stock}
          onClick={handleAddToCart}
          className="flex-1"
        >
          {feedback
            ? `✓ Added to Cart (${currentQty} in cart)`
            : currentQty > 0
              ? `+ Add Another (${currentQty} in cart · ${priceMon} MON)`
              : `Add to Cart · ${priceMon} MON`}
        </Button>

        <ButtonLink
          href={`/checkout?product=${encodeURIComponent(slug)}`}
          variant="secondary"
          size="lg"
          onClick={() => {
            if (currentQty === 0) {
              addItem(slug, 1);
            }
          }}
        >
          Proceed to Checkout →
        </ButtonLink>
      </div>

      {currentQty > 0 ? (
        <div className="flex items-center justify-between rounded-xl border border-success-700/30 bg-success-100/70 px-4 py-2.5 text-xs text-success-700">
          <span className="font-medium tabular-nums">
            {currentQty} {currentQty === 1 ? "unit" : "units"} in your shopping
            cart ({(Number(priceMon) * currentQty).toFixed(2)} MON).
          </span>
          <Link
            href="/cart"
            className="font-mono font-semibold uppercase tracking-[0.06em] underline hover:text-ink-950"
          >
            View Cart →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
