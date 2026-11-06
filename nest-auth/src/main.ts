import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { StandardSchemaValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Habilitar ZOD
  app.useGlobalPipes(new StandardSchemaValidationPipe());

  // Habilitar proteccion contra RCSF
  app.enableCsrfProtection();

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
