import { defineChain } from "viem";

export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Monad",
    symbol: "MON",
  },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_MONAD_RPC_URL || "https://testnet-rpc.monad.xyz",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "MonadVision",
      url:
        process.env.NEXT_PUBLIC_MONAD_EXPLORER_URL ||
        "https://testnet.monadvision.com",
    },
  },
});

export const MONVAULT_CONTRACT_ADDRESS = (process.env
  .NEXT_PUBLIC_MONVAULT_CONTRACT_ADDRESS ||
  "0xc48545Be217840A472C6d5BA1282A15BDaA54767") as `0x${string}`;

export const DEMO_SELLER_ADDRESS = (process.env
  .NEXT_PUBLIC_DEMO_SELLER_ADDRESS ||
  "0xc9280175a35A5D3c0B1e7D377eBEf758C71CD754") as `0x${string}`;
