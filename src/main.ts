import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  try {
    logger.log('STEP 1: Starting bootstrap');

    logger.log(`Node: ${process.version}`);
    logger.log(`Environment: ${process.env.NODE_ENV}`);
    logger.log(
      `MongoDB configured: ${Boolean(process.env.MONGODB_URI)}`,
    );

    logger.log('STEP 2: Importing AppModule');

    const { AppModule } = await import('./app.module.js');

    logger.log('STEP 3: AppModule imported');

    const app = await NestFactory.create(AppModule, {
      abortOnError: false,
      logger: ['log', 'error', 'warn', 'debug'],
    });

    logger.log('STEP 4: NestJS instance created');

    app.setGlobalPrefix('api/v1');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    app.enableCors({
      origin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',')
        : '*',
      methods: [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS',
      ],
    });

    logger.log('STEP 5: Starting HTTP server');

    await app.listen(process.env.PORT ?? 3000);

    logger.log('STEP 6: Application ready');
  } catch (error: unknown) {
    console.error('[BOOTSTRAP_FATAL_ERROR]', error);
    throw error;
  }
}

void bootstrap();