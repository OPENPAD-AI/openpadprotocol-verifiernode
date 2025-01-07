export type SetupVerifierType = {
  userAddress?: string;
  verifier?: string;
  claimmer?: string;
  commisstionRate?: number;
}

export type NodeEnterSignatureType = {
  expiredAt: number;
  data: {
    signer: string;
    v: number;
    r: string;
    s: string;
  };
}

export type NftItemType = {
  id: string;
  tokenId: string;
  tier: number;
  image: string;
}