import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const config = new ConfigService();
  const app = await NestFactory.create(AppModule, config.getAppOptions());
  await app.listen(await config.getPortConfig());
}
bootstrap();
