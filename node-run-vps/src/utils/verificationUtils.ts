import { ethers } from 'ethers';

export class VerificationUtils {
  static async signNodeEnter(
    signer: ethers.Wallet, // wallet will sign this report
    chainId: number, // current chainId
    replacedNode, //verifieraddress
    expiredAt,
  ) {
    const types = {
      NodeEnterData: [
        { name: 'replacedNode', type: 'address' },
        { name: 'expiredAt', type: 'uint256' },
      ],
    };
    const value = {
      replacedNode: replacedNode,
      expiredAt: expiredAt,
    };
    const domain = {
      name: 'ProtocolService',
      version: '1.0.0',
      chainId,
    };
    const signature = ethers.utils.splitSignature(
      await signer._signTypedData(domain, types, value),
    );

    return {
      signer: signer.address,
      v: signature.v,
      r: signature.r,
      s: signature.s,
    };
  }

  static async signNodeExit(
    signer: ethers.Wallet, // wallet will sign this report
    chainId: number, // current chainId
    expiredAt,
  ) {
    const types = {
      NodeExitData: [{ name: 'expiredAt', type: 'uint256' }],
    };
    const value = {
      expiredAt: expiredAt,
    };
    const domain = {
      name: 'ProtocolService',
      version: '1.0.0',
      chainId,
    };
    const signature = ethers.utils.splitSignature(
      await signer._signTypedData(domain, types, value),
    );

    return {
      signer: signer.address,
      v: signature.v,
      r: signature.r,
      s: signature.s,
    };
  }
}
