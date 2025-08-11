import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default function setupSwagger(
  app: INestApplication,
  swaggerPath: string,
) {
  const options = new DocumentBuilder()
    .setTitle('Api Library')
    .setDescription('### API of a library app.')
    .setLicense('MIT', 'https://opensource.org/license/mit')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'jwt', // Este es el nombre del esquema, luego se referencia así
    )
    .build();

  const doc = SwaggerModule.createDocument(app, options);

  const paths = Object.keys(doc.paths).sort();
  const sortedPaths = {};
  paths.forEach((path) => {
    sortedPaths[path] = doc.paths[path];
  });
  doc.paths = sortedPaths;

  const schemas = Object.keys(doc.components!.schemas!).sort();
  const sortedSchemas = {};
  schemas.forEach((schema) => {
    sortedSchemas[schema] = doc.components!.schemas![schema];
  });
  doc.components!.schemas = sortedSchemas;

  SwaggerModule.setup(swaggerPath, app, doc);
}
