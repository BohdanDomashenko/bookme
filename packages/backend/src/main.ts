import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as qs from 'qs';
import type { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.set('query parser', (str: string) => qs.parse(str));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
