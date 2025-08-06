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
  const port = app.get(ConfigService).get<number>('APP_PORT') || '3000';

  // Configuración global de validación
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  setupSwagger(app, SWAGGER_PATH);
  initSetup(app);
  await setupSeeders(app);

  await app.listen(port);

  setupLogging(app, SWAGGER_PATH);

  // Configuración CORS
  // app.enableCors({
  //   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  //   credentials: true,
  // });

  // Configuración de Swagger
  //   const config = new DocumentBuilder()
  //     .setTitle('API Kanvan Lite')
  //     .setDescription('Documentación de la API con Swagger')
  //     .setVersion('1.0')
  //     .addBearerAuth() // Si usas JWT Bearer Auth, si no puedes quitar esta línea
  //     .build();

  //   const document = SwaggerModule.createDocument(app, config);
  //   SwaggerModule.setup('api-docs', app, document);

  //   // Puerto de escucha
  //   const port = process.env.PORT || 3001;
  //   await app.listen(port);
  //   console.log(`Application is running on: http://localhost:${port}`);
  //   console.log(`Swagger UI available at: http://localhost:${port}/api-docs`);
}
bootstrap();
