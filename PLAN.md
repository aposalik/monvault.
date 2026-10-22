# ProofCart Implementation Plan

## Product decision

ProofCart is **not an Amazon clone**. It is a focused ecommerce escrow demo that proves one user journey:

> A buyer pays → Monad locks funds → seller ships → buyer confirms → seller receives payment.

A polished, truthful demo beats a large incomplete marketplace.

## User-facing pages

### 1. Home / portfolio page
Explains the project from start to finish:

- Problem: online buyers pay before they know delivery succeeded.
- Solution: Monad escrow keeps payment locked under public rules.
- How it works: five-step visual flow.
- Architecture and security boundaries.
- Demo transaction / contract links once deployed.
- Team, repository, and roadmap.

### 2. Shop page
A small catalog of seeded demo products. Buyer can:

- view a product;
- add it to the cart;
- proceed to checkout.

### 3. Checkout page
Buyer sees price, seller, order summary, and escrow explanation. On confirmation:

- the app creates an order record with private delivery details off-chain;
- the buyer sends the exact test-MON value to `createOrder`;
- the UI waits for confirmation and routes to order tracking.

### 4. Order tracking page
Buyer sees the true combined status:

- `Awaiting payment`
- `Funds secured in escrow`
- `Shipped` + tracking reference
- `Delivered — confirm receipt`
- `Completed — seller paid`
- `Disputed`

### 5. Seller dashboard
A demo professional/shop view. Seller can:

- see orders paid into escrow;
- mark an order shipped;
- add a demo tracking number;
- see released funds after buyer confirmation.

## Contract state machine

```text
Buyer deposits exact MON → PAID
       └─ seller marks shipped → SHIPPED + 5-minute review window
            ├─ buyer confirms delivery → COMPLETED (pay seller immediately)
            ├─ buyer opens dispute → DISPUTED (funds stay locked)
            └─ review window expires without dispute
                 → seller calls claimAfterTimeout() → COMPLETED

DISPUTED → no automatic/admin payout in MVP
```

## Delivery phases

The detailed phase plan and completion criteria live in [`docs/PHASES.md`](docs/PHASES.md). Work contract-first, then integrate the real buyer/seller flow, then polish the presentation.

## Suggested team split

| Person | Main ownership | Backup |
| --- | --- | --- |
| Salik | Contract integration, architecture, technical demo | Seller flow |
| Teammate | Frontend UX, page flow, visual story | Product seed data |

If there are more teammates: one owns Solidity/tests, one owns frontend, one owns backend/data/demo materials.

## Definition of done for the hackathon

- A user can complete the buyer flow with a testnet wallet.
- A seller can mark that exact paid order as shipped, starting the five-minute buyer review window.
- Only that order's buyer can confirm delivery and release funds immediately.
- A seller can claim only after the review window expires and only if no dispute exists.
- A release or timeout-claim payment visibly transfers test MON to the seller.
- The tracking page links to real Monad explorer transactions.
- The homepage explains what Monad enforces and what it cannot verify.
