import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface text-ink-950">
      <div className="mx-auto w-full max-w-[1296px] px-5 py-14 md:px-10 lg:px-[72px]">
        <div className="grid gap-10 border-b border-line pb-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <Link
              href="/"
              aria-label="monvault. home"
              className="inline-flex items-center rounded-xl bg-surface py-1"
            >
              <Image
                src="/brand/monvault-lockup.png"
                alt="monvault."
                width={132}
                height={90}
                className="h-auto w-[116px] object-contain md:w-[128px]"
              />
            </Link>
            <p className="mt-4 max-w-lg text-sm leading-6 text-ink-600">
              Online shopping protected by Monad smart contract escrow. Funds
              stay locked in{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-ink-950">
                MonVaultEscrow
              </code>{" "}
              until delivery is confirmed.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
                SHOPPING
              </p>
              <ul className="mt-4 space-y-2.5 text-sm font-medium text-ink-800">
                <li>
                  <Link href="/shop" className="hover:text-violet-700">
                    Shop catalog
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-violet-700">
                    Shopping cart
                  </Link>
                </li>
                <li>
                  <Link href="/track" className="hover:text-violet-700">
                    Track order
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
                ESCROW
              </p>
              <ul className="mt-4 space-y-2.5 text-sm font-medium text-ink-800">
                <li>
                  <Link href="/#how-it-works" className="hover:text-violet-700">
                    How escrow works
                  </Link>
                </li>
                <li>
                  <Link href="/#security" className="hover:text-violet-700">
                    Security &amp; privacy
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/aposalik/monvault."
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-violet-700"
                  >
                    GitHub repository ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-4 text-xs leading-6 text-ink-600 sm:flex-row sm:items-center">
          <p>
            monvault. — Delivery-protected ecommerce powered by Monad smart
            contract escrow.
          </p>
          <p className="font-mono uppercase tracking-[0.08em]">
            MONVAULTESCROW · MONAD TESTNET
          </p>
        </div>
      </div>
    </footer>
  );
}
