import Image from "next/image";
import Link from "next/link";
import { StatusChip } from "./status-chip";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface text-ink-950">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-16 md:px-10 lg:px-[72px]">
        <div className="grid gap-10 border-b border-line pb-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Link
              href="/"
              aria-label="monvault. home"
              className="inline-flex items-center rounded-xl bg-surface p-2"
            >
              <Image
                src="/brand/monvault-lockup.png"
                alt="monvault."
                width={140}
                height={95}
                className="h-auto w-[124px] object-contain md:w-[138px]"
              />
            </Link>
            <p className="mt-4 max-w-xl text-base leading-7 text-ink-600">
              monvault. is a Monad testnet prototype for delivery-protected
              checkout. A buyer locks native test MON in{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-ink-950">
                MonVaultEscrow
              </code>{" "}
              and the seller is paid only after buyer delivery confirmation or
              an undisputed five-minute review window.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <StatusChip label="TESTNET DEMO ONLY" tone="warning" />
              <StatusChip label="NO CUSTODIAL BACKEND" tone="info" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
                PRODUCT
              </p>
              <ul className="mt-4 space-y-2.5 text-sm font-medium text-ink-800">
                <li>
                  <Link href="/shop" className="hover:text-violet-700">
                    Testnet shop
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-violet-700">
                    Order cart
                  </Link>
                </li>
                <li>
                  <Link href="/checkout" className="hover:text-violet-700">
                    Escrow checkout
                  </Link>
                </li>
                <li>
                  <Link href="/seller/orders" className="hover:text-violet-700">
                    Seller operations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
                SPECIFICATION
              </p>
              <ul className="mt-4 space-y-2.5 text-sm font-medium text-ink-800">
                <li>
                  <Link href="/#how-it-works" className="hover:text-violet-700">
                    Five-step flow
                  </Link>
                </li>
                <li>
                  <Link href="/#architecture" className="hover:text-violet-700">
                    System boundaries
                  </Link>
                </li>
                <li>
                  <Link href="/#outcomes" className="hover:text-violet-700">
                    Three outcomes
                  </Link>
                </li>
                <li>
                  <Link href="/#limitations" className="hover:text-violet-700">
                    Honest limitations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
                EVIDENCE
              </p>
              <ul className="mt-4 space-y-2.5 text-sm font-medium text-ink-800">
                <li>
                  <a
                    href="https://github.com/aposalik/ProofCart"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-violet-700"
                  >
                    GitHub repository ↗
                  </a>
                </li>
                <li>
                  <Link href="/#interactive-proof" className="hover:text-violet-700">
                    Contract state inspector
                  </Link>
                </li>
                <li>
                  <Link href="/#team" className="hover:text-violet-700">
                    Engineering team
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-4 text-xs leading-6 text-ink-600 sm:flex-row sm:items-center">
          <p>
            Built by Abdullah Salik and Fahad Faisal for Monad Blitz Ankara.
            Uses native test MON only—never send real funds or private keys.
          </p>
          <p className="font-mono uppercase tracking-[0.08em]">
            SOLIDITY 0.8.28 · MONAD TESTNET
          </p>
        </div>
      </div>
    </footer>
  );
}
