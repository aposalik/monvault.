# monvault. Monad Testnet Proof

**Phase:** 3 — deployment and escrow proof

**Network:** Monad Testnet (`chainId: 10143`)

**Status:** complete — deployment and buyer-funded `PAID` order independently verified

This document records public testnet evidence only. It contains no private keys, seed phrases, delivery addresses, customer data, or production funds.

## Deployed contract

| Item | Value |
| --- | --- |
| Contract | [`0xc48545Be217840A472C6d5BA1282A15BDaA54767`](https://testnet.monadvision.com/address/0xc48545Be217840A472C6d5BA1282A15BDaA54767) |
| Deployment transaction | [`0x7f5d7d5d379c21ddd746ce356a70a3ebfad56293b22af0f0e47db7b626a845a3`](https://testnet.monadvision.com/tx/0x7f5d7d5d379c21ddd746ce356a70a3ebfad56293b22af0f0e47db7b626a845a3) |
| Deployment block | `73,571,351` |
| Network | Monad Testnet (`10143`) |
| Review window | `300 seconds` / `5 minutes` |

### Deployment checks

- The deployment receipt succeeded (`status: 1`).
- The receipt created the recorded contract address.
- The on-chain runtime bytecode is exactly `2,497` bytes and exactly matches the local `MonVaultEscrow` artifact.
- The deployment transaction input is exactly `2,529` bytes and exactly matches the local creation artifact.
- The public `REVIEW_WINDOW()` call returns `300`.
- The contract has no owner/admin role, admin withdrawal, upgrade/proxy route, `selfdestruct`, or `delegatecall` capability.

## Phase 3 test roles

| Role | Public wallet | Purpose |
| --- | --- | --- |
| Buyer | [`0x351debA8041a4359399c5aF0e11F8E66ed300492`](https://testnet.monadvision.com/address/0x351debA8041a4359399c5aF0e11F8E66ed300492) | Created the 1 test MON escrow order; later confirms or disputes. |
| Seller | [`0xc9280175a35A5D3c0B1e7D377eBEf758C71CD754`](https://testnet.monadvision.com/address/0xc9280175a35A5D3c0B1e7D377eBEf758C71CD754) | Marks the order shipped and later claims only after an undisputed timeout. |

Both addresses are disposable public test wallets. Their private keys remain solely with their wallet owner.

## Buyer-funded order proof

| Item | Verified value |
| --- | --- |
| Transaction | [`0xf17cf16b9272ba1f2adf219a61bc002d4a9b9c25663144afbae191a7f8dcc3b0`](https://testnet.monadvision.com/tx/0xf17cf16b9272ba1f2adf219a61bc002d4a9b9c25663144afbae191a7f8dcc3b0) |
| Receipt | Success (`status: 1`) |
| Block | `73,736,977` |
| Transaction index | `1` |
| Gas used | `163,870` |
| Function | `createOrder(bytes32,address)` |
| Native value | `1 MON` (`1000000000000000000 wei`) |
| Order ID | `1` |
| Order reference | `0xd0af8cf291f6ddb7eaa6f912221fc878baac3bbca3f8355f2976924f291c2892` |
| Stored status | `PAID` (`1`) |
| Stored review deadline | `0` — starts only when the seller marks shipped |
| Escrow balance after receipt | `1 MON` |

### Independent paid-order checks

- The transaction sender exactly matches the recorded buyer.
- The transaction destination exactly matches `MonVaultEscrow`.
- The transaction value is exactly `1 MON`.
- Exactly one `OrderPaid` event was emitted.
- The event records order ID `1`, the expected opaque order reference, buyer, seller, and amount.
- `getOrder(1)` returns the expected reference, buyer, seller, amount, zero pre-shipment deadline, and `PAID` status.
- The contract balance is exactly `1 MON` after confirmation.

## Safety rules

- Use test MON only.
- Never share private keys, seed phrases, passwords, recovery codes, or private delivery data.
- Wait for a confirmed receipt before presenting payment as secured.
- A wallet address is public identity data, not an authentication secret. The contract independently enforces the caller role for each transition.
- Physical delivery and tracking remain off-chain; this proof establishes payment custody and order state only.

## Next lifecycle proof

Phase 3 proves deployment and a real paid escrow order. The remaining lifecycle is covered during seller/customer integration and final acceptance:

```text
1. Seller marks order 1 SHIPPED.
2. Buyer confirms delivery, or opens a dispute before the deadline.
3. A separate order demonstrates seller timeout claim after five minutes with no dispute.
```
