"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DemoRunbookBar } from "./demo-runbook-bar";
import { StatusChip } from "./status-chip";

const navItems = [
  { label: "Shop", href: "/shop", match: (p: string) => p.startsWith("/shop") || p.startsWith("/products") },
  { label: "Cart", href: "/cart", match: (p: string) => p.startsWith("/cart") },
  { label: "Checkout", href: "/checkout", match: (p: string) => p.startsWith("/checkout") },
  { label: "Track order", href: "/orders/1", match: (p: string) => p.startsWith("/orders") },
  { label: "Seller view", href: "/seller/orders", match: (p: string) => p.startsWith("/seller") },
];

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [showRunbook, setShowRunbook] = useState(true);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3 px-5 py-3.5 md:px-10 lg:px-[72px]">
        <Link
          href="/"
          aria-label="monvault. home"
          className="inline-flex min-h-11 items-center gap-2.5 rounded-xl py-1 pr-2 font-sans font-semibold tracking-[-0.04em] text-ink-950"
        >
          <span className="inline-flex items-center justify-center rounded-xl bg-surface p-1">
            <Image
              src="/brand/monvault-mark.png"
              alt=""
              width={40}
              height={40}
              priority
              className="h-9 w-auto object-contain md:h-10"
            />
          </span>
          <span className="text-lg font-semibold tracking-[-0.04em] sm:text-xl">
            monvault.
          </span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {navItems.map((item) => {
            const isActive = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-xl px-3.5 py-2 text-[15px] font-medium transition-colors ${
                  isActive
                    ? "bg-muted font-semibold text-ink-950"
                    : "text-ink-800 hover:bg-muted hover:text-ink-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <StatusChip
            label="MONAD TESTNET"
            tone="violet"
            className="hidden xl:inline-flex"
          />

          <button
            type="button"
            onClick={() => setShowRunbook((prev) => !prev)}
            aria-pressed={showRunbook}
            title="Toggle 60-second demo runbook bar"
            className="hidden min-h-11 items-center rounded-xl border border-line bg-canvas px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-800 transition-colors hover:bg-muted md:inline-flex cursor-pointer"
          >
            {showRunbook ? "Hide Demo Bar" : "60s Demo Bar"}
          </button>

          <Link
            href="/checkout"
            aria-label="Connect wallet during testnet checkout"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-ink-950 bg-surface px-3.5 py-2 text-sm font-semibold text-ink-950 transition-colors hover:bg-muted sm:px-4 sm:text-[15px]"
          >
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-full bg-violet-600"
            />
            <span>Connect wallet</span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-line bg-canvas text-ink-950 transition-colors hover:bg-muted lg:hidden cursor-pointer"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="size-5 fill-none stroke-current stroke-[1.8]"
            >
              {menuOpen ? (
                <path
                  d="M5 5l10 10M15 5 5 15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M3.5 6h13M3.5 10h13M3.5 14h13"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {showRunbook ? <DemoRunbookBar /> : null}

      {menuOpen ? (
        <div
          id="mobile-navigation-drawer"
          className="border-t border-line bg-surface px-5 py-4 md:px-10 lg:hidden"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
              NAVIGATION
            </span>
            <StatusChip label="MONAD TESTNET" tone="violet" />
          </div>
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`inline-flex min-h-11 items-center justify-between rounded-xl px-3 py-2.5 text-base font-medium transition-colors ${
                    isActive
                      ? "bg-muted font-semibold text-violet-700"
                      : "text-ink-950 hover:bg-muted"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-xs text-ink-600">→</span>
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
