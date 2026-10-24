"use client";

import { useCallback, useRef, useState } from "react";
import { getAddress, isAddressEqual, parseEventLogs, type Hash } from "viem";
import { useAccount, useConfig, useSwitchChain } from "wagmi";
import { getWalletClient } from "wagmi/actions";

import { monadTestnet, monVaultContractAddress, publicClient } from "@/lib/chain/config";
import { normalizeChainError } from "@/lib/chain/errors";
import { getTransactionExplorerUrl } from "@/lib/chain/explorer";
import { monVaultEscrowAbi } from "@/lib/chain/monvault-abi";
import type {
  CreateOrderInput,
  CreateOrderResult,
  OrderActionState,
} from "@/types/chain";

const IDLE_STATE: OrderActionState = { phase: "idle" };

export function useCreateOrder() {
  const config = useConfig();
  const { address, chainId, isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const [state, setState] = useState<OrderActionState>(IDLE_STATE);
  const inFlight = useRef(false);

  const reset = useCallback(() => {
    if (!inFlight.current) setState(IDLE_STATE);
  }, []);

  const createOrder = useCallback(
    async (input: CreateOrderInput): Promise<CreateOrderResult> => {
      if (inFlight.current) {
        throw new Error("An escrow transaction is already in progress.");
      }
      if (!isConnected || !address) {
        throw new Error("Connect the buyer wallet before creating an escrow order.");
      }
      if (input.amountWei <= 0n) {
        throw new Error("The escrow payment must be greater than zero.");
      }
      if (!/^0x[0-9a-fA-F]{64}$/.test(input.orderRef)) {
        throw new Error("The order reference must be an opaque bytes32 value.");
      }

      inFlight.current = true;
      let txHash: Hash | undefined;

      try {
        if (chainId !== monadTestnet.id) {
          await switchChainAsync({ chainId: monadTestnet.id });
        }

        const seller = getAddress(input.seller);
        const simulation = await publicClient.simulateContract({
          account: address,
          abi: monVaultEscrowAbi,
          address: monVaultContractAddress,
          functionName: "createOrder",
          args: [input.orderRef, seller],
          value: input.amountWei,
        });

        setState({ phase: "awaiting-signature" });
        const walletClient = await getWalletClient(config, { chainId: monadTestnet.id });
        txHash = await walletClient.writeContract(simulation.request);
        setState({ phase: "confirming", txHash });

        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        if (receipt.status !== "success") {
          throw new Error("The transaction reverted before the escrow order was created.");
        }

        const matchingEvents = parseEventLogs({
          abi: monVaultEscrowAbi,
          eventName: "OrderPaid",
          logs: receipt.logs,
          strict: true,
        }).filter(
          (event) =>
            event.args.orderRef === input.orderRef &&
            isAddressEqual(event.args.buyer, address) &&
            isAddressEqual(event.args.seller, seller) &&
            event.args.amount === input.amountWei,
        );

        if (matchingEvents.length !== 1) {
          throw new Error("The confirmed receipt did not contain exactly one matching OrderPaid event.");
        }

        const event = matchingEvents[0];
        setState({ phase: "confirmed", txHash });

        return {
          orderId: event.args.orderId,
          proof: {
            txHash,
            explorerUrl: getTransactionExplorerUrl(txHash),
            blockNumber: receipt.blockNumber,
          },
        };
      } catch (error) {
        const message = normalizeChainError(error);
        setState({ phase: "failed", message, txHash });
        throw new Error(message, { cause: error });
      } finally {
        inFlight.current = false;
      }
    },
    [address, chainId, config, isConnected, switchChainAsync],
  );

  return { createOrder, reset, state } as const;
}
