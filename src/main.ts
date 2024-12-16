import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';


dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger: ['log', 'debug', 'error', 'warn', 'verbose'], // Enable all levels
  });
  await app.listen(process.env.PORT ?? 3000);
  Logger.debug('Application is running on port 3000');
}
bootstrap();
