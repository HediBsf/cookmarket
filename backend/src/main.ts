import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadEnvFile } from './env';
import * as express from 'express';

loadEnvFile();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ limit: '15mb', extended: true }));
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://192.168.56.1:3000',
    ],
    credentials: true,
  });
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
