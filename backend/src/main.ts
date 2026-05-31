import { NestFactory } from '@nestjs/core';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';
import * as express from 'express';

function loadEnvFile() {
  const envPath = join(process.cwd(), '.env');
  if (!existsSync(envPath)) {
    return;
  }

  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

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
