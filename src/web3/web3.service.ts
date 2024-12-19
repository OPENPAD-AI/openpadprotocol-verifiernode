import { Injectable, Logger } from '@nestjs/common';
import Web3 from 'web3';
import { ConfigService } from '@nestjs/config';
import { Network, ProjectType } from 'src/utils/constant';
import { ApiService } from 'src/api/api.service';

@Injectable()
export class Web3Service {
  private readonly logger = new Logger(Web3Service.name);
  public web3 = new Web3();

  constructor(
    private configService: ConfigService,
    private readonly apiService: ApiService,
  ) {}
  async getPrivateKey() {
    const claimer = this.configService.get<string>('CLAIMER_ADDRESS');
    const commission = +this.configService.get<string>('COMMISSION_RATE') || 5;
    const privateKey = this.configService.get<string>('PRIVATE_KEY');
    let privateKeyAddress = '';
    if (!privateKey.startsWith('0x')) {
      privateKeyAddress = this.web3.eth.accounts.privateKeyToAccount(
        '0x' + privateKey,
      ).address;
    }
    console.log('- claimer: ', claimer);
    console.log('- commission: ', commission);
    console.log('- privateKeyAddress: ', privateKeyAddress);

    return {
      claimer,
      commission,
      privateKey,
      privateKeyAddress,
    };
  }
  async getVerifierAddress(privateKeyAddress: string) {
    const verifierAddress =
      await this.apiService.getVerifierByAddress(privateKeyAddress);
    return verifierAddress;
  }
  async getNetWork() {
    const network = process.env.NETWORK_ARBITRUM
      ? Network.ARBITRUM_SEPOLIA
      : Network.ARBITRUM_MAINNET;
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

  async onStart() {
    try {
      this.logger.log('Web3Service initialized.');
      const { privateKey, privateKeyAddress } = await this.getPrivateKey();
      const verifierAddress = await this.getVerifierAddress(privateKeyAddress);
      console.log('- verifierAddress: ', verifierAddress);
      const nfts = await this.apiService.getNft(privateKeyAddress);
      if (nfts && nfts.length > 0) {
        if (verifierAddress) {
          await this.apiService.setupNode();
          const nftIds = nfts.map((item) => item.tokenId);

          const verifierSignature =
            await this.apiService.getVerifierSignatureNodeEnter(
              verifierAddress,
            );

          if (!verifierSignature) {
            console.log('- Verifier Signature Not Found ', verifierAddress);
            return true;
          }
          await this.nodeEnterWithSignature(
            privateKeyAddress,
            privateKey,
            verifierSignature,
            verifierAddress,
            nftIds,
          );
        } else {
          this.logger.warn(
            '- Verifier address not provided. Skipping nodeEnter.',
          );
        }
      } else {
        this.logger.warn('- NFT node found, Skipping nodeEnter.');
      }

      return;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  getWeb3(network?: Network) {
    const rpc = this.handleRpc(network);
    return new Web3(rpc);
  }

  async nodeEnterWithSignature(
    privateKeyAddress: string,
    privateKey: string,
    signature: any,
    verifierAddress: string,
    nftIds: string[],
  ) {
    try {
      // Select the network based on environment variable
      const { contractAddress, SMCContract, web3 } = await this.getNetWork();
      const nodeInfos = await SMCContract.methods
        .nodeInfos(verifierAddress)
        .call();

      if (nodeInfos['active']) {
        console.log('Node running status: ', nodeInfos['active']);
        return true;
      }
      const delegationWeightBigInt = await this.getNodeInfos(verifierAddress);

      const delegationWeights = this.fromWei(delegationWeightBigInt);
      const args = [];
      if (delegationWeights == '0') {
        nftIds.map((tokenId) => {
          const method = SMCContract.methods.delegate(tokenId, verifierAddress);
          const encodeNft = method.encodeABI();
          args.push(encodeNft);
        });
      }
      // Prepare the contract methodcon
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
      const from = privateKeyAddress;
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
  fromWei(number: string): string {
    return this.web3.utils.fromWei(number, 'ether');
  }
  async undelegate() {
    try {
      this.logger.log('Web3Service initialized.');
      const privateKey = this.configService.get<string>('PRIVATE_KEY');
      let privateKeyAddress = '';
      if (!privateKey.startsWith('0x')) {
        privateKeyAddress = this.web3.eth.accounts.privateKeyToAccount(
          '0x' + privateKey,
        ).address;
      }

      const verifierAddress =
        await this.apiService.getVerifierByAddress(privateKeyAddress);
      const nfts = await this.apiService.getNft(privateKeyAddress);
      if (nfts && nfts.length > 0) {
        if (verifierAddress) {
          const nftIds = nfts.map((item) => item.tokenId);

          await this.undelegateWithContract(
            privateKeyAddress,
            privateKey,
            verifierAddress,
            nftIds,
          );
        } else {
          this.logger.warn(
            'Verifier address not provided. Skipping undelegate.',
          );
        }
      } else {
        this.logger.warn('NFT node found');
      }

      return;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async undelegateWithContract(
    privateKeyAddress: string,
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
    const from = privateKeyAddress;
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
      const { privateKey, privateKeyAddress } = await this.getPrivateKey();
      const verifierAddress = await this.getVerifierAddress(privateKeyAddress);
      if (verifierAddress) {
        const verifierSignature =
          await this.apiService.getVerifierSignatureNodeExit(verifierAddress);
        await this.nodeExitWithSignature(
          privateKeyAddress,
          privateKey,
          verifierSignature,
          verifierAddress,
        );
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async nodeExitWithSignature(
    privateKeyAddress: string,
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
      const method = SMCContract.methods.nodeExitWithSignature(
        signature.expiredAt,
        signature.data.signer,
        signature.data.v,
        signature.data.r,
        signature.data.s,
      );
      const currentGasPrice = await web3.eth.getGasPrice();
      const from = privateKeyAddress;
      const nonce = await web3.eth.getTransactionCount(from, 'pending');

      // Create transaction object
      const tx: any = {
        nonce,
        from,
        to: contractAddress,
        gasPrice: currentGasPrice,
        data: method.encodeABI(),
      };
      // const reason = await web3.eth.call(tx).catch((error) => error.message);
      // console.error('Revert Reason:', reason);
      const estimatedGas = await web3.eth.estimateGas(tx);
      tx.gas = Math.round(Number(estimatedGas) * 1.2);

      // Sign the transaction
      const signed = await web3.eth.accounts.signTransaction(tx, privateKey);

      // Send the transaction
      const receipt = await web3.eth.sendSignedTransaction(
        signed.rawTransaction!,
      );

      console.log(
        'Stop nodeEnter successful with Txhash:',
        receipt.transactionHash,
      );
      return receipt.transactionHash;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
