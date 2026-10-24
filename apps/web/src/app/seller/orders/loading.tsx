import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";

export default function SellerOrdersLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-950">
      <SiteHeader />
      <main
        aria-busy="true"
        aria-label="Loading seller escrow operations"
        className="flex-1 px-5 py-10 md:px-10 md:py-14 lg:px-[72px] lg:py-16"
      >
        <div className="mx-auto w-full max-w-[1296px] space-y-8">
          <div className="h-28 w-full rounded-[24px] bg-muted" />
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="space-y-4">
              <div className="h-44 rounded-[22px] bg-muted" />
              <div className="h-44 rounded-[22px] bg-muted" />
            </div>
            <div className="h-[540px] rounded-[24px] bg-muted" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
