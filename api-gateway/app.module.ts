import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './src/controllers/health.controller';
import { ApiGatewayController } from './src/controllers/api-gateway.controller';

// AGREGAR ESTO AL INICIO del archivo donde configuras TypeORM
console.log('=== TYPEORM CONFIG DEBUG ===');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_DATABASE:', process.env.DB_NAME);
console.log('Using user:', process.env.DB_USER);
console.log('=============================');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule, // ← Agregar esto
  ],
  controllers: [HealthController, ApiGatewayController],
  providers: [],
})
export class AppModule {}