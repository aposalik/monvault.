import { createPublicClient, defineChain, getAddress, http, type Address } from "viem";
import { createConfig } from "wagmi";
import { injected } from "wagmi/connectors";

const DEFAULT_RPC_URL = "https://testnet-rpc.monad.xyz";
const DEFAULT_EXPLORER_URL = "https://testnet.monadvision.com";
const DEFAULT_CONTRACT_ADDRESS = "0xc48545Be217840A472C6d5BA1282A15BDaA54767";
const DEFAULT_SELLER_ADDRESS = "0xc9280175a35A5D3c0B1e7D377eBEf758C71CD754";

const rpcUrl = process.env.NEXT_PUBLIC_MONAD_RPC_URL ?? DEFAULT_RPC_URL;
const explorerUrl = process.env.NEXT_PUBLIC_MONAD_EXPLORER_URL ?? DEFAULT_EXPLORER_URL;

function publicAddress(value: string | undefined, fallback: Address, name: string): Address {
  try {
    return getAddress(value ?? fallback);
  } catch {
    throw new Error(`${name} must be a valid public EVM address.`);
  }
}

export const monadTestnet = defineChain({
  id: 10_143,
  name: "Monad Testnet",
  nativeCurrency: {
    name: "Monad",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [rpcUrl] },
  },
  blockExplorers: {
    default: {
      name: "MonadVision",
      url: explorerUrl,
    },
  },
  testnet: true,
});

export const monVaultContractAddress = publicAddress(
  process.env.NEXT_PUBLIC_MONVAULT_CONTRACT_ADDRESS,
  DEFAULT_CONTRACT_ADDRESS,
  "NEXT_PUBLIC_MONVAULT_CONTRACT_ADDRESS",
);

export const demoSellerAddress = publicAddress(
  process.env.NEXT_PUBLIC_DEMO_SELLER_ADDRESS,
  DEFAULT_SELLER_ADDRESS,
  "NEXT_PUBLIC_DEMO_SELLER_ADDRESS",
);

export const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(rpcUrl),
});

export const wagmiConfig = createConfig({
  chains: [monadTestnet],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [monadTestnet.id]: http(rpcUrl),
  },
  ssr: true,
});

export const chainConfig = {
  chain: monadTestnet,
  contractAddress: monVaultContractAddress,
  demoSellerAddress,
  explorerUrl,
  rpcUrl,
} as const;
