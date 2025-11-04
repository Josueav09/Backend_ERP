import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // 🔥 CORS ACTUALIZADO - Permitir múltiples orígenes
  const allowedOrigins = [
    'http://localhost:5173', // Desarrollo
    'https://growvia-app-frontend.ashygrass-1b0d0ce7.eastus.azurecontainerapps.io', // Producción
    process.env.FRONTEND_URL, // Variable de entorno
  ].filter(Boolean); // Eliminar valores undefined

  app.enableCors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (como Postman, curl, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️ Origen bloqueado por CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 API Gateway corriendo en puerto ${port}`);
  console.log(`✅ CORS habilitado para: ${allowedOrigins.join(', ')}`);
}
bootstrap();
