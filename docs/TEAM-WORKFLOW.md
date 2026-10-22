# Salik and Fahad Collaboration Plan

**Project:** monvault.

**Status:** ownership draft for Salik’s review

**Issue policy:** do not create or assign GitHub issues until Salik approves this document.

The split follows one rule: Salik owns anything that can move funds or misrepresent chain state; Fahad owns the customer-facing product experience and off-chain demo presentation. Shared integration points are typed so both people can work without editing the same files.

---

## 1. Ownership summary

| Owner | Primary responsibility | Final review authority |
| --- | --- | --- |
| **Salik** | Solidity, testnet deployment, wallet/chain integration, contract-derived state, transaction correctness | payment, wallet, contract, chain status, explorer proof |
| **Fahad** | design implementation, commerce page flows, product data, demo shipment UX, responsive/accessibility polish | page flow, visual consistency, copy, responsive behavior |
| **Both** | end-to-end demo, architecture explanation, final release QA | any change affecting the live demo path |

Neither person should silently change the other’s public interface. Update the shared types first, then implementation.

---

## 2. Salik’s work packages

### S1 — Contract completion and ABI handoff

**Goal:** provide a stable, tested escrow API for web integration.

**Scope**

- Maintain `contracts/src/MonVaultEscrow.sol`.
- Maintain authorization, state-transition, payout, dispute, timeout, and reentrancy tests.
- Export the final typed ABI after the contract interface freezes.
- Document `Status` values and each write function’s allowed caller/state.

**Deliverables**

- passing Foundry suite;
- formatted contract source;
- typed ABI committed under the chain integration path;
- short interface note for Fahad: input, pending, success, failure, and wrong-wallet states.

**Done when:** no UI code needs to import generated Foundry artifacts directly or interpret raw enum numbers.

### S2 — Monad testnet deployment

**Goal:** make the contract verifiably available on the approved Monad testnet.

**Scope**

- Configure chain ID, RPC, explorer base URL, and native test MON metadata.
- Deploy from a disposable deployment wallet.
- Verify source on the explorer where supported.
- Save only public configuration; never commit private keys or seed phrases.
- Record contract and representative transaction links.

**Deliverables**

- deployed contract address;
- network configuration;
- explorer contract link;
- one proven `createOrder` transaction.

**Done when:** a clean checkout can read the deployed contract and the explorer shows the funded order transaction.

### S3 — Wallet and chain foundation

**Goal:** expose safe, typed wallet behavior to the UI.

**Scope**

- Configure wallet connection and Monad testnet switching.
- Add viem/wagmi clients only when integration starts.
- Normalize account, chain, pending, rejected, reverted, and confirmed states.
- Build transaction receipt waiting; never report success from a submitted hash alone.

**Primary paths**

```text
apps/web/src/lib/chain/**
apps/web/src/hooks/contracts/**
apps/web/src/types/chain/**
```

**Done when:** UI components can consume stable state without importing wallet-library internals.

### S4 — Contract actions and reads

**Goal:** connect every money-sensitive action to confirmed contract state.

**Scope**

- `createOrder(orderRef, seller)`
- `markShipped(orderId)`
- `confirmDelivery(orderId)`
- `openDispute(orderId)`
- `claimAfterTimeout(orderId)`
- `getOrder(orderId)` and event/state reads
- normalized countdown deadline and role-based action permissions

**Deliverables**

- hooks/actions with typed inputs and errors;
- explorer URL helper;
- normalized order status model;
- receipt-backed invalidation/refetch after writes.

**Done when:** each action either shows a confirmed state or a precise recoverable failure, and no component guesses a contract status.

### S5 — Three-path verification and technical demo

**Goal:** prove all terminal paths using separate buyer and seller wallets.

**Scope**

1. buyer confirms and seller receives test MON;
2. review window expires and seller claims;
3. buyer disputes and seller timeout claim fails.

**Deliverables**

- explorer links or a clear reverted result for each path;
- updated technical notes and demo runbook;
- review of every user-facing security/payment claim.

**Done when:** the live demo can be reproduced from a clean browser session without a developer console.

---

## 3. Fahad’s work packages — proposed for Salik approval

### F1 — Design system implementation and homepage

**Goal:** turn `DESIGN.md` into reusable visual primitives and a clear product story.

**Scope**

- Implement Inter and Roboto Mono roles, color tokens, spacing, focus states, and reduced-motion behavior.
- Build header, buttons, surfaces, status chips, section shell, and footer.
- Build homepage sections: hero, problem, five-step flow, architecture, outcomes, limitations, team, and CTAs.
- Create the original monvault. dimensional escrow visual without copying Monad’s layout or objects.
- Use supplied monvault. assets according to the brand rules.

**Primary paths**

```text
DESIGN.md                         # propose changes; do not silently diverge
apps/web/src/app/page.tsx
apps/web/src/app/globals.css
apps/web/src/components/ui/**
apps/web/src/components/marketing/**
apps/web/public/brand/**
apps/web/public/visuals/**
```

**Inputs from Salik:** approved product claims, architecture boundaries, final contract/explorer links when available.

**Acceptance checks**

- no copied Monad logo, composition, or page section;
- no new CSS gradient treatments;
- desktop/mobile layouts match `DESIGN.md`;
- keyboard focus and reduced motion work;
- security copy does not overclaim.

### F2 — Shop, product, and cart experience

**Goal:** build the buyer’s commerce flow before wallet execution.

**Scope**

- `/shop`
- `/products/[slug]`
- `/cart`
- reusable product card, seller identity, amount, empty cart, and one-seller boundary components
- seeded catalog data and product media
- loading, empty, and not-found states

**Primary paths**

```text
apps/web/src/app/shop/**
apps/web/src/app/products/**
apps/web/src/app/cart/**
apps/web/src/components/catalog/**
apps/web/src/data/**
```

**Inputs from Salik:** amount format and seller wallet public address shape.

**Acceptance checks**

- cart cannot imply unsupported multi-seller checkout;
- all prices are clearly labelled test MON;
- product pages explain escrow briefly without legal/security overclaiming;
- pages work at 320 px and with keyboard only.

### F3 — Checkout presentation layer

**Goal:** make the wallet action understandable while leaving transaction logic to Salik.

**Scope**

- `/checkout` layout and form states;
- public-vs-private information explanation;
- order summary, seller, network, amount, and escrow rules;
- connect/wrong-network/pending/rejected/reverted/confirmed UI states;
- disabled and retry behavior;
- transaction proof component presentation.

**Primary paths**

```text
apps/web/src/app/checkout/**
apps/web/src/components/checkout/**
```

**Boundary:** Fahad calls Salik’s typed `createOrder` action. Fahad does not construct transactions, map raw reverts, or report success before the receipt state says confirmed.

**Acceptance checks**

- signature purpose is visible before the wallet opens;
- repeated clicks cannot create accidental duplicate submissions in the UI;
- private address fields are never rendered as on-chain data;
- confirmed state includes an explorer link.

### F4 — Buyer order tracking experience

**Goal:** make contract state and next action obvious to the buyer.

**Scope**

- `/orders/[id]`;
- order timeline;
- five-minute countdown presentation;
- transaction proof/explorer links;
- confirm-delivery and dispute confirmation panels;
- paid, shipped, completed, disputed, pending, missing, and wrong-wallet states.

**Primary paths**

```text
apps/web/src/app/orders/**
apps/web/src/components/orders/**
apps/web/src/lib/orders/presentation.ts
```

**Boundary:** the countdown is display logic only. Permission and deadline enforcement come from Salik’s contract state/action layer.

**Acceptance checks**

- no optimistic success before chain confirmation;
- dispute remains a first-class visible action during the valid window;
- timeout language names the seller’s right to claim;
- timer has accessible non-color text and no layout shift.

### F5 — Seller orders and demo shipment UX

**Goal:** let the seeded seller operate the same on-chain order.

**Scope**

- `/seller/orders`;
- seller order list/detail presentation;
- demo tracking-reference entry and clearly labelled off-chain storage;
- mark-shipped pending/confirmed UI;
- review deadline and payout-state presentation;
- empty, wrong-wallet, failed, and completed states.

**Primary paths**

```text
apps/web/src/app/seller/**
apps/web/src/components/seller/**
apps/web/src/lib/orders/**            # off-chain demo data only
```

**Boundary:** Fahad owns tracking-reference storage and display. Salik owns the `markShipped` and `claimAfterTimeout` chain actions.

**Acceptance checks**

- only the connected seller experience exposes seller actions;
- tracking is labelled **demo/off-chain**;
- UI never implies that shipping data proves physical delivery;
- seller cannot see an immediate payout action before contract eligibility.

### F6 — Responsive, accessibility, and demo polish

**Goal:** make all implemented routes presentation-ready without changing escrow rules.

**Scope**

- cross-route responsive QA;
- keyboard and visible-focus QA;
- reduced-motion behavior;
- copy consistency and empty/error states;
- image sizing and route-level performance;
- homepage/demo presentation polish;
- screen-recording readiness.

**Acceptance checks**

- `DESIGN.md` checklist passes on every route;
- no mobile horizontal overflow for core content;
- Web Vitals remain within the documented budget where measurable;
- no design change masks network, transaction, or dispute state.

---

## 4. Shared interface contract

Salik exposes product-facing models; Fahad consumes them.

```ts
type OrderStatus = "paid" | "shipped" | "completed" | "disputed";

type OrderActionState =
  | { phase: "idle" }
  | { phase: "awaiting-signature" }
  | { phase: "confirming"; txHash: `0x${string}` }
  | { phase: "confirmed"; txHash: `0x${string}` }
  | { phase: "failed"; message: string; txHash?: `0x${string}` };

type OrderActions = {
  onMarkShipped?: () => Promise<void>;
  onConfirmDelivery?: () => Promise<void>;
  onOpenDispute?: () => Promise<void>;
  onClaimAfterTimeout?: () => Promise<void>;
};
```

The exact implementation may evolve, but these guarantees remain:

- UI receives normalized status rather than raw enum numbers.
- Write state distinguishes awaiting signature, submitted/confirming, confirmed, and failed.
- Explorer URLs come from the chain layer.
- Private delivery/tracking data never enters contract arguments.
- Components receive caller permissions; they do not infer authorization from visual state alone.

---

## 5. Phase ownership matrix

| Delivery phase | Salik | Fahad | Review gate |
| --- | --- | --- | --- |
| Phase 0 — foundation | architecture/security rules | product-flow review | complete |
| Phase 1 — scaffold | contract/web toolchain | seeded catalog/content review | complete |
| Phase 2 — escrow contract | **owner** | UI-state review only | complete |
| Phase 3 — testnet | **owner** | explorer-proof presentation | Salik verifies deployment |
| Phase 4 — buyer flow | chain/actions | **page and component owner** | both test one paid order |
| Phase 5 — seller flow | chain/actions | **page and demo-tracking owner** | both test shipping/countdown |
| Phase 6 — outcomes | **chain verification owner** | outcome/error presentation | both verify three paths |
| Phase 7 — presentation | technical truth/runbook | **visual/accessibility owner** | both approve demo freeze |

---

## 6. Pull request and branch rules

Suggested branches after Salik approves the phase split:

```text
salik/<work-package>-short-name
fahad/<work-package>-short-name
```

Examples:

```text
salik/s2-testnet-deploy
fahad/f1-design-homepage
```

Review rules:

- Salik reviews any payment, wallet, contract, chain-status, or explorer change.
- Fahad reviews any page-flow, visual-system, copy, responsive, or accessibility change.
- Both approve changes touching checkout → order → seller → completion.
- Keep one work package per pull request where practical.
- Rebase/update from `main` before handoff; do not mix unrelated cleanup.
- PR evidence includes routes/files changed, screenshots for desktop/mobile, and commands run.

### Path conflict rule

`globals.css`, shared order types, and layout/navigation are shared hot spots. Announce changes before editing them and avoid parallel PRs that both redesign the same interface.

---

## 7. Handoff order

1. **Salik:** freeze contract interface and publish typed ABI/status model.
2. **Fahad:** implement F1 and F2 using fixtures that match the shared model.
3. **Salik:** complete S2–S4 and expose actions/read hooks.
4. **Fahad:** connect F3–F5 presentation to those interfaces without importing wallet internals.
5. **Both:** run the three-path verification and fix only demo blockers.
6. **Fahad:** complete F6 polish; **Salik:** final technical-claim review.
7. **Both:** freeze demo and rehearse the runbook.

Fixtures should be replaceable at the hook/provider boundary so UI work does not block on deployment.

---

## 8. GitHub issue plan — not yet created

After Salik approves this document, create one issue per work package:

- Salik: S1–S5
- Fahad: F1–F6

Each issue should copy the relevant goal, scope, boundaries, deliverables, and acceptance checks from this file. Do not create umbrella issues that hide payment-critical acceptance criteria.

Fahad already has collaborator access according to Salik. Keep normal **Write** access, not Admin, and protect `main` with pull-request review where the repository settings allow it.
