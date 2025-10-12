
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
  import { HttpExceptionFilter } from './src/filters/http-exception.filter';
  import { LoggingInterceptor } from './src/interceptors/logging.interceptor';
import * as path from 'path';
import * as fs from 'fs';

// DEBUG: Agregar antes de bootstrap
console.log('=== ENV DEBUG MAIN.TS ===');
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('Env file exists in services/auth-service/.env:', fs.existsSync(path.join(process.cwd(), 'services/auth-service/.env')));
console.log('Env file exists in .env:', fs.existsSync(path.join(process.cwd(), '.env')));
console.log('DB_PASSWORD from process.env:', process.env.DB_PASSWORD);
console.log('=========================');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 🔐 Seguridad
  app.use(helmet());

  // 🚦 Rate Limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Demasiadas solicitudes desde esta IP, intente más tarde.',
    }),
  );

  // ✅ Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // COMENTA temporalmente estos si causan problemas
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // 🌐 CORS
  app.enableCors({
    origin: [
      configService.get('FRONTEND_URL') || 'http://localhost:5173',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID'],
  });

  const port = configService.get('PORT') || 3001;
  await app.listen(port);
  
  console.log(`🚀 Auth Service running on port ${port}`);
}

bootstrap();