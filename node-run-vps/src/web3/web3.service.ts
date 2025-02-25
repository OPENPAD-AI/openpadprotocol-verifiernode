import { Injectable, Logger } from '@nestjs/common';
import Web3 from 'web3';
import { ConfigService } from '@nestjs/config';
import { Network, ProjectType } from 'src/utils/constant';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { ethers } from 'ethers';
import { VerificationUtils } from 'src/utils/verificationUtils';
import { UpdateOperaterAdddressDto } from './web3.dto';

@Injectable()
export class Web3Service {
  private readonly logger = new Logger(Web3Service.name);
  public web3 = new Web3();
  public static initialized = false;
  public static claimer = '';
  public static commission = 5;
  public static privateKey = '';
  public static privateKeyVerifierAddress = '';
  public static pubicKeyAddress = '';
  public static verifierAddress = '';
  public static nodeType = 'Solo Operator';
  constructor(private configService: ConfigService) {
    // if (!Web3Service.initialized) {
    //   this.getPrivateKey().then(() => {
    //     Web3Service.initialized = true;
    //   });
    // }
  }
  async getConfig() {
    Web3Service.claimer = this.configService.get<string>('CLAIMER_ADDRESS');
    Web3Service.commission =
      +this.configService.get<string>('COMMISSION_RATE') || 5;

    Web3Service.privateKey = this.configService.get<string>('PRIVATE_KEY');
    Web3Service.privateKeyVerifierAddress = this.configService.get<string>(
      'PRIVATE_KEY_VERIFIER',
    );
    if (this.configService.get<string>('PUBLIC_KEY')) {
      Web3Service.pubicKeyAddress = this.configService
        .get<string>('PUBLIC_KEY')
        .toLocaleLowerCase();
    } else {
      if (!Web3Service.privateKey.startsWith('0x')) {
        Web3Service.pubicKeyAddress =
          this.web3.eth.accounts.privateKeyToAccount(
            '0x' + Web3Service.privateKey,
          ).address;
      }
    }
    Web3Service.nodeType =
      this.configService.get<string>('NODE_TYPE') || 'Solo Operator';

    Web3Service.verifierAddress = await this.getVerifierAddress(
      Web3Service.pubicKeyAddress,
    );
    console.log('- claimer: ', Web3Service.claimer);
    console.log('- commission: ', Web3Service.commission);
    console.log('- pubicKeyAddress: ', Web3Service.pubicKeyAddress);
    console.log('- verifierAddress: ', Web3Service.verifierAddress);
    console.log(
      '- privateKeyVerifierAddress: ',
      Web3Service.privateKeyVerifierAddress,
    );

    console.log('- nodeType: ', Web3Service.nodeType);

    return {
      claimer: Web3Service.claimer,
      commission: Web3Service.commission,
      pubicKeyAddress: Web3Service.pubicKeyAddress,
      verifierAddress: Web3Service.verifierAddress,
      nodeType: Web3Service.nodeType,
    };
  }
  async processVerifierSignatureNodeEnter() {
    const verifierSignature = await this.getVerifierSignatureNodeEnter(
      Web3Service.verifierAddress,
    );

    if (!verifierSignature) {
      console.log(
        '- Verifier Signature Not Found ',
        Web3Service.verifierAddress,
      );
      return false;
    }
    return verifierSignature;
  }

  async processVerifierSignatureNodeExit() {
    const verifierSignature = await this.getVerifierSignatureNodeExit(
      Web3Service.verifierAddress,
    );

    if (!verifierSignature) {
      console.log(
        '- Verifier Signature Not Found ',
        Web3Service.verifierAddress,
      );
      return false;
    }
    return verifierSignature;
  }
  async getVerifierAddress(pubicKeyAddress: string) {
    const verifierAddress = await this.getVerifierByAddress(pubicKeyAddress);
    return verifierAddress;
  }
  async getNetWork() {
    const network =
      process.env.NETWORK_ARBITRUM == 'production'
        ? Network.ARBITRUM_MAINNET
        : Network.BASE_SEPOLIA;
    const web3 = this.getWeb3(network);

    const SMCContractAbi = JSON.parse(
      JSON.stringify(this.configService.get<string>('SmcContractAbi')),
    );
    const SMCContract = new web3.eth.Contract(
      SMCContractAbi,
      this.configService.get<string>('ADDRESS_ARBITRUM_SMC_OPERATION'),
    );
    console.log(
      '- Contract : ',
      this.configService.get<string>('ADDRESS_ARBITRUM_SMC_OPERATION'),
    );
    const contractAddress = this.configService.get<string>(
      'ADDRESS_ARBITRUM_SMC_OPERATION',
    );
    return {
      contractAddress,
      SMCContract,
      web3,
    };
  }
  async onNodeSetup() {
    await this.getConfig();
    if (Web3Service.verifierAddress || Web3Service.privateKeyVerifierAddress) {
      await this.setupNode();
    }
  }
  async onStart() {
    try {
      this.logger.log('Web3Service initialized.');
      await this.getConfig();
      Web3Service.initialized = true;
      const nfts = await this.filterNft();
      if (nfts && nfts.length > 0) {
        if (Web3Service.verifierAddress) {
          const nftIds = nfts.map((item) => item.tokenId);
          const verifierSignature = await this.getVerifierSignatureNodeEnter(
            Web3Service.verifierAddress,
          );
          // const verifierSignature = await this.genNodeEnterWithSignature();

          if (!verifierSignature) {
            console.log(
              '- Verifier Signature Not Found ',
              Web3Service.verifierAddress,
            );
            return true;
          }
          if (Web3Service.privateKey) {
            await this.nodeEnterWithSignature(
              Web3Service.pubicKeyAddress,
              Web3Service.privateKey,
              verifierSignature,
              Web3Service.verifierAddress,
              nftIds,
            );
          }
        } else {
          this.logger.warn(
            '- Verifier address not provided. Skipping nodeEnter.',
          );
          // const nftIds = nfts.map((item) => item.tokenId);

          // const verifierSignature = await this.genNodeEnterWithSignature();

          // if (!verifierSignature) {
          //   console.log(
          //     '- Verifier Signature Not Found ',
          //     Web3Service.verifierAddress,
          //   );
          //   return true;
          // }
          // if (Web3Service.privateKeyVerifierAddress) {
          //   console.log(
          //     'Web3Service.pubicKeyAddress',
          //     Web3Service.pubicKeyAddress,
          //   );
          //   console.log(
          //     'Web3Service.privateKeyVerifierAddres',
          //     Web3Service.privateKeyVerifierAddress,
          //   );
          //   console.log('verifierSignature', verifierSignature);
          //   console.log(
          //     'Web3Service.verifierAddress',
          //     Web3Service.verifierAddress,
          //   );
          //   console.log('nftIds', nftIds);

          //   await this.nodeEnterWithSignature(
          //     Web3Service.pubicKeyAddress,
          //     Web3Service.privateKeyVerifierAddress,
          //     verifierSignature,
          //     Web3Service.verifierAddress,
          //     nftIds,
          //   );
          // }
        }
      } else {
        this.logger.warn('- No valid NFTs found, Skipping nodeEnter.');
      }

      return;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async filterNft() {
    const nftMax = this.configService.get<string>('NFT_MAX')
      ? +this.configService.get<string>('NFT_MAX')
      : null;

    let nfts = await this.getNft(Web3Service.pubicKeyAddress);
    if (nfts.length == 0) return [];
    const filteredArray = nfts.filter((item) => item.isDelegated === false);

    const sortedArray = filteredArray.sort((a, b) => b.tier - a.tier);

    if (nftMax !== null && nftMax > 0) {
      nfts = sortedArray.slice(0, nftMax);
    } else {
      nfts = sortedArray;
    }

    return nfts || [];
  }
  getWeb3(network?: Network) {
    const rpc = this.handleRpc(network);
    return new Web3(rpc);
  }

  async nodeEnterWithSignature(
    pubicKeyAddress: string,
    privateKey: string,
    signature: any,
    verifierAddress: string,
    nftIds: string[],
  ) {
    try {
      const { contractAddress, SMCContract, web3 } = await this.getNetWork();
      const nodeInfos = await SMCContract.methods
        .nodeInfos(verifierAddress)
        .call();

      if (nodeInfos['active']) {
        console.log('Node running status: ', nodeInfos['active']);
        return true;
      }

      const args = [];
      nftIds.map((tokenId) => {
        const method = SMCContract.methods.delegate(tokenId, verifierAddress);
        const encodeNft = method.encodeABI();
        args.push(encodeNft);
      });
      const method = SMCContract.methods.nodeEnterWithSignature(
        verifierAddress,
        signature.expiredAt,
        signature.data.signer,
        signature.data.v,
        signature.data.r,
        signature.data.s,
      );

      const encode = method.encodeABI();
      args.push(encode);

      const encodeMuticall = SMCContract.methods.multicall(args);
      const currentGasPrice = await web3.eth.getGasPrice();
      const from = pubicKeyAddress;
      const nonce = await web3.eth.getTransactionCount(from, 'pending');
      // Create transaction object
      const tx: any = {
        nonce,
        from,
        to: contractAddress,
        gasPrice: currentGasPrice,
        data: encodeMuticall.encodeABI(),
      };

      const reason = await web3.eth.call(tx).catch((error) => error.message);
      console.error('Revert Reason:', reason);
      const estimatedGas = await web3.eth.estimateGas(tx);
      tx.gas = Math.round(Number(estimatedGas) * 1.2);

      const signed = await web3.eth.accounts.signTransaction(tx, privateKey);

      const receipt = await web3.eth.sendSignedTransaction(
        signed.rawTransaction!,
      );

      console.log(
        '- Start nodeEnter successful with Txhash:',
        receipt.transactionHash,
      );
    } catch (error: any) {
      console.error('Error message:', error);
      return error;
    }
  }

  async getNodeInfos(verifierAddress: string): Promise<any> {
    try {
      const { SMCContract } = await this.getNetWork();

      const delegationWeights = BigInt(
        await SMCContract.methods.delegationWeights(verifierAddress).call(),
      );

      return delegationWeights;
    } catch (error) {
      console.error('Error fetching delegation weights:', error);
      throw new Error('Error fetching delegation weights');
    }
  }

  handleRpc(network: Network) {
    const networkConfigMap = {
      [Network.ARBITRUM_SEPOLIA]: 'arbitrumSepoliaRpc',
      [Network.ARBITRUM_MAINNET]: 'arbitrumMainnetRpc',
      [Network.BASE_SEPOLIA]: 'BaseSepoliaTestnet',
    };

    const configKey = networkConfigMap[network];
    if (configKey) {
      return this.configService.get<string>(configKey);
    }
  }

  handleAbi(type: string) {
    const abiMap = {
      [ProjectType.NODE_RUNNING_SMC]: 'SmcContractAbi',
    };

    return abiMap[type] ? this.configService.get<string>(abiMap[type]) : null;
  }

  getNetwork(chainId: number) {
    switch (Number(chainId)) {
      case 421614:
        return Network.ARBITRUM_SEPOLIA;
      case 42161:
        return Network.ARBITRUM_MAINNET;
      default:
        throw new Error(`Unknown network: ${chainId}`);
    }
  }
  fromWei(number: string) {
    const etherValue = this.web3.utils.fromWei(number, 'ether');

    // Format the ether value with the desired number of decimals
    return parseFloat(etherValue).toFixed(18);
  }
  async undelegate() {
    try {
      this.logger.log('Web3Service initialized.');

      if (this.configService.get<string>('PUBLIC_KEY')) {
        Web3Service.pubicKeyAddress = this.configService
          .get<string>('PUBLIC_KEY')
          .toLocaleLowerCase();
      } else {
        if (!Web3Service.privateKey.startsWith('0x')) {
          Web3Service.pubicKeyAddress =
            this.web3.eth.accounts.privateKeyToAccount(
              '0x' + Web3Service.privateKey,
            ).address;
        }
      }

      const nfts = await this.getNft(Web3Service.pubicKeyAddress);

      if (nfts && nfts.length > 0) {
        if (Web3Service.verifierAddress) {
          const filteredNfts = nfts.filter(
            (item) => item.verifierAddress == Web3Service.verifierAddress,
          );
          const nftIds = filteredNfts.map((item) => item.tokenId);

          if (nftIds.length > 0) {
            if (Web3Service.privateKey) {
              await this.undelegateWithContract(
                Web3Service.pubicKeyAddress,
                Web3Service.privateKey,
                Web3Service.verifierAddress,
                nftIds,
              );
            }
          } else {
            this.logger.warn('No undelegated NFTs found.');
          }
        } else {
          this.logger.warn(
            'Verifier address not provided. Skipping undelegate.',
          );
        }
      } else {
        this.logger.warn('No NFTs found for the given public key.');
      }

      return;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async undelegateWithContract(
    pubicKeyAddress: string,
    privateKey: string,
    verifierAddress: string,
    nftIds: string[],
  ) {
    const { contractAddress, SMCContract, web3 } = await this.getNetWork();

    const nodeInfos = await SMCContract.methods
      .nodeInfos(verifierAddress)
      .call();
    if (!nodeInfos['active']) {
      console.log('Node stop: ', nodeInfos['active']);
      return true;
    }
    const args = [];

    nftIds.map((tokenId) => {
      const method = SMCContract.methods.undelegate(tokenId, verifierAddress);
      const encodeNft = method.encodeABI();
      args.push(encodeNft);
    });

    const encodeMuticall = SMCContract.methods.multicall(args);
    const currentGasPrice = await web3.eth.getGasPrice();
    const from = pubicKeyAddress;
    const nonce = await web3.eth.getTransactionCount(from, 'pending');

    // Create transaction object
    const tx: any = {
      nonce,
      from,
      to: contractAddress,
      gasPrice: currentGasPrice,
      data: encodeMuticall.encodeABI(),
    };
    const reason = await web3.eth.call(tx).catch((error) => error.message);
    console.error('Revert Reason:', reason);
    const estimatedGas = await web3.eth.estimateGas(tx);
    tx.gas = Math.round(Number(estimatedGas) * 1.2);

    // Sign the transaction
    const signed = await web3.eth.accounts.signTransaction(tx, privateKey);

    // Send the transaction
    const receipt = await web3.eth.sendSignedTransaction(
      signed.rawTransaction!,
    );

    console.log(
      'Start undelegate successful with Txhash:',
      receipt.transactionHash,
    );
  }
  async nodeExit() {
    try {
      const verifierAddress = await this.getVerifierAddress(
        this.configService.get<string>('PUBLIC_KEY'),
      );
      console.log('Web3Service.verifierAddress', verifierAddress);
      // console.log(
      //   'Web3Service.verifierAddress111',
      //   Web3Service.verifierAddress,
      // );

      if (verifierAddress) {
        const verifierSignature = await this.getVerifierSignatureNodeExit(
          Web3Service.verifierAddress,
        );
        // const verifierSignature = await this.genNodeExitWithSignature();
        if (Web3Service.privateKey) {
          await this.nodeExitWithSignature(
            Web3Service.pubicKeyAddress,
            Web3Service.privateKey,
            verifierSignature,
            Web3Service.verifierAddress,
          );
        }
      }
      // if (Web3Service.privateKeyVerifierAddress) {
      //   const verifierSignature = await this.genNodeExitWithSignature();
      //   if (verifierSignature) {
      //     await this.nodeExitWithSignature(
      //       Web3Service.pubicKeyAddress,
      //       Web3Service.privateKeyVerifierAddress,
      //       verifierSignature,
      //       Web3Service.verifierAddress,
      //     );
      //   }
      // }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async nodeExitWithSignature(
    pubicKeyAddress: string,
    privateKey: string,
    signature: any,
    verifierAddress: string,
  ) {
    try {
      const { contractAddress, SMCContract, web3 } = await this.getNetWork();

      const nodeInfos = await SMCContract.methods
        .nodeInfos(verifierAddress)
        .call();
      if (!nodeInfos['active']) {
        console.log(`Node status: ${nodeInfos['active']}, Not use undelegate`);
        return true;
      }
      const args = [];
      const nfts = await this.getNft(Web3Service.pubicKeyAddress);
      if (nfts && nfts.length > 0) {
        if (Web3Service.verifierAddress) {
          const filteredNfts = nfts.filter(
            (item) => item.verifierAddress == Web3Service.verifierAddress,
          );
          const nftIds = filteredNfts.map((item) => item.tokenId);

          if (nftIds.length > 0) {
            nftIds.map((tokenId) => {
              const method = SMCContract.methods.undelegate(
                tokenId,
                verifierAddress,
              );
              const encodeNft = method.encodeABI();
              args.push(encodeNft);
            });
          } else {
            this.logger.warn('No undelegated NFTs found.');
          }
        } else {
          this.logger.warn(
            'Verifier address not provided. Skipping undelegate.',
          );
        }
      } else {
        this.logger.warn('No NFTs found for the given public key.');
      }
      const delegationWeightBigInt = await this.getNodeInfos(verifierAddress);
      const delegationWeights = delegationWeightBigInt.toString();
      const shouldEncode =
        delegationWeights != '1' ||
        (delegationWeights == '1' && args.length != 1);

      if (shouldEncode) {
        const method = SMCContract.methods.nodeExitWithSignature(
          signature.expiredAt,
          signature.data.signer,
          signature.data.v,
          signature.data.r,
          signature.data.s,
        );
        const encode = method.encodeABI();
        args.push(encode);
      }

      const encodeMuticall = SMCContract.methods.multicall(args);

      const currentGasPrice = await web3.eth.getGasPrice();
      const from = pubicKeyAddress;
      const nonce = await web3.eth.getTransactionCount(from, 'pending');
      // Create transaction object
      const tx: any = {
        nonce,
        from,
        to: contractAddress,
        gasPrice: currentGasPrice,
        data: encodeMuticall.encodeABI(),
      };

      const reason = await web3.eth.call(tx).catch((error) => error.message);
      console.error('Revert Reason:', reason);
      const estimatedGas = await web3.eth.estimateGas(tx);
      tx.gas = Math.round(Number(estimatedGas) * 1.2);

      const signed = await web3.eth.accounts.signTransaction(tx, privateKey);

      const receipt = await web3.eth.sendSignedTransaction(
        signed.rawTransaction!,
      );

      console.log(
        '- Start nodeExit successful with Txhash:',
        receipt.transactionHash,
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getDelegationStats() {
    try {
      const response = await axios.get(
        `${process.env.URL_API_OPENPAD}/node-ai-vps/delegation-stats?address=${Web3Service.pubicKeyAddress}&verifierAddress=${Web3Service.verifierAddress}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async getVerifierByAddress(userAddress: string) {
    try {
      const nftMax = this.configService.get<string>('NFT_MAX')
        ? +this.configService.get<string>('NFT_MAX')
        : null;

      let nfts = await this.getNft(userAddress);
      const filteredArray = nfts.filter((item) => item.isDelegated === false);

      if (nftMax !== null && nftMax > 0) {
        nfts = filteredArray.slice(0, nftMax);
      } else {
        nfts = filteredArray;
      }
      const maxTierItem = nfts.reduce((maxItem, currentItem) => {
        return currentItem.tier > maxItem.tier ? currentItem : maxItem;
      }, nfts[0]);

      const tokenAddress = maxTierItem?.tokenAddress || null;
      return tokenAddress;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async getVerifierSignatureNodeEnter(verifierAddress: string) {
    try {
      const response = await axios.get(
        `${process.env.URL_API_OPENPAD}/node-ai-vps/node-enter-with-signature-nft?verifierAddress=${verifierAddress}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
  async getVerifierSignatureNodeExit(verifierAddress: string) {
    try {
      const response = await axios.get(
        `${process.env.URL_API_OPENPAD}/node-ai-vps/node-exit-with-signature-nft?verifierAddress=${verifierAddress}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
  async dailyUptimeStatictis() {
    try {
      const response = await axios.get(
        `${process.env.URL_API_OPENPAD}/node-ai-vps/daily-uptime-statictis?verifierAddress=${Web3Service.verifierAddress}`,
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async dailyRewardStats() {
    try {
      const response = await axios.get(
        `${process.env.URL_API_OPENPAD}/node-ai-vps/daily-reward-stats?address=${Web3Service.pubicKeyAddress}`,
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getNft(address: string) {
    try {
      const response = await axios.get(
        `${process.env.URL_API_OPENPAD}/node-ai-vps/nfts?address=${address}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(error);
      return [];
    }
  }

  async setupNode() {
    try {
      let verifier = Web3Service.verifierAddress || '';
      if (Web3Service.privateKeyVerifierAddress) {
        verifier = this.web3.eth.accounts.privateKeyToAccount(
          '0x' + Web3Service.privateKeyVerifierAddress,
        ).address;
      }
      console.log('URL_API_OPENPAD', process.env.URL_API_OPENPAD);
      console.log('verifier', verifier);

      const response = await axios.post(
        `${process.env.URL_API_OPENPAD}/node-ai-vps/create-setup`,
        {
          userAddress: Web3Service.pubicKeyAddress,
          verifier: verifier.toLocaleLowerCase(),
          claimmer: Web3Service.claimer || Web3Service.pubicKeyAddress,
          commisstionRate: Web3Service.commission,
          type: Web3Service.nodeType,
        },

        {
          headers: {
            'content-type': 'application/json',
          },
        },
      );
      console.log('Setup node', response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  @Cron('*/1 * * * *')
  async logs() {
    const response = await axios.get(
      `${process.env.URL_API_OPENPAD}/node-ai-vps/node-running-logs?address=${Web3Service.verifierAddress}`,
    );
    console.log('- Log node : ', JSON.stringify(response.data));

    return response.data;
  }

  async getNodeList() {
    const response = await axios.get(
      `${process.env.URL_API_OPENPAD}/node-ai-vps/node-list`,
    );

    return response.data;
  }
  async getMyNfts() {
    const nfts = await this.getNft(Web3Service.pubicKeyAddress);
    return nfts;
  }

  async genNodeEnterWithSignature() {
    try {
      const expiredAt = Math.floor(Date.now() / 1000) + 60 * 60;
      const charlie = new ethers.Wallet(Web3Service.privateKeyVerifierAddress);
      //ChainID.BASE_SEPOLIA_TESTNET = 84532
      //ChainID.ARBITRUM_MAINNET = 42161
      const chainId =
        process.env.NETWORK_ARBITRUM == 'production' ? 42161 : 84532;
      const signature = await VerificationUtils.signNodeEnter(
        charlie,
        chainId,
        charlie.address,
        expiredAt,
      );

      return { data: signature, expiredAt };
    } catch (error: any) {
      console.error('Error message:', error.message);
      return error;
    }
  }
  async genNodeExitWithSignature() {
    try {
      const expiredAt = Math.floor(Date.now() / 1000) + 60 * 60;

      const charlie = new ethers.Wallet(Web3Service.privateKeyVerifierAddress);

      const chainId =
        process.env.NETWORK_ARBITRUM == 'production' ? 42161 : 84532;

      const signature = await VerificationUtils.signNodeExit(
        charlie,
        chainId,
        expiredAt,
      );

      return { data: signature, expiredAt };
    } catch (error: any) {
      console.error('Error message:', error.message);
      return error;
    }
  }

  async updateOperaterAdddress(
    updateOperaterAdddressDto: UpdateOperaterAdddressDto,
  ) {
    const response = await axios.put(
      `${process.env.URL_API_OPENPAD}/node-ai-vps/update-operater-address`,
      updateOperaterAdddressDto,
    );
    return response.data;
  }
}
