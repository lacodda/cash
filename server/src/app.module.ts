import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';

import config, { envFilePath } from './config/config';
import { getMongoConfig } from './config/mongo.config';

import { WorkTimeModule } from './work-time/work-time.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      load: [config],
    }),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    WorkTimeModule,
  ],
})
export class AppModule {}
