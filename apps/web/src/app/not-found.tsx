import { ButtonLink } from "@/components/ui/button";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { StatusChip } from "@/components/ui/status-chip";
import { Surface } from "@/components/ui/surface";

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-950">
      <SiteHeader />
      <main
        id="main-content"
        className="flex-1 grid place-items-center px-5 py-16 md:px-10"
      >
        <Surface
          tone="raised"
          radius="card"
          className="w-full max-w-xl p-8 text-center md:p-12"
        >
          <div className="flex justify-center">
            <StatusChip label="404 · PAGE NOT FOUND" tone="warning" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-ink-950 md:text-4xl">
            We couldn’t find that page.
          </h1>
          <p className="mt-3 text-base leading-7 text-ink-600">
            Explore the marketplace catalog or look up an active escrow order on
            the tracking page.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/shop" variant="primary" size="lg">
              Explore Shop
            </ButtonLink>
            <ButtonLink href="/track" variant="secondary" size="lg">
              Track an Order
            </ButtonLink>
          </div>
        </Surface>
      </main>
      <SiteFooter />
    </div>
  );
}
