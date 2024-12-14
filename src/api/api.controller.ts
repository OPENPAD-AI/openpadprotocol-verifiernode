import { Controller, forwardRef, Get, Inject } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
  constructor(
    @Inject(forwardRef(() => ApiService))
    private readonly apiService: ApiService,
  ) {}

  @Get('node-exit')
  nodeExit() {
    return this.apiService.nodeExit();
  }
  @Get('daily-uptime-statictis')
  dailyUptimeStatictis() {
    return this.apiService.dailyUptimeStatictis();
  }
  @Get('daily-reward-stats')
  dailyRewardStats() {
    return this.apiService.dailyRewardStats();
  }

  @Get('undelegate')
  undelegate() {
    return this.apiService.undelegate();
  }
  @Get('get-delegation-stats')
  getDelegationStats() {
    return this.apiService.getDelegationStats();
  }
}
