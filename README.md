# ProofCart

> A shopping checkout where payment is held in Monad escrow until the buyer confirms delivery.

## The product

ProofCart is a hackathon prototype for safer online shopping. A buyer pays with test MON, but the seller cannot access the payment immediately. The **ProofCart smart contract** holds it in escrow until delivery is confirmed.

```text
Shop → Checkout → MON escrow → Seller ships → Buyer confirms → Seller is paid
```

If there is a problem, the buyer can open a dispute. The funds remain locked rather than being automatically sent to either party.

## The problem

In a normal marketplace, a buyer must trust the seller/platform after paying. If a physical product does not arrive, refunds are slow and depend on a central platform.

ProofCart makes the payment rule transparent:

- Buyer funds are held by a contract, not the frontend or API.
- Seller is paid only after buyer confirmation.
- Both sides can inspect the order state and transaction history.
- A physical delivery still needs a human confirmation or dispute process; blockchain cannot prove that a package arrived.

## Hackathon MVP

Build one complete demo flow:

1. Buyer selects one demo product in the shop.
2. Buyer checks out and deposits test MON into the contract.
3. Seller marks the order as shipped and adds a tracking code.
4. Buyer sees the tracking page and confirms delivery.
5. The contract releases the escrowed MON to the seller.
6. Show the transaction on a Monad explorer.

### Explicitly out of scope

- Real shipping carrier integration
- Real money and production payments
- Full marketplace onboarding
- Complex dispute arbitration
- Multi-seller carts
- Authentication beyond wallet connection / demo roles

## System ownership

| Concern | Source of truth |
| --- | --- |
| Product title, images, price display | Backend database / seed data |
| Cart and delivery address | Frontend + private backend database |
| Shipment tracking code/evidence | Backend database |
| Buyer, seller, amount, order status | Monad smart contract |
| Escrow custody, release, refund | Monad smart contract |

## Repository map

- [`apps/web`](apps/web) — customer shop, checkout, order tracking, and seller dashboard
- [`contracts`](contracts) — Solidity escrow contract and tests
- [`services/api`](services/api) — product/order/shipping API (only off-chain data)
- [`docs`](docs) — product, architecture, contract, and demo specifications
- [`_progress`](./_progress) — resumable work checkpoints

## Team

- **Abdullah Salik** — blockchain, wallet integration, deployment, and technical demo
- **Fahad Faisal** — web product flow, off-chain commerce data, responsive pages, and presentation

See [`docs/TEAM-WORKFLOW.md`](docs/TEAM-WORKFLOW.md) and [`CONTRIBUTING.md`](CONTRIBUTING.md) for ownership and the pull-request workflow.

## Start here

1. Read [`PLAN.md`](PLAN.md).
2. Read [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
3. Read [`docs/CONTRACT-SPEC.md`](docs/CONTRACT-SPEC.md) before changing escrow behavior.
4. Keep [`MEMORY.md`](MEMORY.md) and [`MISTAKES.md`](MISTAKES.md) current while building.
