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

## Last updated

2026-10-23 — Root README refreshed with the approved lockup, accurate architecture, status, setup, and demo guidance; ready for PR/merge and Phase 3 testnet deployment (S2).
