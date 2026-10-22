# monvault. Project Soul

## Mission

Build a demo that makes online shopping escrow understandable in one minute.

## Product principles

1. **Money rules belong on-chain.** Escrow, release, refund eligibility, and authorization must be enforced by Solidity.
2. **Private customer data stays off-chain.** Store the minimum necessary outside the chain and never place private details in events or transaction calldata.
3. **Be honest about physical delivery.** Monad cannot prove delivery; buyer confirmation and later dispute review are human processes.
4. **One complete path beats many mock features.** Prioritize buyer payment, seller shipping, buyer confirmation, and real escrow release.
5. **A transaction is evidence.** Link the user to explorer transactions and avoid simulated success screens for blockchain actions.
6. **Security and clarity over cleverness.** Use a small contract, explicit roles, events, checks-effects-interactions, and tests.

## Demo principle

A non-technical viewer should understand the product without knowing what a blockchain is:

> "The seller cannot take the money until I say my order arrived."

## Scope guard

Reject or defer features that do not improve the core escrow demonstration: tokens, social feeds, AI agents, loyalty points, multi-chain support, real carrier integrations, and complex governance.
