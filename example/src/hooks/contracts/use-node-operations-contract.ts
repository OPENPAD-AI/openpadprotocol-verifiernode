import BigNumber from "bignumber.js";
import { OPERATION_CONTRACT } from "@/contracts";
import { useEffect } from "react";
import { useReadContract } from "wagmi";
import { getCurrentChainId } from "@/utils/utils";

export function useReadNodeOperationContract(address?: string, verifierWallet?: `${string}`) {

    const { data: nodeInfos, refetch: refetchNodeInfos } = useReadContract({
        abi: OPERATION_CONTRACT.abi,
        address: OPERATION_CONTRACT.address,
        functionName: 'nodeInfos',
        args: [verifierWallet],
        chainId: getCurrentChainId() as any,
    });

    const fetchNodeOperationData = async () => {
        await refetchNodeInfos();
        await refetchDelegateWeightsData();
    };

    const { data: delegateWeightsData, refetch: refetchDelegateWeightsData } = useReadContract({
        abi: OPERATION_CONTRACT.abi,
        address: OPERATION_CONTRACT.address,
        functionName: 'delegationWeights',
        args: [verifierWallet],
        chainId: getCurrentChainId() as any,
      });

    useEffect(() => {
        if (!address) return;
        fetchNodeOperationData();
    }, [address]);

    return {
        isActiveDelegate: nodeInfos ? nodeInfos[2] : false,
        refetchNodeInfos,

        delegateWeightsData: delegateWeightsData === undefined ? null : BigNumber((delegateWeightsData as any).toString()).toNumber(),
    };
}