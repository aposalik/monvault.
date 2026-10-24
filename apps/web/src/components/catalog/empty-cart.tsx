"use client";

import { Button, ButtonLink } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";
import { getDefaultProduct } from "@/data/catalog";

export interface EmptyCartProps {
  onRestoreDefault?: (slug: string) => void;
}

export function EmptyCart({ onRestoreDefault }: EmptyCartProps) {
  const flagship = getDefaultProduct();

  return (
    <Surface
      tone="raised"
      radius="card"
      className="mx-auto max-w-2xl p-8 text-center md:p-12"
    >
      <div className="flex justify-center">
        <StatusChip label="NO ACTIVE ESCROW DRAFT" tone="neutral" />
      </div>
      <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-ink-950">
        Your escrow cart is currently empty.
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-base leading-7 text-ink-600">
        Choose one seeded demo item from the catalog to preview how{" "}
        <code className="font-mono text-xs text-ink-950">MonVaultEscrow</code>{" "}
        locks native test MON until delivery confirmation.
      </p>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/shop" variant="primary" size="lg">
          Browse testnet shop
        </ButtonLink>
        {onRestoreDefault ? (
          <Button
            variant="secondary"
            size="lg"
            onClick={() => onRestoreDefault(flagship.slug)}
          >
            Load {flagship.name} ({flagship.priceMon} test MON)
          </Button>
        ) : null}
      </div>
    </Surface>
  );
}
