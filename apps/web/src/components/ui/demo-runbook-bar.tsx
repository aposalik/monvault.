"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const RUNBOOK_STEPS = [
  { step: "01", label: "Problem & Vault", href: "/", match: (p: string) => p === "/" },
  {
    step: "02",
    label: "Shop Catalog",
    href: "/shop",
    match: (p: string) => p.startsWith("/shop") || p.startsWith("/products"),
  },
  {
    step: "03",
    label: "One-Seller Cart",
    href: "/cart",
    match: (p: string) => p.startsWith("/cart"),
  },
  {
    step: "04",
    label: "Escrow Checkout",
    href: "/checkout",
    match: (p: string) => p.startsWith("/checkout"),
  },
  {
    step: "05",
    label: "Seller Ship",
    href: "/seller/orders",
    match: (p: string) => p.startsWith("/seller"),
  },
  {
    step: "06",
    label: "Buyer Confirm / Dispute",
    href: "/orders/1",
    match: (p: string) => p.startsWith("/orders"),
  },
];

export function DemoRunbookBar() {
  const pathname = usePathname() ?? "/";

  return (
    <div
      aria-label="60-second demo runbook navigation"
      className="border-t border-line bg-canvas/90 px-5 py-2 md:px-10 lg:px-[72px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-600">
          60S DEMO RUNBOOK FLOW:
        </span>

        <ol className="flex flex-wrap items-center gap-1.5">
          {RUNBOOK_STEPS.map((item) => {
            const isActive = item.match(pathname);
            return (
              <li key={item.step}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex min-h-8 items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors ${
                    isActive
                      ? "border-violet-600 bg-lilac-150 text-violet-700"
                      : "border-transparent bg-transparent text-ink-600 hover:border-line hover:bg-surface hover:text-ink-950"
                  }`}
                >
                  <span className="tabular-nums">{item.step}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
