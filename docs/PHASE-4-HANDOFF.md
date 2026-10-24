# Phase 4 Chain Integration Handoff

This document is the frontend contract between Salik’s chain layer and Fahad’s checkout/order presentation. Page code should import only these hooks, product-facing types, and explorer helpers.

## Provider

`app/layout.tsx` already wraps the application with `ChainProvider`. Pages must not create their own wagmi configuration, query client, or injected-wallet listeners.

A page load does not request a wallet. Connection remains user-initiated.

## Wallet session

```ts
import { useWalletSession } from "@/hooks/contracts/use-wallet-session";

const wallet = useWalletSession();
```

Returned API:

```text
wallet.state
  disconnected
  connecting
  wrong-network { address, chainId }
  ready { address }
  failed { message }

wallet.connect()
wallet.switchToMonad()
wallet.disconnect()
```

Presentation requirements:

- `disconnected`: show **Connect wallet** only at the payment boundary.
- `connecting`: disable repeated connection clicks.
- `wrong-network`: show **Switch to Monad Testnet**.
- `ready`: allow checkout only when the intended order data is valid.
- `failed`: show the normalized message and a recoverable retry.

## Create order

```ts
import { parseEther, toHex } from "viem";
import { useCreateOrder } from "@/hooks/contracts/use-create-order";
import { demoSellerAddress } from "@/lib/chain/config";

const { createOrder, reset, state } = useCreateOrder();

const result = await createOrder({
  orderRef: toHex(crypto.getRandomValues(new Uint8Array(32))),
  seller: demoSellerAddress,
  amountWei: parseEther("1"),
});

router.push(`/orders/${result.orderId}`);
```

The real application should derive `orderRef` from an opaque off-chain order identifier. Never hash a delivery address, email, phone number, product description, or other personal data into the reference.

Action state:

```text
idle
awaiting-signature
confirming { txHash }
confirmed { txHash }
failed { message, txHash? }
```

Rules:

- Keep the submit action disabled during `awaiting-signature` and `confirming`.
- Do not render “Funds secured” until `confirmed`.
- A submitted hash is evidence of submission, not success.
- Preserve the explorer link when `failed` includes a transaction hash.
- Call `reset()` only after the user explicitly retries or leaves the completed flow.

`createOrder()` resolves only after a successful receipt and exactly one matching `OrderPaid` event. Its result includes the on-chain order ID and transaction proof.

## Read order

```ts
import { useOrder } from "@/hooks/contracts/use-order";

const { state, refetch } = useOrder(orderId);
```

Read state:

```text
idle
loading
ready { order }
missing
failed { message }
```

Normalized order:

```ts
type ChainOrder = {
  id: bigint;
  orderRef: `0x${string}`;
  buyer: `0x${string}`;
  seller: `0x${string}`;
  amountWei: bigint;
  reviewEndsAt: number | null;
  status: "paid" | "shipped" | "completed" | "disputed";
};
```

Do not import or display raw Solidity enum values. Use `formatEther(order.amountWei)` for human-readable MON amounts. Keep calculations in `bigint`.

## Permissions

```ts
import { getOrderPermissions } from "@/lib/chain/orders";

const permissions = getOrderPermissions(
  order,
  wallet.address,
  Math.floor(Date.now() / 1_000),
);
```

Returned booleans:

```text
canMarkShipped
canConfirmDelivery
canOpenDispute
canClaimAfterTimeout
```

These booleans are presentation hints. The smart contract independently enforces every role, state, and deadline.

## Explorer helpers

```ts
import {
  getAddressExplorerUrl,
  getTransactionExplorerUrl,
} from "@/lib/chain/explorer";
```

Do not concatenate explorer URLs inside components.

## Public configuration

```ts
import {
  chainConfig,
  demoSellerAddress,
  monadTestnet,
  monVaultContractAddress,
} from "@/lib/chain/config";
```

The committed defaults are the Phase 3 verified Monad Testnet deployment. Environment variables may override only public values.

## Presentation boundary

Fahad’s components may use the hooks/types above. They must not import:

- `wagmi` or `viem` contract actions directly;
- `monVaultEscrowAbi`;
- raw RPC responses or contract enum numbers;
- wallet-provider objects;
- private delivery or tracking data in any chain call.

If a missing UI requirement would require changing these interfaces, update this handoff first and request Salik’s review before coupling the component to wallet internals.
