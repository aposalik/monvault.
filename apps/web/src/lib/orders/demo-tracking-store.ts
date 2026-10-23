"use client";

import { useSyncExternalStore } from "react";

export interface DemoShipmentMetadata {
  orderId: string;
  trackingRef: string;
  carrierLabel: string;
  dispatchNote: string;
  updatedAtIso: string;
}

const STORAGE_KEY = "monvault_offchain_shipments_v1";
const EVENT_NAME = "monvault:shipments-updated";

const SEEDED_SHIPMENTS: Record<string, DemoShipmentMetadata> = {
  "1": {
    orderId: "1",
    trackingRef: "MV-DEMO-TRK-9041",
    carrierLabel: "Off-Chain Demo Courier (Simulated)",
    dispatchNote: "Handed to Monad Blitz demo runner · Box sealed",
    updatedAtIso: "2026-10-23T10:15:00+03:00",
  },
  "3": {
    orderId: "3",
    trackingRef: "MV-DEMO-TRK-9038",
    carrierLabel: "Off-Chain Demo Courier (Simulated)",
    dispatchNote: "Demo shipment logged prior to buyer dispute",
    updatedAtIso: "2026-10-23T09:50:00+03:00",
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
  const padded = orderId.padStart(2, "0");
  return `MV-DEMO-TRK-90${padded}`;
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
