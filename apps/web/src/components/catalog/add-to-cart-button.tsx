"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { useCartSelection } from "@/data/cart-store";

export interface AddToCartActionsProps {
  slug: string;
  priceMon: string;
}

export function AddToCartActions({ slug, priceMon }: AddToCartActionsProps) {
  const router = useRouter();
  const { product: activeCartProduct, selectProduct } = useCartSelection();
  const [justAdded, setJustAdded] = useState(false);

  const isAlreadyInCart = activeCartProduct?.slug === slug;

  function handleAddToCart() {
    selectProduct(slug);
    setJustAdded(true);
    router.push("/cart");
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="primary"
          size="lg"
          onClick={handleAddToCart}
          className="flex-1"
        >
          {justAdded
            ? "Routing to escrow cart…"
            : isAlreadyInCart
              ? `Selected in cart (${priceMon} test MON) → View cart`
              : `Select for escrow (${priceMon} test MON)`}
        </Button>

        <ButtonLink
          href={`/checkout?product=${encodeURIComponent(slug)}`}
          variant="secondary"
          size="lg"
          onClick={() => selectProduct(slug)}
        >
          Direct to checkout
        </ButtonLink>
      </div>

      {activeCartProduct && !isAlreadyInCart ? (
        <p className="font-mono text-[11px] text-ink-600">
          Note: Selecting this item replaces{" "}
          <strong className="font-semibold text-ink-950">
            {activeCartProduct.name}
          </strong>{" "}
          in your active one-order escrow cart.
        </p>
      ) : null}
    </div>
  );
}
