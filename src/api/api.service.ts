import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Web3Service } from 'src/web3/web3.service';
import axios from 'axios';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);

  constructor(
    @Inject(forwardRef(() => Web3Service))
    private readonly web3Service: Web3Service,
  ) {}
  async nodeExit() {
    return this.web3Service.nodeExit();
  }

  async undelegate() {
    return this.web3Service.undelegate();
  }
  async getDelegationStats() {
    try {
      const { privateKeyAddress } = await this.web3Service.getPrivateKey();
      const verifierAddress =
        await this.getVerifierByAddress(privateKeyAddress);
      const response = await axios.get(
        `${process.env.URL_API_OPENPAD}/node-ai-vps/delegation-stats?address=${privateKeyAddress}&verifierAddress=${verifierAddress}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async getVerifierByAddress(userAddress: string) {
    try {
      console.log(
        `${process.env.URL_API_OPENPAD}/node-ai-vps/get-verifier-by-address?address=${userAddress}`,
      );
      const response = await axios.get(
        `${process.env.URL_API_OPENPAD}/node-ai-vps/get-verifier-by-address?address=${userAddress}`,
      );

      return response.data.verifierAddress;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
  async getVerifierSignatureNodeEnter(verifierAddress: string) {
    try {
      const response = await axios.get(
        `${process.env.URL_API_OPENPAD}/node-ai-vps/node-enter-with-signature?verifierAddress=${verifierAddress}`,
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
        `${process.env.URL_API_OPENPAD}/node-ai-vps/node-exit-with-signature?verifierAddress=${verifierAddress}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
  async dailyUptimeStatictis() {
    try {
      const { privateKeyAddress } = await this.web3Service.getPrivateKey();
      const verifierAddress =
        await this.getVerifierByAddress(privateKeyAddress);
      const response = await axios.get(
        `${process.env.URL_API_OPENPAD}/node-ai-vps/daily-uptime-statictis?verifierAddress=${verifierAddress}`,
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async dailyRewardStats() {
    try {
      const { privateKeyAddress } = await this.web3Service.getPrivateKey();
      const response = await axios.get(
        `${process.env.URL_API_OPENPAD}/node-ai-vps/daily-reward-stats?address=${privateKeyAddress}`,
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
      return null;
    }
  }

  async setupNode() {
    try {
      const { privateKeyAddress, commission, claimer } =
        await this.web3Service.getPrivateKey();
      const verifierAddress =
        await this.getVerifierByAddress(privateKeyAddress);
      const response = await axios.post(
        `${process.env.URL_API_OPENPAD}/node-ai-vps/create-setup`,
        {
          userAddress: privateKeyAddress,
          verifier: verifierAddress,
          claimmer: claimer || privateKeyAddress,
          commisstionRate: commission,
        },

        {
          headers: {
            'content-type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  @Cron('*/1 * * * *')
  async logs() {
    const { privateKeyAddress } = await this.web3Service.getPrivateKey();
    const verifierAddress = await this.getVerifierByAddress(privateKeyAddress);
    const response = await axios.get(
      `${process.env.URL_API_OPENPAD}/node-ai-vps/node-running-logs?address=${verifierAddress}`,
    );
    console.log('- Log node : ', JSON.stringify(response.data.data.data));

    return response.data;
  }
}
