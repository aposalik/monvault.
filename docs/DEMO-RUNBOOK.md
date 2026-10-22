# ProofCart Demo Runbook

## Demo preparation

- Deploy contract to the organizer-approved Monad testnet.
- Prepare two disposable wallets: buyer and seller.
- Fund buyer with enough test MON for one purchase and gas.
- Seed one believable product, e.g. headphones for 1 test MON.
- Test all links on venue-like mobile network/Wi-Fi conditions.

## 60-second live demo

1. **Problem (5 sec):** "Online buyers pay before knowing delivery happened."
2. **Shop (10 sec):** Buyer chooses headphones and opens checkout.
3. **Escrow (15 sec):** Buyer pays test MON. Show: "Funds secured in escrow" and the Monad explorer transaction.
4. **Shipping (10 sec):** Switch to seller dashboard; seller marks the order shipped.
5. **Confirmation (15 sec):** Switch back to buyer; buyer confirms delivery. Show seller balance/payment transaction.
6. **Timeout protection (5 sec):** Show a second prepared shipped order with its five-minute countdown, explaining that an undisputed order can be claimed by the seller after the deadline.
7. **Close (5 sec):** "The seller never held the buyer's money. Monad releases it after buyer confirmation, or after a short undisputed review period."

## Failure fallback

- Record a complete successful two-wallet screen capture before presenting.
- Have contract address and explorer transactions bookmarked.
- If wallet/provider breaks, explain the recorded real testnet transaction rather than claiming an action succeeded.

## Truthful claims

Say: "ProofCart protects payment until buyer confirmation."

Do not say: "ProofCart proves physical delivery." Physical delivery requires buyer confirmation, tracking evidence, or future dispute review.
