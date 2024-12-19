import { Module, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Web3Module } from './web3/web3.module';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { ApiModule } from './api/api.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Web3Service } from './web3/web3.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    Web3Module,
    ApiModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
