import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-950">
      <SiteHeader />
      <main
        aria-busy="true"
        aria-label="Loading product details"
        className="flex-1 px-5 py-10 md:px-10 md:py-14 lg:px-[72px] lg:py-20"
      >
        <div className="mx-auto grid w-full max-w-[1296px] gap-8 lg:grid-cols-2">
          <div className="aspect-[4/3] w-full rounded-[24px] bg-muted" />
          <div className="h-[480px] w-full rounded-[24px] bg-muted" />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
