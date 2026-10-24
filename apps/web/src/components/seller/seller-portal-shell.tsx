"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { StatusChip } from "@/components/ui/status-chip";
import { truncateHex } from "@/components/ui/transaction-proof";
import { DEMO_SELLER } from "@/data/catalog";

const MERCHANT_NAV_ITEMS = [
  {
    label: "Order Fulfillment",
    href: "/seller",
    exact: true,
  },
  {
    label: "All Escrow Orders",
    href: "/seller/orders",
    exact: false,
  },
];

export function SellerPortalHeader() {
  const pathname = usePathname() ?? "/seller";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink-950 text-white">
      <div className="mx-auto flex w-full max-w-[1296px] flex-wrap items-center justify-between gap-4 px-5 py-3.5 md:px-10 lg:px-[72px]">
        <div className="flex items-center gap-4">
          <Link
            href="/seller"
            aria-label="monvault. Merchant Portal"
            className="inline-flex min-h-11 items-center gap-2.5 rounded-xl py-1 pr-2 font-sans font-semibold tracking-[-0.04em] text-white"
          >
            <span className="inline-flex items-center justify-center rounded-xl bg-white p-1">
              <Image
                src="/brand/monvault-mark.png"
                alt=""
                width={32}
                height={32}
                priority
                className="h-7 w-auto object-contain"
              />
            </span>
            <span className="text-lg font-semibold tracking-[-0.04em]">
              monvault.
            </span>
            <span className="rounded-md border border-white/20 bg-white/10 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-lilac-150">
              Merchant Portal
            </span>
          </Link>

          <nav
            aria-label="Merchant portal navigation"
            className="hidden items-center gap-1 md:flex"
          >
            {MERCHANT_NAV_ITEMS.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex min-h-10 items-center rounded-xl px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/15 font-semibold text-white"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 sm:flex">
            <span className="size-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-xs text-white/90">
              {DEMO_SELLER.name}
            </span>
            <code className="font-mono text-[11px] text-white/70">
              {truncateHex(DEMO_SELLER.address, 6, 4)}
            </code>
          </div>
          <StatusChip label="POSTGRESQL + MONAD ESCROW" tone="violet" />
        </div>
      </div>
    </header>
  );
}

export function SellerPortalFooter() {
  return (
    <footer className="border-t border-line bg-surface text-ink-950">
      <div className="mx-auto flex w-full max-w-[1296px] flex-col justify-between gap-4 px-5 py-8 text-xs text-ink-600 sm:flex-row sm:items-center md:px-10 lg:px-[72px]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-ink-950">
            monvault. Merchant Operations Console
          </span>
          <span>·</span>
          <span>
            Connected to shared PostgreSQL database &amp;{" "}
            <code className="font-mono text-[11px] text-ink-950">
              MonVaultEscrow
            </code>
          </span>
        </div>
        <p className="font-mono uppercase tracking-[0.08em] text-ink-600">
          AUTHORIZED SELLER WALLET REQUIRED FOR ON-CHAIN DISPATCH &amp; CLAIMS
        </p>
      </div>
    </footer>
  );
}
