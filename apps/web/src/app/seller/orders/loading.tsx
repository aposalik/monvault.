export default function SellerOrdersLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading merchant escrow orders"
      className="mx-auto w-full max-w-[1296px] space-y-8"
    >
      <div className="h-28 w-full rounded-[24px] bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="h-28 rounded-[22px] bg-muted" />
        <div className="h-28 rounded-[22px] bg-muted" />
        <div className="h-28 rounded-[22px] bg-muted" />
        <div className="h-28 rounded-[22px] bg-muted" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="space-y-4">
          <div className="h-44 rounded-[22px] bg-muted" />
          <div className="h-44 rounded-[22px] bg-muted" />
        </div>
        <div className="h-[540px] rounded-[24px] bg-muted" />
      </div>
    </div>
  );
}
