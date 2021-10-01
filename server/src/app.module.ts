import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkTimeModule } from './work-time/work-time.module';
const { join } = require('path');

const envFilePath = join(__dirname, `../../.env.${process.env.NODE_ENV}`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
    }),
    WorkTimeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
