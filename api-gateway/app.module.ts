import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './src/controllers/health.controller';
import { ApiGatewayController } from './src/controllers/api-gateway.controller';

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