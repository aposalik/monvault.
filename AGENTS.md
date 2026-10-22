# ProofCart Engineering Guide

## Read first

Before coding, read `README.md`, `PLAN.md`, `MEMORY.md`, and `docs/CONTRACT-SPEC.md`.

## Working rules

- Update `MEMORY.md` after important decisions or completed milestones.
- Update `MISTAKES.md` after a concrete failure or recovery lesson.
- Keep the smart contract small; every function must have a clear user story and test.
- The contract is the source of truth for money and escrow state.
- The backend is never allowed to sign or move customer funds.
- Do not add real funds, keys, delivery addresses, or secrets to Git.
- Verify contract changes with tests before connecting the frontend.

## Repository areas

- `apps/web`: Next.js customer and seller experiences
- `contracts`: Foundry Solidity contract and tests
- `services/api`: off-chain catalog, shipping, and order metadata
- `docs`: specifications and demo material
- `_progress`: resumable execution checkpoints

## Required verification before a demo

1. Contract tests pass.
2. Buyer and seller use distinct test wallets.
3. Seller cannot withdraw before buyer confirmation.
4. Non-buyer cannot confirm delivery.
5. Explorer links work for deposit and release transactions.
