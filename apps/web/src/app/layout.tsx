import type { Metadata } from "next";
import type { ReactNode } from "react";
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
      <head>
        <link
          rel="preload"
          href="/fonts/inter-variable-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:border-2 focus:border-violet-600 focus:bg-surface focus:px-4 focus:py-2.5 focus:font-sans focus:text-sm focus:font-semibold focus:text-ink-950 focus:shadow-lg"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
