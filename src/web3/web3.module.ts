import { Web3Service } from './web3.service';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from 'src/api/api.module';
import { ApiService } from 'src/api/api.service';

@Module({
  imports: [ConfigModule],
  providers: [Web3Service, ApiService],
  exports: [Web3Service],
})
export class Web3Module {}
