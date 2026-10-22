# ProofCart Working Memory

This file is the concise, durable project memory. Update it after a meaningful decision, completed milestone, blocker, or change in scope.

## Current product definition

ProofCart is a Monad-powered ecommerce escrow application. Buyers lock test MON in a smart contract during checkout. Sellers receive payment only when the buyer confirms delivery. A dispute locks funds; the MVP does not automate dispute resolution.

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
- Confirm Fahad's GitHub username and add him with Write access.
- Confirm the organizer's currently recommended testnet faucet/RPC at the event.

## Current implementation state

- Next.js 16 + TypeScript web workspace is scaffolded and passes lint, typecheck, and production build.
- Root npm workspace, lockfile, public environment template, and seeded demo product exist.
- Foundry/Anvil 1.8.6 are installed under `~/.foundry/bin`; the initial payment-lock test completed a user-verified red/green cycle in the operator's normal terminal.
- OpenClaw's isolated command environment still cannot download or see solc 0.8.28 because its egress trust certificate remains invalid, so forge verification inside tool execution is still blocked.
- GitHub remote is configured and the foundation is committed locally; remote push is blocked by the same TLS issue plus stale machine-level GitHub CLI credentials.

## Last updated

2026-10-22 — Phase 1 scaffold complete; Phase 2 began with the first test-first escrow payment behavior.
