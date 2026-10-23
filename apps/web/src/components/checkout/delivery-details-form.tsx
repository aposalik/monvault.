"use client";

import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";
import {
  DEFAULT_DEMO_DELIVERY,
  type PrivateDeliveryDraft,
} from "./checkout-types";

export interface DeliveryDetailsFormProps {
  value: PrivateDeliveryDraft;
  onChange: (next: PrivateDeliveryDraft) => void;
  disabled?: boolean;
}

export function DeliveryDetailsForm({
  value,
  onChange,
  disabled = false,
}: DeliveryDetailsFormProps) {
  function updateField<K extends keyof PrivateDeliveryDraft>(
    field: K,
    fieldValue: PrivateDeliveryDraft[K],
  ) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
    <Surface tone="raised" radius="card" className="p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-success-700">
              STEP 01 · OFF-CHAIN DELIVERY RECORD
            </span>
            <StatusChip label="STORED OFF-CHAIN ONLY" tone="success" />
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink-950">
            Private delivery details
          </h2>
        </div>

        <Button
          variant="secondary"
          size="md"
          disabled={disabled}
          onClick={() => onChange(DEFAULT_DEMO_DELIVERY)}
        >
          Reset to demo address
        </Button>
      </div>

      <p className="mt-4 text-sm leading-6 text-ink-600">
        These fields stay in the private off-chain order record. They are{" "}
        <strong className="font-semibold text-ink-950">
          never passed to the smart contract
        </strong>{" "}
        or emitted in blockchain events. Use a fictitious demo destination only.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="checkout-recipient-name"
            className="block font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-800"
          >
            Recipient alias (off-chain)
          </label>
          <input
            id="checkout-recipient-name"
            type="text"
            disabled={disabled}
            value={value.recipientName}
            onChange={(e) => updateField("recipientName", e.target.value)}
            placeholder="Demo Buyer (Testnet)"
            className="mt-2 w-full min-h-11 rounded-[12px] border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink-950 placeholder:text-ink-600/60 disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor="checkout-city-district"
            className="block font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-800"
          >
            City / venue (off-chain)
          </label>
          <input
            id="checkout-city-district"
            type="text"
            disabled={disabled}
            value={value.cityAndDistrict}
            onChange={(e) => updateField("cityAndDistrict", e.target.value)}
            placeholder="Çankaya, Ankara"
            className="mt-2 w-full min-h-11 rounded-[12px] border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink-950 placeholder:text-ink-600/60 disabled:opacity-60"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="checkout-delivery-line"
            className="block font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-800"
          >
            Demo delivery destination (off-chain)
          </label>
          <input
            id="checkout-delivery-line"
            type="text"
            disabled={disabled}
            value={value.deliveryLine}
            onChange={(e) => updateField("deliveryLine", e.target.value)}
            placeholder="Monad Blitz Demo Desk · Floor 2"
            className="mt-2 w-full min-h-11 rounded-[12px] border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink-950 placeholder:text-ink-600/60 disabled:opacity-60"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="checkout-contact-note"
            className="block font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-800"
          >
            Shipment handoff note (off-chain)
          </label>
          <input
            id="checkout-contact-note"
            type="text"
            disabled={disabled}
            value={value.contactNote}
            onChange={(e) => updateField("contactNote", e.target.value)}
            placeholder="Optional demo note for the seller"
            className="mt-2 w-full min-h-11 rounded-[12px] border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink-950 placeholder:text-ink-600/60 disabled:opacity-60"
          />
        </div>
      </div>
    </Surface>
  );
}
