# monvault. Monad Testnet Proof

**Phase:** 3 — deployment and escrow proof

**Network:** Monad Testnet (`chainId: 10143`)

**Status:** deployment verified; buyer-funded order pending

This document records public testnet evidence only. It contains no private keys, seed phrases, delivery addresses, customer data, or production funds.

## Deployed contract

| Item | Value |
| --- | --- |
| Contract | [`0xc48545Be217840A472C6d5BA1282A15BDaA54767`](https://testnet.monadvision.com/address/0xc48545Be217840A472C6d5BA1282A15BDaA54767) |
| Deployment transaction | [`0x7f5d7d5d379c21ddd746ce356a70a3ebfad56293b22af0f0e47db7b626a845a3`](https://testnet.monadvision.com/tx/0x7f5d7d5d379c21ddd746ce356a70a3ebfad56293b22af0f0e47db7b626a845a3) |
| Deployment block | `73,571,351` |
| Network | Monad Testnet (`10143`) |
| Review window | `300 seconds` / `5 minutes` |

### Independent checks completed

- The deployment receipt succeeded (`status: 1`).
- The receipt created the recorded contract address.
- The on-chain runtime bytecode is exactly `2,497` bytes and exactly matches the local `MonVaultEscrow` artifact.
- The deployment transaction input is exactly `2,529` bytes and exactly matches the local creation artifact.
- The public `REVIEW_WINDOW()` call returns `300`.
- The contract has no owner/admin role, admin withdrawal, upgrade/proxy route, `selfdestruct`, or `delegatecall` capability.

## Phase 3 test roles

| Role | Public wallet | Purpose |
| --- | --- | --- |
| Buyer | [`0x351debA8041a4359399c5aF0e11F8E66ed300492`](https://testnet.monadvision.com/address/0x351debA8041a4359399c5aF0e11F8E66ed300492) | Creates the 1 test MON escrow order and later confirms or disputes. |
| Seller | [`0xc9280175a35A5D3c0B1e7D377eBEf758C71CD754`](https://testnet.monadvision.com/address/0xc9280175a35A5D3c0B1e7D377eBEf758C71CD754) | Marks the order shipped and later claims only after an undisputed timeout. |

Both addresses are disposable public test wallets. Their private keys remain solely with their wallet owner.

## Pending paid-order proof

The buyer must create exactly one escrow order with:

| Field | Required value |
| --- | --- |
| Caller | Buyer wallet above |
| Contract | `MonVaultEscrow` above |
| Function | `createOrder(bytes32 orderRef, address seller)` |
| `seller` | Seller wallet above |
| Native value | `1 MON` (`1000000000000000000 wei`) |
| `orderRef` | New unique opaque `bytes32` value; never use a delivery address or customer data |

Success evidence must include:

1. a successful `OrderPaid` event;
2. `getOrder(1)` showing the recorded buyer, seller, `1 MON`, and `PAID` status;
3. a Monad explorer link for the transaction;
4. the order’s public ID/reference recorded without private delivery data.

## Safety rules

- Use test MON only.
- Do not send private keys, seed phrases, passwords, recovery codes, or private delivery data.
- Wait for a confirmed transaction receipt before presenting a payment as secured.
- The buyer wallet must have 1 MON plus gas; the seller wallet needs test MON for its own future write-transaction gas.
- A wallet address is public identity data, not an authentication secret. The contract still enforces the caller role for every state transition.

## Next proof sequence

```text
1. Buyer creates PAID order with 1 test MON.
2. Verify OrderPaid event and getOrder(1).
3. Seller marks that order SHIPPED.
4. Buyer either confirms delivery or opens a dispute.
5. Separately demonstrate seller timeout claim only after five minutes with no dispute.
```
