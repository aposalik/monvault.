"use client";

import { useMemo } from "react";
import { useReadContract } from "wagmi";

import { monadTestnet, monVaultContractAddress } from "@/lib/chain/config";
import { isMissingOrderError, normalizeChainError } from "@/lib/chain/errors";
import { monVaultEscrowAbi } from "@/lib/chain/monvault-abi";
import { normalizeContractOrder, type ContractOrderTuple } from "@/lib/chain/orders";
import type { OrderReadState } from "@/types/chain";

export function useOrder(orderId: bigint | undefined) {
  const query = useReadContract({
    abi: monVaultEscrowAbi,
    address: monVaultContractAddress,
    chainId: monadTestnet.id,
    functionName: "getOrder",
    args: orderId === undefined ? undefined : [orderId],
    query: {
      enabled: orderId !== undefined && orderId > 0n,
      refetchInterval: 4_000,
    },
  });

  const state = useMemo<OrderReadState>(() => {
    if (orderId === undefined || orderId <= 0n) return { phase: "idle" };
    if (query.isPending) return { phase: "loading" };
    if (query.error) {
      if (isMissingOrderError(query.error)) return { phase: "missing" };
      return { phase: "failed", message: normalizeChainError(query.error) };
    }
    if (!query.data) return { phase: "loading" };

    return {
      phase: "ready",
      order: normalizeContractOrder(orderId, query.data as ContractOrderTuple),
    };
  }, [orderId, query.data, query.error, query.isPending]);

  return {
    refetch: query.refetch,
    state,
  } as const;
}
