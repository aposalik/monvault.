# monvault. Product Specification

## Personas

### Buyer
Wants assurance that their payment is not immediately lost before a product arrives.

### Seller
Wants proof that a buyer has committed funds before shipping.

## Main screens and responsibilities

| Route | User | Purpose |
| --- | --- | --- |
| `/` | Everyone | Portfolio-style project homepage: problem, solution, flow, architecture, proof. |
| `/shop` | Buyer | Browse demo catalog. |
| `/products/[slug]` | Buyer | Inspect a product and add it to cart. |
| `/cart` | Buyer | Review one or more UI cart items. MVP checkout should escrow one seller/order. |
| `/checkout` | Buyer | Connect wallet; send test MON to contract; enter delivery details privately. |
| `/orders/[id]` | Buyer | Track escrow/payment/shipping state and confirm delivery or dispute. |
| `/seller/orders` | Seller | View paid orders; add tracking reference; mark shipped. |

## Status language

Never show raw enum names to normal users.

| Contract status | UI copy |
| --- | --- |
| `PAID` | Funds secured in escrow |
| `SHIPPED` | Seller shipped your order — review time remaining |
| `COMPLETED` | Seller paid after delivery confirmation or review timeout |
| `DISPUTED` | Dispute open — payment remains protected |

## Homepage content

1. Hero: **"Pay only when your order arrives."**
2. One-sentence explanation of Monad escrow.
3. Animated/simple five-step purchase flow.
4. Why normal ecommerce trust fails.
5. Architecture: frontend, backend, Monad contract.
6. Security truth: physical delivery needs human confirmation.
7. Demo and explorer proof.
8. Team/repository/roadmap.

## Checkout requirements

- Show product, seller, and total in test MON.
- Clearly say: "Your funds are locked in Monad escrow. Confirm delivery to pay the seller now, or open a dispute within five minutes. Otherwise the seller may claim payment after the review period."
- Disable confirmation while the wallet transaction is pending.
- After confirmation, show transaction hash and explorer link.
- Never request/handle a wallet private key.

## Seller shipping requirements

- Seller sees only their own orders.
- Seller can submit a tracking reference through the private backend.
- Seller contract action changes the order from `PAID` to `SHIPPED` and starts the five-minute review timer.
- Seller cannot trigger an immediate payout; they can claim only after the timer expires and only if no dispute exists.
