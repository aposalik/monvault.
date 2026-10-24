# monvault. Working Memory

This file is the concise, durable project memory. Update it after a meaningful decision, completed milestone, blocker, or change in scope.

## Current product definition

monvault. is a Monad-powered ecommerce escrow application. Buyers lock test MON in a smart contract during checkout. Sellers receive payment only when the buyer confirms delivery. A dispute locks funds; the MVP does not automate dispute resolution.

## Engineering collaboration preference

Salik wants to understand and review every meaningful change. Work in small slices and explain the component flow, design reasoning, tradeoffs, changed files, tests, and evidence. AI should support engineering judgment, never replace it with opaque "vibe coding."

## Non-negotiable boundaries

- Monad contract owns escrow funds and state transitions.
- Off-chain services own product catalog, shipping reference, and private delivery information.
- Never store addresses, names, phones, raw tracking data, or secrets on-chain.
- Do not fake a completed payment or shipment in the UI; label seeded/demo data clearly.
- This is testnet-only unless the team explicitly changes that decision.

## MVP pages

1. Home / portfolio
2. Shop
3. Checkout
4. Order tracking
5. Seller dashboard

## Accepted MVP decisions

- Use **Monad testnet** with native **test MON** from a faucet.
- Buyer and seller use separate disposable **MetaMask** wallets.
- Shipping uses a clearly-labelled **demo tracking reference** stored privately off-chain; no carrier API is required.
- Each escrow order contains one product and one seller.
- A seller marks an order shipped, starting a **5-minute buyer review window**.
- Buyer may confirm delivery for an immediate payout, or open a dispute to freeze funds.
- If the five-minute window ends without a dispute, the seller may claim the escrow with `claimAfterTimeout`.
- Disputes have no automatic/admin resolution in the MVP; funds remain frozen.

## MVP contract states

`PAID → SHIPPED → COMPLETED`

Alternative path: `SHIPPED → DISPUTED`. A `SHIPPED` order with an expired review window can also be completed by the seller's timeout claim.

## Team ownership

- **Abdullah Salik:** smart contract, wallet/chain integration, testnet deployment, and technical demo.
- **Fahad Faisal:** homepage and commerce pages, seeded product/off-chain tracking flow, responsive presentation.
- Shared: three-path end-to-end verification and final demo rehearsal.

## Open decisions

- Will off-chain shipping/order metadata use seeded JSON or Supabase Postgres?
- Confirm the organizer's currently recommended testnet faucet/RPC at the event.

## Current implementation state

- Phase 2 escrow contract is implemented with create, ship, confirm, dispute, and five-minute timeout-claim transitions.
- The contract uses unique hashed order references, explicit buyer/seller authorization, checks-effects-interactions, and a reentrancy guard for payouts.
- 18 Foundry tests passed in the operator terminal; OpenClaw independently verified Solidity formatting and kept web lint/typecheck/build green.
- Next.js 16 + TypeScript web workspace is scaffolded and passes lint, typecheck, and production build.
- Root npm workspace, lockfile, public environment template, and seeded demo product exist.
- Foundational rebrand and design system pushed to `origin/chore/monvault-rebrand-design`.
- GitHub CLI authenticated; Fahad's F1–F6 issues created and assigned to `@MFahadFaisal`.
- Root README was refreshed as the professional project entry point, using the approved monvault. lockup and documenting the actual implementation status and trust boundaries.
- Work package F1 (Design system primitives, original dimensional escrow vault scene, interactive contract state inspector, architecture visual, and full 9-section portfolio homepage) is implemented and passes lint, typecheck, and production build.
- Work package F2 (Shop, Product detail, and Cart experience with 3 seeded products, SVG media, one-seller boundary, test MON labels, loading/empty/not-found states) is implemented and passes lint, typecheck, and static production build.
- Work package F3 (Checkout presentation layer at `/checkout` with public-vs-private data boundary, pre-signature wallet confirmation panel, duplicate-click lock, transaction proof with explorer link, and all 8 wallet/receipt states) is implemented and verified.
- Work package F4 (Buyer order tracking experience at `/orders/[id]` with normalized `presentation.ts` status/timeline/countdown helpers, 5-step escrow timeline, zero-layout-shift 5-minute countdown, first-class Confirm Delivery and Open Dispute confirmation panels, transaction proof ledger, and all 9 contract/wallet states) is implemented and verified.
- Work package F5 (Seller orders and demo shipment UX at `/seller/orders` with off-chain demo tracking storage synced to buyer tracking, seller wallet authorization gates, `markShipped` and `claimAfterTimeout` flows, strict payout eligibility gating, and all 8 operational states) is implemented and verified.
- Work package F6 (Cross-route responsive 320px/200%-zoom QA, keyboard skip-link + focus-visible + 44×44px target QA, `prefers-reduced-motion` and `prefers-contrast: more` rules, Inter font preloading, global 404 route) is implemented and verified.
- Post-F6 Marketplace Refinements (Steps 1–4):
  1. Cleaned header navigation (`Home`, `Shop`, `Track`, and reactive `Cart` icon badge) and simplified homepage value proposition without artificial demo bars or 3D toy widgets.
  2. Added PostgreSQL schema & seed migrations (`services/api/migrations/001_create_products.sql`, `001_seed_products.sql`) and dynamic catalog repository (`apps/web/src/lib/db/products-repository.ts`) serving 8 products across 5 categories with Trendyol-style `/shop` filtering, search, sorting, and native `MON` pricing.
  3. Upgraded shopping cart (`apps/web/src/data/cart-store.ts`, `/cart`) to reactive multi-item state starting empty initially with live badge counts, quantity `+`/`−` controls, item removal, and accurate `MON` subtotals.
  4. Added dedicated `/track` order lookup and tracking route (`services/api/migrations/002_create_orders.sql`, `apps/web/src/lib/db/orders-repository.ts`, `/api/orders`, `apps/web/src/app/track/page.tsx`) with Order ID / `0x` reference / tracking lookup, connected wallet filtering, 4-stage escrow timeline (`Paid into Escrow` → `Shipped` → `Delivered / Review Period` → `Completed / Disputed`), and buyer Confirm Delivery / Open Dispute actions with zero demo controls.
  5. Built the Independent Seller Portal (`/seller` and `/seller/orders`) with an isolated merchant layout (`apps/web/src/app/seller/layout.tsx`, `apps/web/src/components/seller/seller-portal-shell.tsx`) completely decoupled from the customer header/footer, connected to the shared PostgreSQL `orders` and `products` repositories (`PATCH /api/orders`), supporting carrier & tracking fulfillment, `markShipped(orderId)`, `claimAfterTimeout(orderId)`, catalog inventory view, and strict seller wallet authorization gates.
  6. Completed full production UI/UX polish across all routes: removed the Checkout UI State Inspector bar (`checkout-experience.tsx`), connected multi-item cart checkout to create real PostgreSQL orders (`POST /api/orders`), removed all `"DEMO / OFF-CHAIN"` and `"Simulated"` watermarks across checkout, tracking, seller, and 404 pages, and verified responsive 320px+ and desktop layouts against `DESIGN.md`.

## Last updated

2026-10-24 — Completed Marketplace Refinements Steps 1–6 (Clean Header & Homepage, PostgreSQL Dynamic Storefront, Reactive Multi-Item Cart, Dedicated `/track` Order Tracking Page, Independent `/seller` Merchant Portal, and Production UI Polish without Demo Gimmicks).
