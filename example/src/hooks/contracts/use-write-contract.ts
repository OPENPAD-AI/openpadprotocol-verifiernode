import { waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { config } from '@/lib/wagmi';


export function useWriteContracts() {
    const handleTransactionSubmitted = async (txHash: string, handleSuccess: (transactionReceipt: any) => void) => {
        const transactionReceipt = await waitForTransactionReceipt(config, {
            hash: txHash as `0x${string}`,
        });

        // at this point the tx was mined
        if (transactionReceipt.status === "success") {
            // execute your logic here
            handleSuccess(transactionReceipt);
        }
    };

    const handleWriteContract = async (
        data: any,
        {
            handleSuccess,
            handleError,
        }: {
            handleSuccess: (transactionReceipt: any) => void;
            handleError: (error?: any) => void;
        }
    ) => {
        try {
            const result = await writeContract(config, data);
            await handleTransactionSubmitted(result, handleSuccess);
        } catch (e) {
            handleError(e);
        }
    }
    return {
        handleWriteContract,
    }
}