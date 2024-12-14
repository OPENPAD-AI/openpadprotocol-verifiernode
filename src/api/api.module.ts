import {
  forwardRef,
  Module,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Web3Module } from 'src/web3/web3.module';
import { Web3Service } from 'src/web3/web3.service';

@Module({
  imports: [ConfigModule, forwardRef(() => Web3Module)],
  controllers: [ApiController],
  providers: [Web3Service, ApiService],
  exports: [ApiService],
})
export class ApiModule implements OnModuleInit, OnApplicationShutdown {
  constructor(private readonly web3Service: Web3Service) {}

  async onModuleInit() {
    console.log('AppModule has been initialized');
    await this.web3Service.onStart();
  }
  async onApplicationShutdown(signal?: string) {
    console.log(`ApiModule is shutting down! Signal: ${signal}`);
    await this.web3Service.nodeExit();
  }
}
