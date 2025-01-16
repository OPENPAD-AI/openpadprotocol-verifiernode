import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Put,
  Req,
} from '@nestjs/common';
import { Web3Service } from './web3.service';
import { UpdateOperaterAdddressDto } from './web3.dto';

@Controller('api')
export class ApiController {
  constructor(
    @Inject(forwardRef(() => Web3Service))
    private readonly web3Service: Web3Service,
  ) {}

  @Get('node-exit')
  nodeExit() {
    return this.web3Service.nodeExit();
  }
  @Get('node-enter')
  async nodeStart() {
    await this.web3Service.onNodeSetup();
    return this.web3Service.onStart();
  }
  @Get('daily-uptime-statictis')
  dailyUptimeStatictis() {
    return this.web3Service.dailyUptimeStatictis();
  }
  @Get('daily-reward-stats')
  dailyRewardStats() {
    return this.web3Service.dailyRewardStats();
  }

  @Get('undelegate')
  undelegate() {
    return this.web3Service.undelegate();
  }
  @Get('get-delegation-stats')
  getDelegationStats() {
    return this.web3Service.getDelegationStats();
  }

  @Get('get-node-list')
  getNodeList() {
    return this.web3Service.getNodeList();
  }

  @Get('get-config')
  getConfig() {
    return this.web3Service.getConfig();
  }

  @Get('get-verifier-nft-signature-node-enter')
  verifierNftSignatureNodeEnter() {
    return this.web3Service.processVerifierSignatureNodeEnter();
  }
  @Get('get-verifier-nft-signature-node-exit')
  async verifierNftSignatureNodeExit() {
    return this.web3Service.processVerifierSignatureNodeExit();
  }

  @Get('get-verifier-signature-node-enter')
  verifierSignatureNodeEnter() {
    return this.web3Service.genNodeEnterWithSignature();
  }
  @Get('get-verifier-signature-node-exit')
  verifierSignatureNodeExit() {
    return this.web3Service.genNodeExitWithSignature();
  }
  @Get('get-my-nfts')
  async getNodeInfos() {
    return await this.web3Service.getMyNfts();
  }

  @Put('/update-operater-address')
  async updateOperaterAdddress(
    @Req() req,
    @Body() updateOperaterAdddressDto: UpdateOperaterAdddressDto,
  ) {
    const data = await this.web3Service.updateOperaterAdddress(
      updateOperaterAdddressDto,
    );
    return data;
  }
}
