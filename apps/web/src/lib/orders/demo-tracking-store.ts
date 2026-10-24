"use client";

import { useSyncExternalStore } from "react";

export interface DemoShipmentMetadata {
  orderId: string;
  trackingRef: string;
  carrierLabel: string;
  dispatchNote: string;
  updatedAtIso: string;
}

const STORAGE_KEY = "monvault_offchain_shipments_v2";
const EVENT_NAME = "monvault:shipments-updated";

const SEEDED_SHIPMENTS: Record<string, DemoShipmentMetadata> = {
  "101": {
    orderId: "101",
    trackingRef: "DHL-TR-8849201",
    carrierLabel: "DHL Express",
    dispatchNote: "Dispatched from Ankara Precision Lab fulfillment center",
    updatedAtIso: "2026-10-24T08:15:00+03:00",
  },
  "103": {
    orderId: "103",
    trackingRef: "1Z999AA10192837465",
    carrierLabel: "UPS Express Saver",
    dispatchNote: "Delivered and confirmed by buyer",
    updatedAtIso: "2026-10-23T19:20:00+03:00",
  },
  "104": {
    orderId: "104",
    trackingRef: "ARK-552019482",
    carrierLabel: "Aras Kargo Priority",
    dispatchNote: "Shipment logged prior to buyer dispute",
    updatedAtIso: "2026-10-23T15:10:00+03:00",
  },
  "105": {
    orderId: "105",
    trackingRef: "FDX-774920184",
    carrierLabel: "FedEx International Priority",
    dispatchNote: "Delivered to Kavaklıdere reception",
    updatedAtIso: "2026-10-23T12:00:00+03:00",
  },
};

let cachedRawJson: string | null = null;
let cachedMap: Record<string, DemoShipmentMetadata> = SEEDED_SHIPMENTS;

export function readDemoShipmentsMap(): Record<string, DemoShipmentMetadata> {
  if (typeof window === "undefined") {
    return SEEDED_SHIPMENTS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return SEEDED_SHIPMENTS;
    }
    if (raw === cachedRawJson) {
      return cachedMap;
    }
    const parsed = JSON.parse(raw) as Record<string, DemoShipmentMetadata>;
    cachedRawJson = raw;
    cachedMap = {
      ...SEEDED_SHIPMENTS,
      ...parsed,
    };
    return cachedMap;
  } catch {
    return SEEDED_SHIPMENTS;
  }
}

export function saveDemoShipmentMetadata(
  input: Omit<DemoShipmentMetadata, "updatedAtIso">,
): DemoShipmentMetadata {
  const nextRecord: DemoShipmentMetadata = {
    ...input,
    updatedAtIso: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      const current = readDemoShipmentsMap();
      const updated = {
        ...current,
        [input.orderId]: nextRecord,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    } catch {
      // Ignore storage quota errors in restricted browsing modes
    }
  }

  return nextRecord;
}

export function generateDemoTrackingRef(orderId: string): string {
  const padded = orderId.padStart(3, "0");
  return `DHL-TR-8849${padded}`;
}

function subscribeToDemoShipments(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(EVENT_NAME, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(EVENT_NAME, handler);
  };
}

export function useDemoShipments() {
  const shipments = useSyncExternalStore(
    subscribeToDemoShipments,
    readDemoShipmentsMap,
    () => SEEDED_SHIPMENTS,
  );

  return {
    shipments,
    getShipment: (orderId: string): DemoShipmentMetadata | null =>
      shipments[orderId] ?? null,
    saveShipment: saveDemoShipmentMetadata,
  };
}
