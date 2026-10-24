import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";

export default function CartLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-950">
      <SiteHeader />
      <main
        aria-busy="true"
        aria-label="Loading escrow cart"
        className="flex-1 px-5 py-12 md:px-10 md:py-16 lg:px-[72px] lg:py-20"
      >
        <div className="mx-auto grid w-full max-w-[1296px] gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="h-[360px] rounded-[24px] bg-muted" />
          <div className="h-[420px] rounded-[24px] bg-muted" />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
