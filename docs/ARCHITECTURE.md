# monvault. Architecture

## Design rule

Use the right system for each kind of data:

```text
Private commerce data → API/database
Public money rules    → Monad smart contract
User interactions     → Next.js web application
```

## Component diagram

```text
┌─────────────────────────────────────────────────────────────┐
│ Next.js web app                                              │
│ Home · Shop · Cart · Checkout · Track order · Seller panel   │
└───────────────┬────────────────────┬────────────────────────┘
                │                    │
        reads/writes private     signs transactions
                │                    │
                ▼                    ▼
┌─────────────────────────┐  ┌───────────────────────────────┐
│ Seed data now; API later │  │ MonVaultEscrow.sol on Monad   │
│                         │  │                               │
│ products                │  │ order ID / buyer / seller     │
│ cart/order metadata     │  │ exact escrowed MON amount     │
│ delivery address        │  │ PAID/SHIPPED/COMPLETED state  │
│ tracking reference      │  │ release / dispute rules       │
└─────────────────────────┘  └───────────────────────────────┘
                ▲                    ▲
                │                    │
              seller              buyer wallet
```

## Order flow

```text
1. Buyer adds product to cart
2. API creates an off-chain draft order
3. Buyer calls contract.createOrder(orderId, seller) with exact MON value
4. Contract emits OrderPaid(orderId, buyer, seller, amount)
5. API/web records the on-chain order ID and renders "Funds secured"
6. Seller updates demo shipment metadata through API and calls `markShipped(orderId)`.
7. The contract starts a five-minute buyer review window.
8. Buyer calls `confirmDelivery(orderId)` for an immediate payout, or `openDispute(orderId)` to freeze funds.
9. If the review window expires without a dispute, seller calls `claimAfterTimeout(orderId)`.
10. Contract sets state to `COMPLETED` then transfers escrow to seller.
11. UI displays receipt, countdown/dispute status, and explorer link
```

## What is intentionally not on-chain

| Data | Reason |
| --- | --- |
| Delivery address | Private personal data |
| Phone/email | Private personal data |
| Product image/details | Cheap and changeable application content |
| Carrier tracking details | May change and need no chain consensus |
| Seller dashboard preferences | Application-only state |

## Trust model

- The buyer trusts the contract to hold and release funds according to its code.
- The seller is protected by a five-minute review timeout: an undisputed shipped order can be claimed after the deadline.
- The buyer is protected because buyer confirmation pays immediately, while an open dispute blocks timeout payout.
- The backend cannot steal escrow because it has no authority over contract funds.
- The MVP has no real arbitrator; disputed funds remain frozen.

## Recommended stack

| Layer | Choice | Why |
| --- | --- | --- |
| Web | Next.js + TypeScript | Routing, homepage, shop, dashboards in one app |
| Wallet/chain | viem + wagmi | Type-safe EVM calls and wallet hooks |
| Contract | Solidity + Foundry | Small, testable escrow contract |
| API | Next.js route handlers initially | Fastest one-repo hackathon option |
| Database | Supabase Postgres or local seeded JSON | Private metadata; use Supabase only if it helps the team |
| Styling | Tailwind CSS + documented design system | Tokens and behavior are defined in [`DESIGN.md`](../DESIGN.md). |

## Security boundaries

- Never trust a frontend-supplied order status.
- Check caller role and current order state in every contract transition.
- Use checks-effects-interactions before native MON transfers.
- Include a reentrancy guard around payout functions.
- Emit events for every state change.
- Avoid an admin withdrawal function.
