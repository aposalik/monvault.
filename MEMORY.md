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
- Product catalog and shipping metadata are managed via a **PostgreSQL** database (Supabase / Postgres).
- Customer store is a clean, authentic e-commerce marketplace (Trendyol-style) with category filters, search, and prices in native **MON**.
- Cart operates reactively with live badge counter and starts empty before adding items.
- Dedicated customer order tracking route at `/track`.
- Header is strictly minimal: Home, Shop, Track, and a Cart icon. Premature text tabs (Cart, Checkout, Seller View) are excluded.
- Seller View is decoupled into an independent merchant portal (`/seller`) connected to the same PostgreSQL database.
- No "demo" gimmick widgets, fake timers, or runbook bars.
- Smart contract manages immutable escrow rules (`PAID → SHIPPED → COMPLETED` or `DISPUTED`).

## Open decisions

- PostgreSQL hosting (Supabase cloud instance or local/containerized Postgres).
- Confirm the organizer's currently recommended testnet faucet/RPC at the event.

## Current implementation state

- Phase 2 escrow contract is implemented with create, ship, confirm, dispute, and five-minute timeout-claim transitions.
- The contract uses unique hashed order references, explicit buyer/seller authorization, checks-effects-interactions, and a reentrancy guard for payouts.
- 18 Foundry tests passed; smart contract clean.
- Phase 3 Monad Testnet deployment verified (`0xc48545Be217840A472C6d5BA1282A15BDaA54767`) with recorded 1 MON paid order transaction.
- Fahad completed PR #9 (`fahad/web-commerce-flow`) implementing work packages F1–F6 (shop, product detail, cart, checkout presentation, buyer tracking, seller orders, and demo polish).
- Merged into integration branch `integrate/phase-4-buyer-flow` to wire up the real on-chain buyer flow for Phase 4 completion.
- Issue roadmap updated: GitHub issues #10–#16 created and assigned to `@MFahadFaisal` for clean navigation, PostgreSQL store, reactive cart, dedicated `/track`, and dedicated `/seller` dashboard.

## Last updated

2026-10-24 — Merged Fahad's commerce implementation into `integrate/phase-4-buyer-flow`. Wiring real testnet contract calls to complete Phase 4 buyer flow verification. Issue #16 assigned to Fahad for the dedicated seller dashboard.
