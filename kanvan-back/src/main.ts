import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import setupSwagger from './config/swagger.setup';
import initSetup from './config/init.setup';
import setupSeeders from './config/seeders.setup';
import setupLogging from './config/logging.setup';

const SWAGGER_PATH = '/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = app.get(ConfigService).get<number>('APP_PORT') || '3001';

  // Configuración global de validación
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });

  setupSwagger(app, SWAGGER_PATH);
  initSetup(app);
  await setupSeeders(app);

  await app.listen(port);

  setupLogging(app, SWAGGER_PATH);
}
bootstrap();
