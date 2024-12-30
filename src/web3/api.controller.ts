import { Controller, forwardRef, Get, Inject } from '@nestjs/common';
import { Web3Service } from './web3.service';

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
  nodeStart() {
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
}
