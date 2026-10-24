import type { Address, Hash } from "viem";

import { chainConfig } from "./config";

function explorerPath(path: string): string {
  return `${chainConfig.explorerUrl.replace(/\/$/, "")}/${path}`;
}

export function getTransactionExplorerUrl(txHash: Hash): string {
  return explorerPath(`tx/${txHash}`);
}

export function getAddressExplorerUrl(address: Address): string {
  return explorerPath(`address/${address}`);
}
