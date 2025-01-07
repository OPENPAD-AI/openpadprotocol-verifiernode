import { NftItemType, SetupVerifierType } from "@/types/node-type";
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

export default function StopVerifierNodeView() {
  const user = useUser();
  const { handleWriteContract } = useWriteContracts();
  const { isActiveDelegate, refetchNodeInfos } = useReadNodeOperationContract(user?.address, user?.verifierWallet);
  const [filterToken, setFilterToken] = useState<string[]>([]);
  const [nftAvailable, setNftAvailable] = useState<NftItemType[]>([]);

  // Handle number of license on ui
  const [numberOfLicense, setNumberOfLicense] = useState<number>(1);

  const handleStopNode = async () => {
    await createSetupVerifier();
    await handleDelegate();
  };

  const createSetupVerifier = async () => {
    try {
        const paramsSetupVerifier: SetupVerifierType = {
        userAddress: user.address,
        verifier: user.verifierWallet,
        claimmer: user.address,
        commisstionRate: 5
      };

      await NodeOperationService.createSetupVerifier(paramsSetupVerifier);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelegate = async () => {
    let encodeData: any = [];
      _.range(numberOfLicense).map(async (e, i) => {
        encodeData.push(
          encodeFunctionData({
            abi: OPERATION_CONTRACT.abi,
            functionName: 'delegate',
            args: [filterToken[i], user?.verifierWallet],
            // @ts-ignore
            chainId: getCurrentChainId()
          }) as Hex
        );
      });
      await refetchNodeInfos();
      if (!isActiveDelegate) {
        const encodeSignature = await getNodeEnterSignature();
        encodeData.push(encodeSignature);
      }

      await handleWriteContract(
        {
          address: OPERATION_CONTRACT.address,
          abi: OPERATION_CONTRACT.abi,
          functionName: 'multicall',
          args: [encodeData],
          chainId: getCurrentChainId()
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

  const getNodeEnterSignature = async () => {
    try {
      const { data } = await NodeOperationService.getSignatureNodeEnter({ verifierAddress: user?.verifierWallet });

      const encodeNodeEnter = encodeFunctionData({
        abi: OPERATION_CONTRACT.abi,
        functionName: 'nodeEnterWithSignature',
        args: [user?.verifierWallet, data.expiredAt, data.data.signer, data.data.v, data.data.r, data.data.s]
      }) as Hex;

      return encodeNodeEnter;
    } catch (error) {
      console.log(error);
    }
  };



  useEffect(() => {
    if (!user?.address) return;
    fetchUserNfts();
  }, [user?.address]);

  const fetchUserNfts = async () => {
    if (!user?.address) return;
    const { data: nftData } = await NodeOperationService.getUserNft(user?.address);

    // Sort tier
    const sortedNftData = nftData.sort((a: NftItemType, b: NftItemType) => (b.tier ?? 0) - (a.tier ?? 0));
    setNftAvailable(sortedNftData);
  };

  // ------------- Fetch user's License Key ------------------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const promises = nftAvailable.map((nft) =>
          readContract(config, {
            abi: OPERATION_CONTRACT.abi,
            address: OPERATION_CONTRACT.address,
            functionName: 'delegation',
            args: [nft.tokenId],
            chainId: getCurrentChainId() as any
          })
        );
        const results: string[] = await Promise.all(promises);

        const filterTokenId = [];
        for (let i = 0; i < results.length; i++) {
          if (results[i] !== undefined && results[i].toLowerCase() !== user?.verifierWallet.toLowerCase())
            filterTokenId.push(nftAvailable[i].tokenId);
        }

        setFilterToken(filterTokenId);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [nftAvailable]);
  // ------------- END - Fetch user's License Key ------------------------------------------------------------

  return (
    <div>
      <button
        onClick={handleStopNode}
      >
        Stop Node
      </button>
    </div>
  );
}
