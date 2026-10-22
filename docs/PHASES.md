# ProofCart Delivery Phases

## Working principle

Finish a small verified payment flow before visual polish or optional integrations. Every phase has an explicit acceptance check; do not call it done merely because a screen exists.

---

## Phase 0 — Product foundation ✅

**Goal:** Establish the exact hackathon MVP and technical boundaries.

**Done:**

- Product, architecture, contract, demo, and product-page specifications exist.
- Testnet, native test MON, MetaMask, demo tracking, one-seller orders, and a five-minute review window are accepted.
- `MEMORY.md`, `SOUL.md`, and `MISTAKES.md` exist for ongoing work.

**Exit check:** Every teammate can explain the buyer → escrow → shipment → confirmation/timeout/dispute flow in one minute.

---

## Phase 1 — Local project scaffold

**Goal:** Make the repository runnable before implementing features.

**Tasks:**

1. [x] Initialize `apps/web` as a Next.js + TypeScript app.
2. [x] Create the `contracts` Foundry directory/configuration structure.
3. [x] Add shared environment examples; never add real keys.
4. [x] Add lint, typecheck, build, and contract-test commands.
5. [x] Add a simple seeded product catalog and seller identity placeholder.
6. [x] Install Foundry and run the first red/green escrow test in the operator's normal terminal.

**Current verification:** Web lint, TypeScript, and production build pass. Foundry/Anvil 1.8.6 are installed. The first `createOrder` payment-lock behavior completed a user-verified red/green cycle. OpenClaw's isolated command environment still cannot access the cached compiler because its egress certificate remains invalid.

**Exit check:** Web app runs locally; `forge test`, typecheck, and production build run successfully.

---

## Phase 2 — Escrow contract and tests ✅

**Goal:** Build the smallest secure contract that enforces the money rules.

**Contract functions:**

- `createOrder(orderRef, seller)` payable
- `markShipped(orderId)` seller-only
- `confirmDelivery(orderId)` buyer-only
- `openDispute(orderId)` buyer-only
- `claimAfterTimeout(orderId)` seller-only after five minutes, if undisputed
- `getOrder(orderId)` read-only

**Required behavior:**

```text
PAID → SHIPPED → COMPLETED
                  ↑
Buyer confirms ───┘

SHIPPED → DISPUTED (freezes funds)
SHIPPED + 5 minutes + no dispute → seller timeout claim → COMPLETED
```

**Exit check:** All authorization, wrong-state, timeout, dispute, payout, and reentrancy tests pass locally.

**Verification:** 18 Foundry tests passed in the operator terminal. `forge fmt --check` passed in OpenClaw tool execution. The web lint, typecheck, and production build also remained green.

---

## Phase 3 — Testnet deployment and proof

**Goal:** Put the real contract on Monad testnet.

**Tasks:**

1. Create separate disposable buyer and seller MetaMask wallets.
2. Fund buyer with faucet test MON.
3. Configure approved Monad testnet RPC and chain details.
4. Deploy contract.
5. Verify source on the supported explorer, if available.
6. Save the public address in app configuration.

**Exit check:** A direct contract call creates a paid order, and its transaction is visible in an explorer.

---

## Phase 4 — Customer commerce flow

**Goal:** Build the buyer-side experience around real contract state.

**Pages:**

- `/` — portfolio homepage
- `/shop` and `/products/[slug]` — seeded demo catalog
- `/cart` — one demo order
- `/checkout` — wallet connection and escrow payment
- `/orders/[id]` — order status, tracking, timer, confirm/dispute actions

**Rules:**

- Checkout waits for the actual transaction receipt.
- Tracking page reads escrow status from the contract.
- The UI never reports payment success before chain confirmation.
- Delivery address and tracking reference remain private/off-chain.

**Exit check:** Buyer pays test MON through Checkout and then sees a real `PAID` order on Tracking.

---

## Phase 5 — Seller shipping flow

**Goal:** Connect professional seller operations to the same order.

**Tasks:**

1. Build `/seller/orders` for the seeded seller wallet.
2. Read seller orders from contract events/state.
3. Store a clearly-labelled demo tracking reference off-chain.
4. Call `markShipped(orderId)` from seller wallet.
5. Show the buyer's five-minute review countdown.

**Exit check:** The seller can ship only their paid order, and the buyer sees its `SHIPPED` status plus a working countdown.

---

## Phase 6 — Completion, timeout, and dispute paths

**Goal:** Prove every important final outcome.

**Scenarios:**

1. **Happy path:** buyer confirms delivery; seller receives test MON immediately.
2. **Timeout path:** buyer does nothing; after five minutes seller claims test MON.
3. **Dispute path:** buyer opens dispute before deadline; seller timeout claim reverts.

**Exit check:** All three flows are executed with two wallets, and each has an explorer transaction link or a clear reverted transaction result.

---

## Phase 7 — Portfolio presentation and demo hardening

**Goal:** Make the project understandable and reliable for a live audience.

**Tasks:**

1. Complete homepage copy: problem, solution, flow, architecture, security limits, team, links.
2. Add the architecture image and clear status language.
3. Rehearse the 60-second demo in `DEMO-RUNBOOK.md`.
4. Prepare a screen-recorded testnet fallback.
5. Review all UI claims for accuracy; clearly label testnet/demo tracking.

**Exit check:** A non-technical person understands why escrow matters; the team can demo the happy path without explanation from a developer console.

---

## Completion definition

ProofCart is hackathon-complete when:

- Buyer and seller use separate testnet wallets.
- Test MON is actually escrowed by the deployed Solidity contract.
- Seller cannot withdraw before confirmation or timeout.
- Buyer can confirm delivery or open a dispute.
- Seller can claim only after exactly the five-minute undisputed review period.
- Shop, Checkout, Tracking, and Seller pages all reflect the same order.
- Homepage explains the architecture and honest limitations.
- Explorer links prove the important transactions.
