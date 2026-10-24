"use client";

import { useCallback, useMemo, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
  type Connector,
} from "wagmi";

import { monadTestnet } from "@/lib/chain/config";
import { normalizeChainError } from "@/lib/chain/errors";
import type { WalletConnectionState } from "@/types/chain";

export function useWalletSession() {
  const { address, chainId, isConnected, isConnecting, isReconnecting } = useAccount();
  const { connectors, connectAsync } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const [failure, setFailure] = useState<string>();

  const state = useMemo<WalletConnectionState>(() => {
    if (failure) return { phase: "failed", message: failure };
    if (isConnecting || isReconnecting) return { phase: "connecting" };
    if (!isConnected || !address) return { phase: "disconnected" };
    if (chainId !== monadTestnet.id) {
      return { phase: "wrong-network", address, chainId };
    }
    return { phase: "ready", address };
  }, [address, chainId, failure, isConnected, isConnecting, isReconnecting]);

  const injectedConnector = useMemo<Connector | undefined>(
    () => connectors.find((connector) => connector.type === "injected") ?? connectors[0],
    [connectors],
  );

  const connect = useCallback(async () => {
    setFailure(undefined);
    if (!injectedConnector) {
      setFailure("MetaMask or another injected EVM wallet was not detected.");
      return;
    }

    try {
      await connectAsync({ connector: injectedConnector, chainId: monadTestnet.id });
    } catch (error) {
      setFailure(normalizeChainError(error));
    }
  }, [connectAsync, injectedConnector]);

  const switchToMonad = useCallback(async () => {
    setFailure(undefined);
    try {
      await switchChainAsync({ chainId: monadTestnet.id });
    } catch (error) {
      setFailure(normalizeChainError(error));
    }
  }, [switchChainAsync]);

  const disconnectWallet = useCallback(() => {
    setFailure(undefined);
    disconnect();
  }, [disconnect]);

  return {
    address,
    chainId,
    connect,
    disconnect: disconnectWallet,
    state,
    switchToMonad,
  } as const;
}
