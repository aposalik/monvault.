import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ChainProvider } from "@/lib/chain/provider";

import "./globals.css";

export const metadata: Metadata = {
  applicationName: "monvault.",
  title: {
    default: "monvault. — Delivery-protected checkout on Monad",
    template: "%s · monvault.",
  },
  description:
    "A testnet ecommerce escrow demo that locks payment until delivery confirmation or the review timeout.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ChainProvider>{children}</ChainProvider>
      </body>
    </html>
  );
}
