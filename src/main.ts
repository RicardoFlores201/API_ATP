import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Logger, ValidationPipe } from '@nestjs/common';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  try {
    logger.log('Starting NestJS application...');

    logger.log(
      `Environment: ${process.env.NODE_ENV ?? 'undefined'}`,
    );

    logger.log(
      `MongoDB URI configured: ${Boolean(process.env.MONGODB_URI)}`,
    );

    const app = await NestFactory.create(AppModule, {
      logger: ['log', 'error', 'warn', 'debug'],
      abortOnError: false,
    });

    logger.log('NestJS instance created successfully');

    app.setGlobalPrefix('api/v1');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    app.enableCors({
      origin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
        : '*',
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    });

    logger.log('Initializing HTTP server...');

    await app.listen(process.env.PORT ?? 3000);

    logger.log('NestJS application started successfully');
  } catch (error: unknown) {
    console.error('[BOOTSTRAP_ERROR]', error);
    throw error;
  }
}

await bootstrap();