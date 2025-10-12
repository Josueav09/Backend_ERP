import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3004);
  console.log('📦 Product Service running on port 3004');
}
bootstrap();