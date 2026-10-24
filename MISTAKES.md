# monvault. Mistakes and Lessons

Record concrete mistakes, near-misses, and recoveries here. Update this file when an error teaches the team something reusable.

## Known risks before implementation

| Risk | Prevention |
| --- | --- |
| Treating physical delivery as objectively provable on-chain | State clearly that buyer confirmation/dispute review is the delivery oracle. |
| Releasing funds from the API instead of the contract | Only `confirmDelivery` in the contract may pay the seller. |
| Showing fake completed blockchain actions | Wait for an actual transaction receipt and render the real result. |
| Putting private addresses or customer details on-chain | Keep them in private backend storage; store only public contract data. |
| Building too much ecommerce functionality | Maintain the one-order, two-wallet, escrow-release demo as the critical path. |
| Over-privileged admin refund function | MVP disputes freeze funds; do not add arbitrary admin withdrawals. |
| Forgetting testnet/demo reliability | Rehearse with two disposable wallets and prepare a recorded fallback. |

## Incident log

### 2026-10-22 — Host TLS certificate blocked package and Git tooling

- **What happened:** GitHub HTTPS, Homebrew, and npm registry requests failed because the injected local certificate was expired or untrusted.
- **Impact:** The GitHub push and Foundry installation could not complete. Next.js dependency installation initially stalled.
- **Recovery:** Kept TLS verification enabled, stopped hung installers, and completed npm installation from the existing verified local cache with `npm install --offline`.
- **Prevention:** Diagnose network trust before long installs; never work around it by disabling certificate verification. Foundry remains pending until the host trust chain is repaired.

### 2026-10-23 — Next.js 16 Turbopack PostCSS worker IPC panic during `next build`

- **What happened:** `next build` (which defaults to Turbopack in Next.js 16) panicked with `Failed to write app endpoint /page` when spawning a child Node process for `@tailwindcss/postcss` on `globals.css`.
- **Impact:** Production build failed with exit code 1 even though `eslint` and `tsc --noEmit` succeeded.
- **Recovery:** Configured `"build": "next build --webpack"` in `apps/web/package.json`, which runs PostCSS in-process and completes static generation cleanly.
- **Prevention:** Keep `--webpack` on the production build script so local and CI builds remain deterministic.
