# Contributing to ProofCart

ProofCart is being built by **Abdullah Salik** and **Fahad Faisal** for Monad Blitz Ankara.

## Branch workflow

Never develop directly on `main`.

```text
main
├── salik/blockchain-escrow
└── fahad/web-commerce-flow
```

For each task:

1. Pull the latest `main`.
2. Create a small branch named `<owner>/<feature>`.
3. Commit only one logical change at a time.
4. Push the branch and open a pull request into `main`.
5. The other teammate reviews it.
6. Merge only after the relevant checks pass.

Recommended commands:

```bash
git checkout main
git pull origin main
git checkout -b fahad/homepage
# work, test, commit
git push -u origin fahad/homepage
```

## Ownership boundaries

- Salik owns `contracts/`, blockchain configuration, wallet/contract integration, and deployment evidence.
- Fahad owns presentation components, commerce page structure, seeded product content, and demo shipment metadata.
- Changes across the other person's primary area require a review from that owner.
- Both review the final buyer/seller test and demo script.

## Before merging

- Contract change: run Foundry tests.
- Web change: run lint, typecheck, and production build.
- Payment UI change: verify it waits for a real transaction receipt.
- Documentation change: update `MEMORY.md` if it changes an accepted decision.
- Concrete failure/recovery: update `MISTAKES.md`.

## Secrets

Never commit wallet private keys, seed phrases, API keys, customer addresses, or `.env` files. Use disposable testnet wallets only.
