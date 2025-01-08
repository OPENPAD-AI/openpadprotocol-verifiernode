import { SetupVerifierType, NodeEnterSignatureType, LicenseKeyItemType } from "@/types/node-type";
import { axiosClient } from "@/utils/axios-client";
import { apiEndpoints } from "@/utils/endpoints";
import { request } from "http";

export class NodeOperationService {
    static readonly createSetupVerifier = (params: SetupVerifierType) => {
        return axiosClient.post(apiEndpoints.nodeOperation.createSetupVerifier, params);
    };

    static readonly getSignatureNodeEnter = ({ verifierAddress }: { verifierAddress: string | undefined }) => {
        return axiosClient.post<NodeEnterSignatureType>(apiEndpoints.nodeOperation.getSignatureNodeEnter, { verifierAddress });
    };

    static readonly getUserLicenseKeys = (address: string) => {
        return axiosClient.get<LicenseKeyItemType[]>(apiEndpoints.nodeOperation.getUserLicenseKeys, { params: { address } });
    };

    static readonly getSignatureNodeExit = ({ verifierAddress }: { verifierAddress: string | undefined }) => {
        return axiosClient.get(apiEndpoints.nodeOperation.getSignatureNodeExit, { params: { verifierAddress } });
    };
}