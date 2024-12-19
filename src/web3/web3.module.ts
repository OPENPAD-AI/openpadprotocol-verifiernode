import { Web3Service } from './web3.service';
import {
  forwardRef,
  Module,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiController } from './api.controller';

@Module({
  imports: [ConfigModule],
  controllers: [ApiController],
  providers: [Web3Service],
  exports: [Web3Service],
})
export class Web3Module implements OnModuleInit, OnApplicationShutdown {
  constructor(private readonly web3Service: Web3Service) {}

  async onModuleInit() {
    console.log('AppModule has been initialized');
    await this.web3Service.onStart();
  }
  async onApplicationShutdown(signal?: string) {
    console.log(`ApiModule is shutting down! Signal: ${signal}`);
    await this.web3Service.undelegate();
  }
}
