<p align="center">
  <img src="assets/brand/monvault-lockup.png" width="240" alt="monvault. logo" />
</p>

<h1 align="center">monvault.</h1>

<p align="center">
  <strong>Delivery-protected checkout powered by Monad escrow.</strong>
</p>

<p align="center">
  A hackathon prototype where a buyer locks test MON in a smart contract and the seller is paid only after delivery confirmation or an undisputed review period.
</p>

<p align="center">
  <a href="#how-it-works">How it works</a> ·
  <a href="#repository-status">Status</a> ·
  <a href="#getting-started">Getting started</a> ·
  <a href="docs/DEMO-RUNBOOK.md">Demo runbook</a>
</p>

> **Testnet prototype.** monvault. uses native test MON only. It does not prove physical delivery, process real payments, or provide automated dispute resolution.

## The problem

Online buyers typically pay before they know whether an item will arrive. That requires trust in a seller or marketplace to handle the payment fairly after checkout.

monvault. makes the payment rule visible and contract-enforced: money is held in escrow, not by the frontend or backend. The seller sees that funds are committed before shipping; the buyer retains a short window to confirm delivery or open a dispute.

## How it works

```text
Buyer pays test MON
       │
       ▼
MonVaultEscrow holds the payment ──► Seller marks the order shipped
                                             │
                                             ▼
                                  Five-minute buyer review window
                                    ├─ Buyer confirms → seller is paid
                                    ├─ Buyer disputes → funds stay locked
                                    └─ Window expires → seller may claim
```

### Contract state machine

```text
PAID ──seller ships──► SHIPPED ──buyer confirms──► COMPLETED
                         │                              ▲
                         ├─ buyer disputes ─► DISPUTED   │
                         └─ review expires ──────────────┘
                                      seller claims
```

The contract is the source of truth for the buyer, seller, escrow amount, and payment state. Product content, private delivery details, and demo tracking references stay off-chain.

## What the contract enforces

- A non-zero payment creates one escrow order with a unique opaque order reference.
- Only the recorded seller can mark that order as shipped.
- Only the recorded buyer can confirm delivery and release the payment.
- A shipped order has a five-minute review period in the demo.
- The seller can claim only after that period ends and only when no dispute exists.
- A buyer dispute freezes the escrowed funds; this MVP intentionally has no admin or automatic payout path.
- Payout operations follow checks-effects-interactions and use a reentrancy guard.

For the full interface and test requirements, see the [contract specification](docs/CONTRACT-SPEC.md).

## Architecture

```text
Next.js application                    Monad testnet
shop · checkout · tracking ──signs──► MonVaultEscrow
seller dashboard                         escrow · state · payout rules
        │
        └── private metadata ──► API / database
             product · address · tracking reference
```

The backend never signs transactions or moves customer funds. It only owns private commerce metadata; wallets call the contract directly.

Read the detailed [architecture](docs/ARCHITECTURE.md) and [product specification](docs/PRODUCT-SPEC.md) for boundaries and user flows.

## Repository status

| Area | Status | Notes |
| --- | --- | --- |
| Escrow contract | Implemented | Create, ship, confirm, dispute, and timeout-claim flows are implemented. |
| Contract tests | Implemented | Foundry coverage includes authorization, state transitions, payouts, timeout boundaries, and reentrancy. |
| Web foundation | Implemented | Next.js, TypeScript, responsive landing page, brand assets, and seeded demo catalog. |
| Testnet deployment | Planned | Contract address and explorer proof will be added after deployment. |
| Wallet integration | Planned | `viem`/`wagmi` integration begins with the checkout flow. |
| Commerce and seller flows | Planned | Shop, checkout, tracking, and seller operations are the next product phases. |

See [PHASES.md](docs/PHASES.md) for acceptance criteria and [TEAM-WORKFLOW.md](docs/TEAM-WORKFLOW.md) for ownership boundaries.

## Repository layout

```text
apps/web/       Next.js customer and seller experience
contracts/      Foundry project: MonVaultEscrow and Solidity tests
docs/           Product, architecture, contract, and demo specifications
assets/brand/   Approved monvault. visual assets
_progress/      Resumable implementation checkpoints
```

## Getting started

### Prerequisites

- Node.js 20+
- npm
- [Foundry](https://book.getfoundry.sh/getting-started/installation) for Solidity testing
- A disposable MetaMask wallet and test MON only when performing the future testnet demo

### Install and run the web app

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Environment configuration

Copy the public configuration template before wallet integration or deployment:

```bash
cp .env.example .env.local
```

`NEXT_PUBLIC_*` variables are visible to the browser. Never put a private key, seed phrase, delivery address, or other secret in this file or in Git.

### Verification commands

```bash
npm run lint
npm run typecheck
npm run build
npm run contract:test
```

The contract test command runs `forge test` from `contracts/`. Contract changes must pass their tests before frontend integration.

## Demo acceptance checklist

Before presenting, verify that:

- contract tests pass;
- buyer and seller use separate disposable test wallets;
- the seller cannot withdraw before buyer confirmation or review expiry;
- a non-buyer cannot confirm delivery;
- deposit and release transactions open in the Monad explorer.

The step-by-step presentation script and fallback guidance are in the [demo runbook](docs/DEMO-RUNBOOK.md).

## Scope and limitations

This is a focused one-order escrow demo, not a production marketplace. It deliberately excludes real funds, multi-seller carts, carrier integrations, automated refunds, and dispute arbitration. A buyer’s confirmation or dispute is the delivery oracle; the blockchain cannot independently prove that a physical package arrived.

## Team

- **Abdullah Salik** — Solidity, wallet integration, testnet deployment, and technical demo
- **Fahad Faisal** — web product flow, off-chain commerce data, responsive pages, and presentation

Collaboration practices are documented in [CONTRIBUTING.md](CONTRIBUTING.md).

## License

No license has been selected for this repository yet. Do not assume permission to reuse the code or visual assets outside this project.
