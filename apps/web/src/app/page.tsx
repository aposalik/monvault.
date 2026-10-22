import Image from "next/image";

const flow = [
  {
    label: "01 / PAY",
    title: "Buyer locks test MON",
    body: "The order begins only after the escrow transaction is confirmed.",
  },
  {
    label: "02 / SHIP",
    title: "Seller ships with proof of funds",
    body: "Payment stays in the contract while the order is in transit.",
  },
  {
    label: "03 / RELEASE",
    title: "Rules decide the next move",
    body: "Confirm delivery, open a dispute, or let the review window expire.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-5 md:px-10 lg:px-[72px]">
        <a
          className="flex items-center gap-3 rounded-xl font-semibold tracking-[-0.04em]"
          href="#top"
          aria-label="monvault. home"
        >
          <Image
            src="/brand/monvault-mark.png"
            alt=""
            width={44}
            height={44}
            priority
            className="size-11 rounded-xl object-cover"
          />
          <span className="text-xl">monvault.</span>
        </a>
        <span className="rounded-full border border-line bg-surface px-3 py-2 font-mono text-[11px] font-medium tracking-[0.08em] text-[var(--ink-600)]">
          MONAD TESTNET
        </span>
      </header>

      <section
        id="top"
        className="mx-auto grid min-h-[calc(100vh-84px)] w-full max-w-[1440px] items-center gap-16 px-5 pb-24 pt-16 md:px-10 lg:grid-cols-[1.12fr_0.88fr] lg:px-[72px] lg:py-24"
      >
        <div>
          <p className="mb-6 font-mono text-xs font-semibold tracking-[0.1em] text-[var(--violet-700)]">
            DELIVERY-PROTECTED CHECKOUT
          </p>
          <h1 className="max-w-[900px] text-[clamp(3.4rem,7.3vw,7.8rem)] font-semibold leading-[0.9] tracking-[-0.065em]">
            Buy with confidence. Pay when delivery is confirmed.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--ink-600)] md:text-xl">
            monvault. locks test MON in a public escrow contract, giving buyers
            a review window and sellers visible proof of committed funds.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#how-it-works"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-violet px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              See how escrow works
            </a>
            <a
              href="https://github.com/aposalik/ProofCart"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--ink-950)] bg-transparent px-6 py-3 font-semibold transition-colors hover:bg-[var(--surface-muted)]"
            >
              View source
            </a>
          </div>
          <p className="mt-5 max-w-xl text-sm leading-6 text-[var(--ink-600)]">
            Testnet prototype. Physical delivery is confirmed by the buyer;
            the contract does not independently verify a package.
          </p>
        </div>

        <div
          className="relative mx-auto aspect-square w-full max-w-[560px]"
          role="img"
          aria-label="A dimensional escrow vault showing test MON held between buyer payment and seller release"
        >
          <div className="absolute inset-[8%] rotate-3 rounded-[32%] border border-[var(--lilac-300)] bg-[var(--lilac-150)] shadow-[0_40px_100px_rgba(52,30,120,0.18)]" />
          <div className="absolute inset-[17%] -rotate-6 rounded-[28%] border border-[var(--violet-500)] bg-[var(--violet-600)] shadow-[18px_24px_0_var(--night-950)]" />
          <div className="absolute inset-[31%] grid place-items-center rounded-full border-[12px] border-[var(--surface-raised)] bg-[var(--night-950)] text-center text-white shadow-[0_0_0_2px_var(--night-950)]">
            <div>
              <p className="font-mono text-[10px] tracking-[0.12em] text-[var(--lilac-300)] sm:text-xs">
                ESCROW STATE
              </p>
              <p className="mt-2 text-xl font-semibold tracking-[-0.04em] sm:text-3xl">
                FUNDS
                <br />
                SECURED
              </p>
            </div>
          </div>
          <span className="absolute left-0 top-[20%] rounded-full border border-line bg-surface px-3 py-2 font-mono text-[10px] tracking-[0.08em] shadow-lg sm:text-xs">
            BUYER PAID
          </span>
          <span className="absolute bottom-[15%] right-0 rounded-full border border-line bg-surface px-3 py-2 font-mono text-[10px] tracking-[0.08em] shadow-lg sm:text-xs">
            RELEASE BY RULE
          </span>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-y border-line bg-surface px-5 py-24 md:px-10 lg:px-[72px] lg:py-36"
      >
        <div className="mx-auto w-full max-w-[1296px]">
          <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs font-semibold tracking-[0.1em] text-[var(--violet-700)]">
                ONE ORDER / PUBLIC RULES
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
                A payment flow both sides can verify.
              </h2>
            </div>
            <p className="max-w-md text-base leading-7 text-[var(--ink-600)]">
              The interface explains each state in plain language, then links
              to the transaction evidence behind it.
            </p>
          </div>

          <ol className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-3">
            {flow.map((step) => (
              <li key={step.label} className="min-h-64 bg-surface p-8 md:p-10">
                <p className="font-mono text-xs font-semibold tracking-[0.1em] text-[var(--violet-700)]">
                  {step.label}
                </p>
                <h3 className="mt-12 text-2xl font-semibold tracking-[-0.035em]">
                  {step.title}
                </h3>
                <p className="mt-4 leading-7 text-[var(--ink-600)]">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
