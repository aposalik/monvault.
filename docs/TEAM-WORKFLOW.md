# Salik and Fahad Collaboration Plan

## Recommended ownership

### Salik — blockchain and integration owner

- Build and test `ProofCartEscrow.sol`.
- Implement five-minute timeout and dispute rules.
- Deploy and verify the contract on Monad testnet.
- Configure MetaMask, wagmi, and viem.
- Connect Checkout, buyer confirmation, dispute, and seller timeout-claim buttons to the contract.
- Provide contract address, ABI, explorer links, and integration helpers.

**Primary paths:**

```text
contracts/**
apps/web/src/lib/chain/**
apps/web/src/hooks/contracts/**
```

### Fahad — web product and off-chain flow owner

- Build the portfolio homepage sections.
- Build Shop, Product, Cart, Tracking, and Seller Orders page layouts.
- Create seeded product/seller data.
- Implement demo shipment/tracking storage and status presentation.
- Build reusable order timeline, countdown, transaction-link, and product-card components.
- Make responsive desktop/mobile behavior without changing escrow rules.

**Primary paths:**

```text
apps/web/src/app/**
apps/web/src/components/**
apps/web/src/data/**
apps/web/src/lib/orders/**
assets/**
```

## Integration contract between teammates

Salik supplies:

- typed contract ABI;
- deployed contract address and chain configuration;
- hooks/actions for create, ship, confirm, dispute, and timeout claim;
- normalized contract order status.

Fahad supplies UI components that accept data and callbacks:

```ts
type OrderActions = {
  onMarkShipped?: () => Promise<void>;
  onConfirmDelivery?: () => Promise<void>;
  onOpenDispute?: () => Promise<void>;
  onClaimAfterTimeout?: () => Promise<void>;
};
```

This keeps visual work independent from contract internals and reduces merge conflicts.

## Shared milestones

1. **Contract/API agreement:** agree on order fields and status names before coding pages.
2. **First integration:** one seeded product creates one real escrow order.
3. **Seller handoff:** Fahad's seller screen calls Salik's shipping action.
4. **Three-path verification:** confirm, timeout claim, and dispute.
5. **Demo freeze:** stop adding features; fix only demo-blocking problems.

## Pull request review rule

- Salik reviews any payment, wallet, contract, or chain-status change.
- Fahad reviews any page-flow, content, responsive, or usability change.
- Both approve changes touching the live demo flow.

## GitHub setup for Fahad

Once Fahad's GitHub username is known, the repository owner adds him through:

`Repository → Settings → Collaborators → Add people`

Give normal **Write** access, not Admin. Keep `main` protected and require pull requests where the repository plan supports it.
