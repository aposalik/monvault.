"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCartSelection } from "@/data/cart-store";

const navItems = [
  {
    label: "Shop",
    href: "/shop",
    match: (p: string) => p.startsWith("/shop") || p.startsWith("/products"),
  },
  {
    label: "Track",
    href: "/track",
    match: (p: string) => p.startsWith("/track") || p.startsWith("/orders"),
  },
];

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems: cartCount } = useCartSelection();
  const isCartActive = pathname.startsWith("/cart");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[1296px] items-center justify-between gap-4 px-5 py-3.5 md:px-10 lg:px-[72px]">
        {/* Brand Logo -> Home */}
        <Link
          href="/"
          aria-label="monvault. home"
          className="inline-flex min-h-11 items-center gap-2.5 rounded-xl py-1 pr-2 font-sans font-semibold tracking-[-0.04em] text-ink-950"
        >
          <span className="inline-flex items-center justify-center rounded-xl bg-surface p-1">
            <Image
              src="/brand/monvault-mark.png"
              alt=""
              width={36}
              height={36}
              priority
              className="h-8 w-auto object-contain md:h-9"
            />
          </span>
          <span className="text-lg font-semibold tracking-[-0.04em] sm:text-xl">
            monvault.
          </span>
        </Link>

        {/* Primary Navigation + Cart Icon */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-1 md:flex"
          >
            {navItems.map((item) => {
              const isActive = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center rounded-xl px-4 py-2 text-[15px] font-medium transition-colors ${
                    isActive
                      ? "bg-muted font-semibold text-ink-950"
                      : "text-ink-600 hover:bg-muted hover:text-ink-950"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Sleek Cart Icon with Reactive Counter */}
          <Link
            href="/cart"
            aria-label={`Shopping cart with ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
            aria-current={isCartActive ? "page" : undefined}
            className={`relative inline-flex min-h-11 items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors ${
              isCartActive
                ? "border-ink-950 bg-ink-950 text-white"
                : "border-line bg-canvas text-ink-950 hover:border-ink-950/30 hover:bg-muted"
            }`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-[18px] shrink-0 fill-none stroke-current stroke-[1.8]"
            >
              <path
                d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M3 6h18" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M16 10a4 4 0 0 1-8 0"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 font-mono text-xs font-semibold leading-none tabular-nums ${
                isCartActive
                  ? "bg-white text-ink-950"
                  : cartCount > 0
                    ? "bg-violet-600 text-white"
                    : "bg-muted text-ink-600"
              }`}
            >
              {cartCount}
            </span>
          </Link>

          {/* Mobile Drawer Toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-line bg-canvas text-ink-950 transition-colors hover:bg-muted md:hidden cursor-pointer"
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

      {menuOpen ? (
        <div
          id="mobile-navigation-drawer"
          className="border-t border-line bg-surface px-5 py-4 md:hidden"
        >
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
