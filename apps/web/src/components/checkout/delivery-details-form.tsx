"use client";

import { StatusChip } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";
import type { PrivateDeliveryDraft } from "./checkout-types";

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
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
            STEP 01 · SHIPPING DESTINATION
          </span>
          <h2 className="mt-1.5 text-2xl font-semibold tracking-[-0.03em] text-ink-950">
            Delivery address
          </h2>
        </div>
        <StatusChip label="ENCRYPTED OFF-CHAIN" tone="success" />
      </div>

      <p className="mt-4 text-sm leading-6 text-ink-600">
        Your shipping address is stored in the off-chain PostgreSQL order record
        for merchant fulfillment and is{" "}
        <strong className="font-semibold text-ink-950">
          never written to the public blockchain
        </strong>
        .
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="checkout-recipient-name"
            className="block font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-800"
          >
            Recipient full name
          </label>
          <input
            id="checkout-recipient-name"
            type="text"
            disabled={disabled}
            value={value.recipientName}
            onChange={(e) => updateField("recipientName", e.target.value)}
            placeholder="Kaan Demir"
            className="mt-2 w-full min-h-11 rounded-[12px] border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink-950 placeholder:text-ink-600/60 disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor="checkout-city-district"
            className="block font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-800"
          >
            City &amp; district
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
            Street address, building &amp; suite
          </label>
          <input
            id="checkout-delivery-line"
            type="text"
            disabled={disabled}
            value={value.deliveryLine}
            onChange={(e) => updateField("deliveryLine", e.target.value)}
            placeholder="Söğütözü Cad. No: 42, Floor 4"
            className="mt-2 w-full min-h-11 rounded-[12px] border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink-950 placeholder:text-ink-600/60 disabled:opacity-60"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="checkout-contact-note"
            className="block font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-800"
          >
            Delivery instructions (optional)
          </label>
          <input
            id="checkout-contact-note"
            type="text"
            disabled={disabled}
            value={value.contactNote}
            onChange={(e) => updateField("contactNote", e.target.value)}
            placeholder="Courier instructions or building access note"
            className="mt-2 w-full min-h-11 rounded-[12px] border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink-950 placeholder:text-ink-600/60 disabled:opacity-60"
          />
        </div>
      </div>
    </Surface>
  );
}
