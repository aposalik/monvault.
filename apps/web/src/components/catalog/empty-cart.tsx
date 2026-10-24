import { ButtonLink } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";

export function EmptyCart() {
  return (
    <Surface
      tone="raised"
      radius="card"
      className="mx-auto max-w-2xl border border-line p-8 text-center md:p-14"
    >
      <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-line bg-muted text-violet-700">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-8 fill-none stroke-current stroke-[1.75]"
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
      </div>

      <h2 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-ink-950 md:text-3xl">
        Your cart is currently empty
      </h2>
      <p className="mx-auto mt-3 max-w-md text-base leading-7 text-ink-600">
        Browse the marketplace and add hardware, audio gear, keyboards, or
        security devices protected by Monad smart contract escrow.
      </p>

      <div className="mt-8 flex justify-center">
        <ButtonLink href="/shop" variant="primary" size="lg">
          Explore products in the Shop →
        </ButtonLink>
      </div>
    </Surface>
  );
}
