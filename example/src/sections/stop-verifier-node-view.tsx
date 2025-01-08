import { useUser } from "../hooks/use-user";
import { NodeOperationService } from "@/services/node-operation-service";
import _ from 'lodash';
import { useEffect, useState } from "react";
import { encodeFunctionData, Hex } from 'viem';
import { OPERATION_CONTRACT } from "@/contracts";
import { getCurrentChainId } from "@/utils/utils";
import { useReadNodeOperationContract } from "../hooks/contracts/use-node-operations-contract";
import { useWriteContracts } from "@/hooks/contracts/use-write-contract";
import { config } from '@/lib/wagmi';
import { readContract } from '@wagmi/core';
import { LicenseKeyItemType } from "@/types/node-type";

export default function StopVerifierNodeView() {
  const user = useUser();
  const { handleWriteContract } = useWriteContracts();
  const { delegateWeightsData } = useReadNodeOperationContract(user?.address, user?.verifierWallet);
  const [licenseKeysAvailable, setLicenseKeysAvailable] = useState<LicenseKeyItemType[]>([]);

  // Main function to stop verifier node
  const handleStopVerifierNode = async () => {
     const encodeData: any = [];
      let ownerDelegatedLicenseKey = 0;
      for (let i = 0; i < licenseKeysAvailable.length; i++) {
        const result: any = await readContract(config, {
          abi: OPERATION_CONTRACT.abi,
          address: OPERATION_CONTRACT.address,
          functionName: 'delegation',
          args: [licenseKeysAvailable[i].tokenId],
          chainId: getCurrentChainId() as any
        });

        if (result && user?.verifierWallet) {
          if (result.toLowerCase() === user.verifierWallet.toLowerCase()) {
            ownerDelegatedLicenseKey++;
            encodeData.push(
              encodeFunctionData({
                abi: OPERATION_CONTRACT.abi,
                functionName: 'undelegate',
                args: [licenseKeysAvailable[i].tokenId],
                // @ts-ignore
                chainId: getCurrentChainId(),
              }) as Hex
            );
          }
        }
      }

      // Call nodeExitWithSignature here
      // Compare the number of License Keys delegated
      // Call when the number of undelegated License Keys is less than the number of delegated License Keys
      // For example, if 5 License Keys are delegated and 3 are undelegated, call this
      // If there are 5 License Keys and 7 are undelegated (2 were delegated by others), call this, as it only processes 5, leaving 2 from others
      if (delegateWeightsData && ownerDelegatedLicenseKey < delegateWeightsData) {
        const encodeSignature = await getNodeExitSignature();
        encodeData.push(encodeSignature);
      }

      await handleWriteContract(
        {
          address: OPERATION_CONTRACT.address,
          abi: OPERATION_CONTRACT.abi,
          functionName: 'multicall',
          args: [encodeData],
          chainId: getCurrentChainId() as any,
        },
        {
          handleSuccess: async (transactionReceipt: any) => {
            console.log(transactionReceipt)
          },
          handleError: (error: any) => {
            console.log(error);
          }
        }
      );
  };


  const getNodeExitSignature = async () => {
    try {
      const { data } = await NodeOperationService.getSignatureNodeExit({ verifierAddress: user?.verifierWallet });
      console.log(data);

      const encodeNodeEnter = encodeFunctionData({
        abi: OPERATION_CONTRACT.abi,
        functionName: 'nodeExitWithSignature',
        args: [data.expiredAt, data.data.signer, data.data.v, data.data.r, data.data.s]
      }) as Hex;

      return encodeNodeEnter;
    } catch (error) {
      console.log('Something went wrong when calling nodeExitWithSignature:', error);
    }
  };


  useEffect(() => {
    if (!user?.address) return;
    fetchUserLicenseKeys();
  }, [user?.address]);

  const fetchUserLicenseKeys = async () => {
    if (!user?.address) return;
    const { data: licenseKeysData } = await NodeOperationService.getUserLicenseKeys(user?.address);

    // Sort tier
    const sortedLicenseKeysData = licenseKeysData.sort((a: LicenseKeyItemType, b: LicenseKeyItemType) => (b.tier ?? 0) - (a.tier ?? 0));
    setLicenseKeysAvailable(sortedLicenseKeysData);
  };


  return (
    <div>
      <button
        onClick={handleStopVerifierNode}
      >
        Stop Verifier Node
      </button>
    </div>
  );
}
