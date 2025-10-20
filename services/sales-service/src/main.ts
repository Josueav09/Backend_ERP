import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3003);
  console.log('Sales Service running on port 3003');
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
  
//   app.enableCors({
//     origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//     credentials: true,
//   });

//   app.useGlobalPipes(new ValidationPipe({
//     whitelist: true,
//     transform: true,
//   }));

//   const PORT = process.env.PORT || 3003;
//   await app.listen(PORT);
//   console.log(`🛒 Sales Service corriendo en puerto ${PORT}`);
// }
// bootstrap();