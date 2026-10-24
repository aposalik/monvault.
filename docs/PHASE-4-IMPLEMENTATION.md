# Phase 4 — Customer Commerce Integration Process

**Status:** implementation approved and starting

**Branch:** `salik/s3-wallet-chain-foundation`

**Owners:** Salik owns wallet/chain behavior; Fahad owns page and component presentation.

## 1. Objective

Connect the buyer commerce flow to the deployed `MonVaultEscrow` contract without coupling presentation components to wagmi, viem, raw Solidity enums, or RPC errors.

Phase 4 succeeds when a buyer can connect MetaMask at checkout, switch to Monad Testnet, submit `createOrder`, wait for a confirmed receipt, and read the resulting order on `/orders/[id]`. The UI must never report success from a submitted hash alone.

## 2. Proven starting point

- Monad Testnet chain ID: `10143`.
- Contract: `0xc48545Be217840A472C6d5BA1282A15BDaA54767`.
- Demo seller: `0xc9280175a35A5D3c0B1e7D377eBEf758C71CD754`.
- Phase 3 order `1` proves the deployed bytecode, receipt, event decoding, and `getOrder` output.
- Public evidence: [`TESTNET-PROOF.md`](TESTNET-PROOF.md).

## 3. Ownership boundary

### Salik changes

```text
apps/web/src/lib/chain/**
apps/web/src/hooks/contracts/**
apps/web/src/types/chain/**
apps/web/src/app/layout.tsx             # provider composition only
apps/web/package.json
package-lock.json
```

Salik owns chain configuration, ABI, wallet lifecycle, transaction submission, receipt confirmation, contract reads, event decoding, role permissions, and normalized errors.

### Fahad changes

```text
apps/web/src/app/shop/**
apps/web/src/app/products/**
apps/web/src/app/cart/**
apps/web/src/app/checkout/**
apps/web/src/app/orders/**
apps/web/src/components/**
apps/web/src/lib/orders/presentation.ts
```

Fahad consumes the exported hooks and product-facing types. Presentation code must not construct transactions, decode raw contract values, infer authorization, or import wallet-library internals.

## 4. Technical design

### Stack

- **viem:** typed ABI, contract simulation, event parsing, unit conversion, public reads.
- **wagmi:** injected-wallet connection, account/network state, write actions, and React provider lifecycle.
- **TanStack Query:** wagmi query cache and receipt/read invalidation.
- **Vitest:** pure normalization, permission, and error-mapping tests.

### Provider composition

`ChainProvider` wraps the existing application in `WagmiProvider` and `QueryClientProvider`. It configures only Monad Testnet and the injected MetaMask connector. No automatic transaction or account request occurs on page load.

### Wallet lifecycle

```text
idle
→ user clicks connect
→ MetaMask account permission
→ verify buyer-selected account
→ switch/add Monad Testnet when needed
→ ready
```

Browsing, cart creation, and private delivery entry remain wallet-free. Connection happens only when the checkout action needs a signature.

### Transaction lifecycle

```text
idle
→ awaiting-signature
→ submitted/confirming (tx hash available)
→ confirmed (receipt status success)

Any rejection, simulation failure, revert, or RPC failure
→ failed with normalized user-safe message
```

The action first simulates `createOrder`, then requests the wallet signature, then waits for a successful receipt, decodes `OrderPaid`, and returns the real order ID. Duplicate clicks stay disabled while the action is not idle/failed.

### Order normalization

Raw contract tuple:

```text
bytes32 orderRef
address buyer
address seller
uint256 amount
uint256 reviewEndsAt
uint8 status
```

Product model:

```ts
type OrderStatus = "paid" | "shipped" | "completed" | "disputed";

type ChainOrder = {
  id: bigint;
  orderRef: `0x${string}`;
  buyer: `0x${string}`;
  seller: `0x${string}`;
  amountWei: bigint;
  reviewEndsAt: number | null;
  status: OrderStatus;
};
```

Unknown enum values fail normalization rather than silently displaying an incorrect state.

### Role permissions

Permission helpers receive normalized order state, connected address, and current Unix time. Components receive explicit booleans:

```text
canMarkShipped
canConfirmDelivery
canOpenDispute
canClaimAfterTimeout
```

The contract remains authoritative. These booleans improve UX only and never replace contract checks.

## 5. Implementation sequence

### P4.1 — Configuration and ABI

1. Add pinned wallet/chain dependencies.
2. Define Monad Testnet with chain ID, RPC, explorer, and MON metadata.
3. Validate public contract/seller configuration at module startup.
4. Publish a typed, source-controlled `MonVaultEscrow` ABI.

**Gate:** configuration imports cleanly and TypeScript rejects malformed addresses.

### P4.2 — Product-facing types and pure normalization

1. Add wallet, action, order, permission, and transaction-proof types.
2. Map Solidity statuses to named product states.
3. Normalize raw `getOrder` output.
4. Compute role/action permissions.
5. Normalize wallet rejection, wrong-network, simulation, revert, and RPC failures.

**Gate:** unit tests cover every status, deadline boundary, role, and error family.

### P4.3 — Provider and wallet hook

1. Add the shared chain provider.
2. Wrap `app/layout.tsx` without changing page presentation.
3. Export a wallet hook with connect, disconnect, switch-network, address, chain, and normalized state.
4. Subscribe through wagmi rather than direct component-level `window.ethereum` access.

**Gate:** no wallet prompt occurs on load; connect is user-initiated; wrong network is explicit.

### P4.4 — Receipt-backed buyer action

1. Export `useCreateOrder`.
2. Validate seller, value, and opaque order reference.
3. Simulate against the deployed contract.
4. Request the MetaMask signature.
5. Wait for a successful receipt.
6. Decode exactly one matching `OrderPaid` event.
7. Return transaction proof and order ID.

**Gate:** submitted state is never exposed as confirmed; errors preserve a transaction hash when available.

### P4.5 — Order read adapter

1. Export `useOrder(orderId)` using the deployed contract.
2. Normalize contract tuple and refetch after confirmed writes.
3. Expose loading, missing, success, and failed states without raw RPC objects.
4. Export explorer URL helpers.

**Gate:** order `1` normalizes to the proven Phase 3 buyer, seller, 1 MON amount, and `paid` state.

### P4.6 — Fahad handoff

1. Document hook signatures with compact examples.
2. List every state the checkout/order pages must render.
3. Record fixture shapes matching production types.
4. Keep page markup and styling outside Salik’s branch.

**Gate:** Fahad can build checkout and tracking without importing `wagmi`, `viem`, an ABI, or Solidity enum numbers.

## 6. Verification

Required before handoff:

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

Also verify:

- no private key, seed phrase, or delivery data enters Git or contract arguments;
- all public addresses match Phase 3 evidence;
- a clean page load causes no wallet prompt;
- wrong-network and rejected-signature states are recoverable;
- successful writes wait for receipt status `success`;
- explorer links use Monad Testnet;
- temporary Phase 3 signing code is not reintroduced.

## 7. Review and merge process

1. Implement only Salik-owned paths plus provider composition.
2. Commit in reviewable units: config/types, wallet/actions, tests/docs.
3. Push `salik/s3-wallet-chain-foundation`.
4. Open a PR into the current integration branch after checks pass.
5. Fahad rebases his UI branch and consumes only the documented public interface.
6. Both owners execute one checkout-to-order acceptance run before Phase 4 is marked complete.

## 8. Explicit non-goals

- Seller shipment UI and seller write actions belong to Phase 5.
- Confirmation, timeout-claim, and dispute end-to-end proof belongs to Phase 6.
- Embedded wallets, account abstraction, gas sponsorship, card payment, and production authentication remain out of scope.
- No backend signs transactions or stores wallet secrets.
