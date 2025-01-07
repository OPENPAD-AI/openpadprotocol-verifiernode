import { SetupVerifierType, NftItemType, NodeEnterSignatureType } from "@/types/node-type";
import { axiosClient } from "@/utils/axios-client";
import { apiEndpoints } from "@/utils/endpoints";

export class NodeOperationService {
    static readonly createSetupVerifier = (params: SetupVerifierType) => {
        return axiosClient.post(apiEndpoints.nodeOperation.createSetupVerifier, params);
    };

    static readonly getSignatureNodeEnter = ({ verifierAddress }: { verifierAddress: string | undefined }) => {
        return axiosClient.post<NodeEnterSignatureType>(apiEndpoints.nodeOperation.getSignatureNodeEnter, { verifierAddress });
    };

    static readonly getUserNft = (address: string) => {
        return axiosClient.get<NftItemType[]>(apiEndpoints.nodeOperation.getUserNft, { params: { address } });
    };
}