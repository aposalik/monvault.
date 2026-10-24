import { ButtonLink } from "@/components/ui/button";
import { SectionShell } from "@/components/ui/section-shell";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { StatusChip } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";

const ESCROW_STEPS = [
  {
    step: "01",
    title: "Fund your order in escrow",
    rule: "createOrder(orderRef, seller)",
    description:
      "At checkout, your payment in native MON is locked directly inside the MonVaultEscrow smart contract on Monad—never sent upfront to the merchant.",
  },
  {
    step: "02",
    title: "Seller ships with verified funds",
    rule: "markShipped(orderId)",
    description:
      "Because funds are verifiably locked on-chain, the seller can fulfill and dispatch your order knowing payment is already committed.",
  },
  {
    step: "03",
    title: "Confirm delivery to release payment",
    rule: "confirmDelivery(orderId)",
    description:
      "Once your order arrives, you confirm receipt to release the escrowed funds immediately to the seller—or open a dispute if something went wrong.",
  },
];

const PROTECTION_GUARANTEES = [
  {
    title: "Funds stay locked until delivery is confirmed",
    description:
      "Neither the seller nor the web application can withdraw your payment early. The smart contract holds the exact order amount until settlement rules are met.",
    tag: "NON-CUSTODIAL ESCROW",
  },
  {
    title: "Personal shipping details stay private",
    description:
      "Only the order reference hash, wallet addresses, and escrow state live on-chain. Your name, street address, and delivery notes remain off-chain.",
    tag: "PRIVACY PRESERVED",
  },
  {
    title: "Deterministic protection for both sides",
    description:
      "Buyers are protected from unshipped orders with a built-in review window and dispute lock, while sellers are protected against unpaid shipments.",
    tag: "SYMMETRIC TRUST",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-950">
      <SiteHeader />

      <main id="main-content" className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="px-5 pb-20 pt-12 md:px-10 md:pb-28 md:pt-20 lg:px-[72px] lg:pb-32 lg:pt-24">
          <div className="mx-auto grid w-full max-w-[1296px] items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <StatusChip label="MONAD SMART CONTRACT ESCROW" tone="violet" />
              </div>

              <h1 className="mt-6 max-w-[14ch] text-[clamp(2.75rem,7vw,5.25rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-ink-950">
                Shop online. Pay only when delivery is confirmed.
              </h1>

              <p className="mt-6 max-w-[56ch] text-lg leading-[1.6] text-ink-600 md:text-xl">
                monvault. protects every order with an on-chain Monad escrow
                contract. Your funds are locked at checkout, the seller ships
                with proof of payment, and money releases only when you confirm
                delivery.
              </p>

              <div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                <ButtonLink href="/shop" variant="primary" size="lg">
                  Explore the shop →
                </ButtonLink>
                <ButtonLink href="/track" variant="secondary" size="lg">
                  Track an order
                </ButtonLink>
              </div>

              <div className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6">
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                    SETTLEMENT
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold text-ink-950">
                    Monad Escrow
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                    RELEASE RULE
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold text-ink-950">
                    Buyer Confirmed
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                    CUSTODY
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold text-ink-950">
                    100% On-Chain
                  </p>
                </div>
              </div>
            </div>

            {/* Clean, high-contrast Escrow Protection Summary Card (No 3D simulation clutter) */}
            <Surface
              tone="raised"
              radius="card"
              className="border border-line p-7 shadow-[0_20px_50px_rgba(16,11,43,0.06)] md:p-9"
            >
              <div className="flex items-center justify-between gap-3 border-b border-line pb-5">
                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
                    ESCROW PROTECTION FLOW
                  </p>
                  <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-ink-950">
                    How your payment stays safe
                  </h2>
                </div>
                <StatusChip label="VERIFIED RULES" tone="success" />
              </div>

              <ol className="mt-6 space-y-5">
                <li className="rounded-2xl border border-line bg-canvas p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-violet-700">
                      STEP 01 · CHECKOUT
                    </span>
                    <span className="rounded-md bg-violet-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-violet-700">
                      PAID
                    </span>
                  </div>
                  <p className="mt-2 text-base font-semibold text-ink-950">
                    Payment locked in smart contract
                  </p>
                  <p className="mt-1 text-sm leading-6 text-ink-600">
                    Exact order amount is held by{" "}
                    <code className="font-mono text-xs text-ink-950">
                      MonVaultEscrow
                    </code>{" "}
                    rather than sent directly to the seller.
                  </p>
                </li>

                <li className="rounded-2xl border border-line bg-canvas p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-violet-700">
                      STEP 02 · FULFILLMENT
                    </span>
                    <span className="rounded-md bg-info-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-info-700">
                      SHIPPED
                    </span>
                  </div>
                  <p className="mt-2 text-base font-semibold text-ink-950">
                    Seller dispatches your order
                  </p>
                  <p className="mt-1 text-sm leading-6 text-ink-600">
                    Seller sees committed funds on-chain and marks the order
                    shipped, starting your delivery review window.
                  </p>
                </li>

                <li className="rounded-2xl border border-line bg-canvas p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-violet-700">
                      STEP 03 · SETTLEMENT
                    </span>
                    <span className="rounded-md bg-success-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-success-700">
                      COMPLETED
                    </span>
                  </div>
                  <p className="mt-2 text-base font-semibold text-ink-950">
                    Released upon your confirmation
                  </p>
                  <p className="mt-1 text-sm leading-6 text-ink-600">
                    Confirm delivery to pay the seller immediately, or open a
                    dispute to freeze the escrowed funds.
                  </p>
                </li>
              </ol>
            </Surface>
          </div>
        </section>

        {/* 2. THREE-STEP HOW IT WORKS SECTION */}
        <SectionShell
          id="how-it-works"
          surface="raised"
          eyebrow="SIMPLE & TRANSPARENT"
          title="Three clear steps from checkout to delivery."
          description="Every order follows a strict, inspectable state machine on Monad—removing blind upfront transfers from online shopping."
        >
          <div className="grid gap-6 md:grid-cols-3">
            {ESCROW_STEPS.map((item) => (
              <Surface
                key={item.step}
                tone="canvas"
                radius="card"
                className="flex flex-col justify-between p-7"
              >
                <div>
                  <span className="inline-flex size-10 items-center justify-center rounded-xl border border-violet-600/30 bg-violet-100 font-mono text-sm font-semibold text-violet-700 tabular-nums">
                    {item.step}
                  </span>
                  <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-ink-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-ink-600">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-line pt-4">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                    ON-CHAIN ACTION
                  </p>
                  <code className="mt-1 block font-mono text-xs font-semibold text-violet-700">
                    {item.rule}
                  </code>
                </div>
              </Surface>
            ))}
          </div>
        </SectionShell>

        {/* 3. CORE GUARANTEES SECTION */}
        <SectionShell
          id="security"
          surface="canvas"
          eyebrow="WHY MONVAULT ESCROW"
          title="Built for buyer confidence and seller certainty."
          description="Public smart contract rules secure the payment while keeping your personal shipping information off the blockchain."
        >
          <div className="grid gap-6 lg:grid-cols-3">
            {PROTECTION_GUARANTEES.map((item) => (
              <Surface
                key={item.title}
                tone="raised"
                radius="card"
                className="flex flex-col justify-between p-7"
              >
                <div>
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
                    {item.tag}
                  </span>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-ink-600">
                    {item.description}
                  </p>
                </div>
              </Surface>
            ))}
          </div>
        </SectionShell>

        {/* 4. DIRECT CTA SECTION */}
        <section className="border-t border-line bg-muted px-5 py-20 md:px-10 md:py-24 lg:px-[72px]">
          <div className="mx-auto flex w-full max-w-[1296px] flex-col items-start justify-between gap-8 rounded-[28px] border border-line bg-surface p-8 shadow-[0_20px_50px_rgba(16,11,43,0.05)] md:p-12 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <StatusChip label="DELIVERY-PROTECTED COMMERCE" tone="violet" />
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink-950 md:text-4xl">
                Ready to shop with smart contract escrow?
              </h2>
              <p className="mt-3 text-base leading-7 text-ink-600 md:text-lg">
                Browse the catalog, add an item to your cart, and lock your
                payment safely in escrow until your delivery arrives.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <ButtonLink href="/shop" variant="primary" size="lg">
                Browse the shop →
              </ButtonLink>
              <ButtonLink href="/orders/1" variant="secondary" size="lg">
                Track existing order
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
