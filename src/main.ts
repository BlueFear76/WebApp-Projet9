// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Add this in your AppModule or main.ts
import { randomUUID } from 'crypto';
require('@nestjs/typeorm/dist/common/typeorm.utils.js').generateString = () =>
  randomUUID();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tool Tracking API')
    .setDescription('API for managing missions, vehicles, tools, and alerts')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(Number(process.env.PORT) || 3000, '0.0.0.0');
}
bootstrap();
