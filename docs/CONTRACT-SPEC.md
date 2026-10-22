# ProofCart Escrow Contract Specification

## Goal

`ProofCartEscrow` holds native test MON for one order and releases it only when the buyer confirms delivery.

## Minimal order shape

```solidity
enum Status { NONE, PAID, SHIPPED, COMPLETED, DISPUTED }

struct Order {
    bytes32 orderRef;
    address buyer;
    address seller;
    uint256 amount;
    uint256 reviewEndsAt;
    Status status;
}
```

The product ID, customer address, and shipping tracking data remain off-chain. An opaque backend order reference may be stored as a `bytes32` hash if needed.

## Required functions

| Function | Caller | Rule |
| --- | --- | --- |
| `createOrder(orderRef, seller)` | Buyer | Sends a non-zero exact MON amount; creates `PAID` order. |
| `markShipped(orderId)` | That order's seller | Only allowed from `PAID`; changes state to `SHIPPED` and sets `reviewEndsAt = block.timestamp + 5 minutes`. Shipping details stay off-chain. |
| `confirmDelivery(orderId)` | That order's buyer | Only allowed from `SHIPPED`; changes state to `COMPLETED`, then pays seller immediately. |
| `openDispute(orderId)` | That order's buyer | Allowed from `PAID` or `SHIPPED`; changes state to `DISPUTED`; does not pay anyone. |
| `claimAfterTimeout(orderId)` | That order's seller | Only allowed from `SHIPPED` after `reviewEndsAt`; changes state to `COMPLETED`, then pays seller. A disputed order cannot be claimed. |
| `getOrder(orderId)` | Anyone | Read-only order inspection. |

## Events

```solidity
event OrderPaid(uint256 indexed orderId, bytes32 indexed orderRef, address indexed buyer, address seller, uint256 amount);
event OrderShipped(uint256 indexed orderId, address indexed seller, uint256 reviewEndsAt);
event DeliveryConfirmed(uint256 indexed orderId, address indexed buyer);
event SellerClaimedAfterTimeout(uint256 indexed orderId, address indexed seller);
event DisputeOpened(uint256 indexed orderId, address indexed buyer);
```

For the MVP, do not put delivery addresses, tracking references, customer details, or free-text dispute evidence in contract events.

## Required tests

1. Buyer can create an order with MON.
2. Zero-value order reverts.
3. Only the assigned seller can mark an order shipped.
4. Seller cannot mark an already shipped/completed order shipped again.
5. Only the buyer can confirm delivery.
6. Buyer cannot confirm before shipment.
7. On confirmation, seller receives exactly escrowed funds.
8. Only the seller can claim an undisputed order after the five-minute review deadline.
9. Seller timeout-claim reverts before the deadline.
10. A dispute blocks both confirmation and timeout payout.
11. Contract balance and order state remain correct after failed calls.
12. Reentrancy attempt during payout fails.

## MVP limitations

- No automatic refund.
- No dispute judge or admin resolution.
- No ERC-20 / stablecoin support initially.
- No multi-item cart in one escrow call.
- Testnet only.
- Seller wallets must be able to receive native MON. A contract seller that deliberately rejects native transfers cannot complete payout in this MVP.

These are intentional scope choices, not missing work.

## Implementation status

Implemented in `contracts/src/ProofCartEscrow.sol`. The 18-test suite covers creation, unique references, seller shipment authorization, the five-minute boundary, buyer confirmation, disputes, timeout claims, exact payouts, unauthorized callers, invalid state transitions, and a reentrant timeout-claim attempt.
