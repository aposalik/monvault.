import { ButtonLink } from "@/components/ui/button";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { StatusChip } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-950">
      <SiteHeader />
      <main className="flex-1 grid place-items-center px-5 py-16 md:px-10">
        <Surface
          tone="raised"
          radius="card"
          className="w-full max-w-xl p-8 text-center md:p-12"
        >
          <div className="flex justify-center">
            <StatusChip label="ITEM NOT IN SEEDED CATALOG" tone="warning" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-ink-950">
            Demo product not found.
          </h1>
          <p className="mt-3 text-base leading-7 text-ink-600">
            This product slug does not exist in the seeded monvault. catalog.
            Choose one of the verified demo items to test the escrow flow.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/shop" variant="primary" size="lg">
              Return to testnet shop
            </ButtonLink>
          </div>
        </Surface>
      </main>
      <SiteFooter />
    </div>
  );
}
