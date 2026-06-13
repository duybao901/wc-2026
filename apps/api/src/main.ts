import './env';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseService } from './database/database.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173'
  });

  const database = app.get(DatabaseService);
  await database.initialize();

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}

void bootstrap();
