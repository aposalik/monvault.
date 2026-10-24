import Image from "next/image";
import { EscrowVaultScene } from "@/components/marketing/escrow-vault-scene";
import { InteractiveProofPanel } from "@/components/marketing/interactive-proof-panel";
import { ButtonLink } from "@/components/ui/button";
import { SectionShell } from "@/components/ui/section-shell";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { StatusChip, type StatusTone } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";

const FIVE_STEPS = [
  {
    step: "01 / PAY",
    title: "Buyer funds the order",
    actor: "Buyer wallet",
    rule: "createOrder(orderRef, seller)",
    description:
      "Checkout creates a private off-chain order record and sends the exact test MON amount to the contract.",
  },
  {
    step: "02 / LOCK",
    title: "Contract secures test MON",
    actor: "MonVaultEscrow",
    rule: "Status.PAID",
    description:
      "Funds sit inside the contract under public rules. Neither the seller nor the web app can withdraw them early.",
  },
  {
    step: "03 / SHIP",
    title: "Seller ships with proof of funds",
    actor: "Seller wallet",
    rule: "markShipped(orderId)",
    description:
      "Seeing committed funds on-chain, the seller adds an off-chain demo tracking reference and marks the order shipped.",
  },
  {
    step: "04 / REVIEW",
    title: "Five-minute buyer review window",
    actor: "Block timestamp",
    rule: "reviewEndsAt = now + 5m",
    description:
      "Shipping starts a deterministic 5-minute demo countdown for the buyer to inspect the delivery and respond.",
  },
  {
    step: "05 / SETTLE",
    title: "Confirm, timeout, or dispute",
    actor: "Buyer or seller",
    rule: "COMPLETED or DISPUTED",
    description:
      "Buyer confirmation pays the seller immediately, an undisputed timeout lets the seller claim, and a dispute freezes funds.",
  },
];

const THREE_OUTCOMES: Array<{
  id: string;
  badge: string;
  tone: StatusTone;
  title: string;
  functionSig: string;
  caller: string;
  condition: string;
  summary: string;
}> = [
  {
    id: "confirm",
    badge: "SELLER PAID IMMEDIATELY",
    tone: "success",
    title: "1. Buyer confirmation",
    functionSig: "confirmDelivery(orderId)",
    caller: "Recorded buyer only",
    condition: "Order status is SHIPPED",
    summary:
      "When the buyer confirms receipt, the contract transitions to COMPLETED and transfers the exact escrowed test MON to the seller in the same transaction.",
  },
  {
    id: "timeout",
    badge: "CLAIMED AFTER 05:00",
    tone: "warning",
    title: "2. Undisputed timeout claim",
    functionSig: "claimAfterTimeout(orderId)",
    caller: "Recorded seller only",
    condition: "SHIPPED + block.timestamp >= reviewEndsAt",
    summary:
      "If the buyer takes no action during the 5-minute review window and no dispute is open, the seller can claim the escrowed payment directly from the contract.",
  },
  {
    id: "dispute",
    badge: "FUNDS FROZEN IN ESCROW",
    tone: "danger",
    title: "3. Buyer dispute lock",
    functionSig: "openDispute(orderId)",
    caller: "Recorded buyer only",
    condition: "PAID, or SHIPPED before reviewEndsAt",
    summary:
      "If there is a problem before the review deadline expires, the buyer opens a dispute. The contract sets DISPUTED and blocks both confirmation and seller timeout claims.",
  },
];

const TEAM_MEMBERS = [
  {
    name: "Abdullah Salik",
    role: "Solidity · Wallet Integration · Monad Testnet Deployment",
    scope:
      "Owns MonVaultEscrow.sol, Foundry verification suite (18 tests), viem/wagmi chain state, transaction receipts, and testnet explorer evidence.",
    tracks: "Work packages S1–S5",
  },
  {
    name: "Fahad Faisal",
    role: "Product UX · Design System · Commerce & Demo Flow",
    scope:
      "Owns the monvault. design system, dimensional escrow storytelling, shop/cart/checkout/tracking/seller routes, and off-chain demo shipment UX.",
    tracks: "Work packages F1–F6",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-950">
      <SiteHeader />

      <main id="main-content" className="flex-1">
        {/* 1. HERO SECTION */}
        <section
          id="top"
          className="px-5 pb-20 pt-10 md:px-10 md:pb-28 md:pt-16 lg:px-[72px] lg:pb-36 lg:pt-20"
        >
          <div className="mx-auto grid w-full max-w-[1296px] items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <StatusChip label="DELIVERY-PROTECTED CHECKOUT" tone="violet" />
                <StatusChip label="TESTNET DEMO" tone="neutral" />
              </div>

              <h1 className="mt-6 max-w-[13ch] text-[clamp(3rem,13vw,5.1rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-ink-950 md:text-[clamp(4rem,6.8vw,6.8rem)]">
                Buy with confidence. Pay when delivery is confirmed.
              </h1>

              <p className="mt-7 max-w-[60ch] text-lg leading-[1.55] text-ink-600 md:text-[21px]">
                monvault. locks native test MON in a public Monad escrow
                contract during checkout. The seller sees committed funds before
                shipping, and payment releases only when you confirm delivery or
                the five-minute review window ends without a dispute.
              </p>

              <div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                <ButtonLink href="/shop" variant="primary" size="lg">
                  Try the testnet shop
                </ButtonLink>
                <ButtonLink href="#how-it-works" variant="secondary" size="lg">
                  See how escrow works
                </ButtonLink>
              </div>

              <div className="mt-8 grid max-w-xl grid-cols-3 gap-4 border-t border-line pt-6">
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                    ESCROW ASSET
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold text-ink-950 tabular-nums">
                    Native test MON
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                    REVIEW WINDOW
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold text-ink-950 tabular-nums">
                    05:00 demo timer
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-600">
                    CUSTODY RULE
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold text-ink-950">
                    Contract-enforced
                  </p>
                </div>
              </div>
            </div>

            <EscrowVaultScene />
          </div>
        </section>

        {/* 2. TRUST GAP SECTION (One tension surface, not two disconnected feature cards) */}
        <SectionShell
          id="trust-gap"
          surface="raised"
          eyebrow="THE COMMERCE TRUST GAP"
          title="Every online order asks one side to take the leap first."
          description="Traditional checkout forces an asymmetric bet between buyer and seller. monvault. replaces blind upfront transfers with a shared, inspectable state machine."
        >
          <Surface tone="canvas" radius="card" className="overflow-hidden p-0">
            <div className="grid divide-y divide-line lg:grid-cols-[1fr_auto_1fr] lg:divide-x lg:divide-y-0">
              {/* Buyer side of tension */}
              <div className="p-7 md:p-10">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-danger-700">
                  BUYER EXPOSURE WITHOUT ESCROW
                </span>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink-950">
                  “I pay before I know the package will arrive.”
                </h3>
                <p className="mt-3 text-base leading-7 text-ink-600">
                  When payment settles to the merchant at checkout, the buyer
                  relies entirely on seller goodwill or platform intervention if
                  an item is never shipped.
                </p>
                <div className="mt-6 rounded-xl border border-line bg-surface p-4">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-violet-700">
                    HOW MONVAULT PROTECTS THE BUYER
                  </p>
                  <p className="mt-1 text-sm leading-6 text-ink-800">
                    Your test MON stays locked in{" "}
                    <code className="font-mono text-xs">MonVaultEscrow</code>{" "}
                    until you call <code className="font-mono text-xs">confirmDelivery</code>{" "}
                    or open a dispute within the review window.
                  </p>
                </div>
              </div>

              {/* Center tension bridge */}
              <div className="flex flex-col items-center justify-center bg-muted px-6 py-8 text-center lg:w-60">
                <span className="rounded-full border border-violet-600 bg-surface px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-violet-700">
                  SHARED RULE
                </span>
                <p className="mt-4 font-mono text-lg font-semibold tracking-[-0.03em] text-ink-950">
                  MonVaultEscrow
                </p>
                <p className="mt-2 text-xs leading-5 text-ink-600">
                  Holds exact funds on Monad testnet until release conditions
                  are satisfied.
                </p>
              </div>

              {/* Seller side of tension */}
              <div className="p-7 md:p-10">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-warning-700">
                  SELLER EXPOSURE WITHOUT ESCROW
                </span>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink-950">
                  “I cannot ship an item before knowing the money is real.”
                </h3>
                <p className="mt-3 text-base leading-7 text-ink-600">
                  Pay-on-delivery leaves sellers vulnerable to unpaid shipments
                  or buyers who receive an order and simply vanish without
                  confirming.
                </p>
                <div className="mt-6 rounded-xl border border-line bg-surface p-4">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-violet-700">
                    HOW MONVAULT PROTECTS THE SELLER
                  </p>
                  <p className="mt-1 text-sm leading-6 text-ink-800">
                    Funds are verifiably locked before you ship, and{" "}
                    <code className="font-mono text-xs">claimAfterTimeout</code>{" "}
                    lets you claim payment once the 5-minute review window
                    passes without a dispute.
                  </p>
                </div>
              </div>
            </div>
          </Surface>
        </SectionShell>

        {/* 3. FIVE-STEP FLOW SECTION */}
        <SectionShell
          id="how-it-works"
          surface="canvas"
          eyebrow="FIVE-STEP ESCROW LIFECYCLE"
          title="One order. Five explicit steps from checkout to settlement."
          description="Every step maps directly to a state transition in MonVaultEscrow.sol—no hidden custodial wallet and no off-chain payment overrides."
        >
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {FIVE_STEPS.map((item) => (
              <li
                key={item.step}
                className="flex flex-col justify-between rounded-[24px] border border-line bg-surface p-6 shadow-[0_14px_34px_rgba(16,11,43,0.04)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700 tabular-nums">
                      {item.step}
                    </span>
                    <span className="rounded-md border border-line bg-canvas px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.06em] text-ink-600">
                      {item.actor}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-ink-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-ink-600">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-line pt-3.5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-600">
                    CONTRACT RULE
                  </p>
                  <code className="mt-1 block font-mono text-xs font-semibold text-ink-950">
                    {item.rule}
                  </code>
                </div>
              </li>
            ))}
          </ol>
        </SectionShell>

        {/* 4. INTERACTIVE PROOF SECTION */}
        <SectionShell
          id="interactive-proof"
          surface="muted"
          eyebrow="TRANSACTION EVIDENCE & STATE MODEL"
          title="A transaction you can see and verify."
          description="Toggle between the four contract states below to see the exact status language, countdown behavior, caller permissions, and explorer proof surfaced in the app."
        >
          <InteractiveProofPanel />
        </SectionShell>

        {/* 5. SYSTEM ARCHITECTURE SECTION */}
        <SectionShell
          id="architecture"
          surface="canvas"
          eyebrow="ARCHITECTURE & PRIVACY BOUNDARIES"
          title="Public money rules on-chain. Personal delivery data off-chain."
          description="Blockchains are public ledgers. monvault. stores only the financial state machine and an opaque order reference hash on Monad, keeping customer addresses and tracking details private."
        >
          <Surface tone="raised" radius="card" className="p-5 md:p-8">
            <Image
              src="/visuals/escrow-architecture.svg"
              alt="Diagram showing Next.js and Wallet in column 1, MonVaultEscrow.sol on Monad Testnet in column 2, and Private Off-Chain Commerce Data in column 3."
              width={960}
              height={360}
              className="h-auto w-full rounded-[16px]"
            />

            <div className="mt-8 grid gap-6 border-t border-line pt-8 md:grid-cols-2">
              <div className="rounded-[18px] border border-line bg-canvas p-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
                    PUBLIC ON MONAD TESTNET
                  </span>
                  <StatusChip label="INSPECTABLE" tone="violet" />
                </div>
                <ul className="mt-4 space-y-2.5 text-sm leading-6 text-ink-800">
                  <li>
                    • Sequential <code className="font-mono text-xs">orderId</code>{" "}
                    and unique hashed <code className="font-mono text-xs">bytes32 orderRef</code>
                  </li>
                  <li>
                    • Buyer and seller wallet addresses (<code className="font-mono text-xs">address</code>)
                  </li>
                  <li>
                    • Exact escrowed native test MON amount (<code className="font-mono text-xs">uint256</code>)
                  </li>
                  <li>
                    • Five-minute review deadline timestamp (<code className="font-mono text-xs">reviewEndsAt</code>)
                  </li>
                  <li>
                    • Current <code className="font-mono text-xs">Status</code>{" "}
                    enum (<code className="font-mono text-xs">PAID</code>,{" "}
                    <code className="font-mono text-xs">SHIPPED</code>,{" "}
                    <code className="font-mono text-xs">COMPLETED</code>,{" "}
                    <code className="font-mono text-xs">DISPUTED</code>)
                  </li>
                </ul>
              </div>

              <div className="rounded-[18px] border border-line bg-canvas p-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-success-700">
                    PRIVATE OFF-CHAIN METADATA
                  </span>
                  <StatusChip label="NEVER IN CALLDATA" tone="success" />
                </div>
                <ul className="mt-4 space-y-2.5 text-sm leading-6 text-ink-800">
                  <li>
                    • Product catalog title, imagery, description, and display
                    pricing
                  </li>
                  <li>
                    • Buyer recipient name, street delivery address, and contact
                    notes
                  </li>
                  <li>
                    • Clearly labelled demo shipment tracking reference and
                    carrier notes
                  </li>
                  <li>
                    • Strict boundary: the off-chain layer never holds private
                    keys and cannot move customer escrow funds
                  </li>
                </ul>
              </div>
            </div>
          </Surface>
        </SectionShell>

        {/* 6. THREE OUTCOMES SECTION */}
        <SectionShell
          id="outcomes"
          surface="raised"
          eyebrow="THREE DETERMINISTIC OUTCOMES"
          title="Every shipped order resolves through one of three rules."
          description="Confirmation, timeout claim, and dispute lock carry equal architectural clarity—every participant knows what happens before signing."
        >
          <div className="grid gap-6 lg:grid-cols-3">
            {THREE_OUTCOMES.map((outcome) => (
              <Surface
                key={outcome.id}
                tone="canvas"
                radius="card"
                className="flex flex-col justify-between p-7"
              >
                <div>
                  <StatusChip label={outcome.badge} tone={outcome.tone} />
                  <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-ink-950">
                    {outcome.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-ink-600">
                    {outcome.summary}
                  </p>
                </div>

                <dl className="mt-8 space-y-2.5 border-t border-line pt-5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
                      FUNCTION
                    </dt>
                    <dd className="font-mono font-semibold text-violet-700">
                      {outcome.functionSig}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
                      CALLER
                    </dt>
                    <dd className="font-medium text-ink-950">
                      {outcome.caller}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="font-mono uppercase tracking-[0.08em] text-ink-600">
                      PRECONDITION
                    </dt>
                    <dd className="font-mono text-[11px] text-ink-800">
                      {outcome.condition}
                    </dd>
                  </div>
                </dl>
              </Surface>
            ))}
          </div>
        </SectionShell>

        {/* 7. HONEST LIMITATIONS SECTION */}
        <SectionShell
          id="limitations"
          surface="night"
          eyebrow="HONEST SECURITY BOUNDARIES"
          title="What the escrow contract enforces—and what it does not claim."
          description="A credible payment prototype states its exact trust boundaries. monvault. enforces custody and release rules on-chain without pretending a smart contract can inspect a physical doorstep."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Surface tone="night" radius="card" className="p-7 md:p-8">
              <StatusChip label="ENFORCED BY SOLIDITY" tone="success" />
              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-white">
                Guaranteed by{" "}
                <code className="font-mono text-xl text-lilac-300">
                  MonVaultEscrow
                </code>
              </h3>
              <ul className="mt-5 space-y-3 text-base leading-7 text-lilac-150/90">
                <li>
                  • Zero-value orders, zero-address sellers, and duplicate
                  order references revert immediately.
                </li>
                <li>
                  • Only the recorded seller wallet for that order can call{" "}
                  <code className="font-mono text-sm text-white">markShipped</code>{" "}
                  or{" "}
                  <code className="font-mono text-sm text-white">
                    claimAfterTimeout
                  </code>
                  .
                </li>
                <li>
                  • Only the recorded buyer wallet can call{" "}
                  <code className="font-mono text-sm text-white">
                    confirmDelivery
                  </code>{" "}
                  or{" "}
                  <code className="font-mono text-sm text-white">
                    openDispute
                  </code>
                  .
                </li>
                <li>
                  • Seller timeout claims revert before the full 5-minute window
                  expires or if a dispute was opened.
                </li>
                <li>
                  • Payouts follow checks-effects-interactions and a{" "}
                  <code className="font-mono text-sm text-white">
                    nonReentrant
                  </code>{" "}
                  guard.
                </li>
              </ul>
            </Surface>

            <Surface tone="night" radius="card" className="p-7 md:p-8">
              <StatusChip label="INTENTIONAL MVP SCOPE" tone="warning" />
              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-white">
                Outside autonomous on-chain proof
              </h3>
              <ul className="mt-5 space-y-3 text-base leading-7 text-lilac-150/90">
                <li>
                  • <strong className="text-white">Physical delivery oracle:</strong>{" "}
                  The blockchain cannot independently verify that a physical box
                  arrived; the buyer’s confirmation or dispute acts as the
                  oracle.
                </li>
                <li>
                  • <strong className="text-white">Dispute arbitration:</strong>{" "}
                  Opening a dispute freezes funds in the contract. This MVP
                  intentionally omits admin backdoors or automated refund
                  judges.
                </li>
                <li>
                  • <strong className="text-white">Demo carrier tracking:</strong>{" "}
                  Shipment tracking numbers are stored off-chain for the demo
                  and are not cryptographic carrier proofs.
                </li>
                <li>
                  • <strong className="text-white">Testnet only:</strong> All
                  orders use disposable wallets and faucet test MON—never real
                  money.
                </li>
              </ul>
            </Surface>
          </div>
        </SectionShell>

        {/* 8. TEAM & REPOSITORY SECTION */}
        <SectionShell
          id="team"
          surface="canvas"
          eyebrow="ENGINEERING TEAM & REPOSITORY"
          title="Built with explicit ownership and verified slices."
          description="Contract logic and chain state are verified with 18 Foundry tests before connecting the customer and seller experiences."
        >
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="grid gap-6 sm:grid-cols-2">
              {TEAM_MEMBERS.map((member) => (
                <Surface
                  key={member.name}
                  tone="raised"
                  radius="card"
                  className="flex flex-col justify-between p-7"
                >
                  <div>
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-violet-700">
                      {member.tracks}
                    </span>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink-950">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-ink-800">
                      {member.role}
                    </p>
                    <p className="mt-4 text-sm leading-6 text-ink-600">
                      {member.scope}
                    </p>
                  </div>
                </Surface>
              ))}
            </div>

            <Surface tone="muted" radius="card" className="p-7">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
                DELIVERY ROADMAP
              </span>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink-950">
                Verification status
              </h3>
              <ul className="mt-5 space-y-3 text-sm">
                <li className="flex items-center justify-between gap-2 border-b border-line pb-2.5">
                  <span className="font-medium text-ink-950">
                    Phase 1–2 · Escrow contract &amp; 18 Foundry tests
                  </span>
                  <StatusChip label="COMPLETE" tone="success" />
                </li>
                <li className="flex items-center justify-between gap-2 border-b border-line pb-2.5">
                  <span className="font-medium text-ink-950">
                    F1 · Design system &amp; portfolio homepage
                  </span>
                  <StatusChip label="COMPLETE" tone="success" />
                </li>
                <li className="flex items-center justify-between gap-2 border-b border-line pb-2.5">
                  <span className="font-medium text-ink-950">
                    F2–F6 · Shop, Checkout, Tracking, Seller &amp; Demo QA
                  </span>
                  <StatusChip label="COMPLETE" tone="success" />
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span className="font-medium text-ink-950">
                    Phase 3 · Monad testnet deployment &amp; proof
                  </span>
                  <StatusChip label="NEXT UP" tone="info" />
                </li>
              </ul>

              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink
                  href="https://github.com/aposalik/ProofCart"
                  variant="secondary"
                  size="md"
                  external
                >
                  View GitHub repository ↗
                </ButtonLink>
              </div>
            </Surface>
          </div>
        </SectionShell>

        {/* 9. FINAL CTA SECTION */}
        <section className="border-t border-line bg-muted px-5 py-20 md:px-10 md:py-28 lg:px-[72px]">
          <div className="mx-auto flex w-full max-w-[1296px] flex-col items-start justify-between gap-8 rounded-[28px] border border-line bg-surface p-8 shadow-[0_24px_60px_rgba(16,11,43,0.06)] md:p-12 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <StatusChip label="READY TO TEST" tone="violet" />
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink-950 md:text-5xl">
                Walk through a delivery-protected order from cart to payout.
              </h2>
              <p className="mt-3 text-base leading-7 text-ink-600 md:text-lg">
                Browse the seeded demo catalog, lock test MON in escrow, or
                inspect the contract state machine before connecting a disposable
                testnet wallet.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <ButtonLink href="/shop" variant="primary" size="lg">
                Enter testnet shop
              </ButtonLink>
              <ButtonLink
                href="#interactive-proof"
                variant="secondary"
                size="lg"
              >
                Inspect contract state
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
