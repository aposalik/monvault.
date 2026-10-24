import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  SellerPortalFooter,
  SellerPortalHeader,
} from "@/components/seller/seller-portal-shell";

export const metadata: Metadata = {
  title: "Merchant Portal — Fulfillment & Escrow Operations",
  description:
    "Dedicated monvault. merchant portal connected to PostgreSQL and MonVaultEscrow for order fulfillment, shipment tracking, and settlement claims.",
};

export default function SellerPortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-950">
      <SellerPortalHeader />
      <main
        id="main-content"
        className="flex-1 px-5 py-10 md:px-10 md:py-12 lg:px-[72px] lg:py-14"
      >
        {children}
      </main>
      <SellerPortalFooter />
    </div>
  );
}
