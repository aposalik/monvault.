import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { Surface } from "@/components/ui/surface";

export default function TrackOrderLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-950">
      <SiteHeader />
      <main
        id="main-content"
        className="flex-1 px-5 py-10 md:px-10 md:py-14 lg:px-[72px] lg:py-16"
      >
        <div className="mx-auto w-full max-w-[1296px] space-y-6">
          <div className="h-12 w-72 rounded-2xl bg-muted" />
          <Surface tone="raised" radius="card" className="h-44 p-6">
            <div className="h-full w-full rounded-xl bg-muted/60" />
          </Surface>
          <Surface tone="raised" radius="card" className="h-64 p-6">
            <div className="h-full w-full rounded-xl bg-muted/60" />
          </Surface>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
