import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe with transformation and strict property checks
  app.useGlobalPipes(
    new ValidationPipe({
      // Converts primitive payload/query values to DTO-declared types.
      transform: true,
      // Drops payload properties that are not declared in DTOs.
      whitelist: true,
      // Rejects requests containing unknown DTO properties.
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Allow larger payloads for image uploads
  const bodyLimit = process.env.BODY_SIZE_LIMIT ?? '5mb';
  app.use(json({ limit: bodyLimit }));
  app.use(urlencoded({ extended: true, limit: bodyLimit }));

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
