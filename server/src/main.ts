import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config';
const { join } = require('path');
const { readFileSync } = require('fs');

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync(join(__dirname, '../../ssl/ssl.key')),
    cert: readFileSync(join(__dirname, '../../ssl/ssl.crt')),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });
  await app.listen(config.port);
}
bootstrap();
