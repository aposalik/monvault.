import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";

export default function OrderTrackingLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-950">
      <SiteHeader />
      <main
        aria-busy="true"
        aria-label="Loading order escrow status"
        className="flex-1 px-5 py-10 md:px-10 md:py-14 lg:px-[72px] lg:py-16"
      >
        <div className="mx-auto w-full max-w-[1296px] space-y-8">
          <div className="h-44 w-full rounded-[24px] bg-muted" />
          <div className="h-56 w-full rounded-[24px] bg-muted" />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="h-96 rounded-[24px] bg-muted" />
            <div className="h-96 rounded-[24px] bg-muted" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
