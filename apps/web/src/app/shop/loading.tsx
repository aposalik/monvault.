import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";

export default function ShopLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-950">
      <SiteHeader />
      <main
        aria-busy="true"
        aria-label="Loading testnet shop catalog"
        className="flex-1 px-5 py-12 md:px-10 md:py-16 lg:px-[72px] lg:py-20"
      >
        <div className="mx-auto w-full max-w-[1296px]">
          <div className="h-6 w-44 rounded-full bg-muted" />
          <div className="mt-4 h-12 w-full max-w-lg rounded-2xl bg-muted" />
          <div className="mt-3 h-6 w-full max-w-2xl rounded-xl bg-muted" />

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((slot) => (
              <div
                key={slot}
                className="h-[440px] rounded-[24px] border border-line bg-surface p-6"
              >
                <div className="aspect-[4/3] w-full rounded-[16px] bg-muted" />
                <div className="mt-5 h-6 w-2/3 rounded-lg bg-muted" />
                <div className="mt-3 h-4 w-full rounded-lg bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
