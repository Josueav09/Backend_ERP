import * as path from 'path';
import * as fs from 'fs';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditController } from './controllers/jefe/audit.controller';
import { TrazabilidadController } from './controllers/jefe/trazabilidad.controller';
import { AuditService } from './services/jefe/audit.service';
import { TrazabilidadService } from './services/jefe/trazabilidad.service';
import { ClienteTrazabilidadController } from './controllers/cliente/traceability.controller';
import { ClienteTrazabilidadService } from './services/cliente/traceability.service';
import { EjecutivaTraceabilityController } from './controllers/ejecutiva/ejecutiva.controller';
import { EjecutivaTraceabilityService } from './services/ejecutiva/ejecutiva.service';

// Entidades compartidas
import { Trazabilidad } from '../../../shared/entities/Trazabilidad.entity';
import { AuditoriaCambios } from '../../../shared/entities/AuditoriaCambios.entity';
import { Ejecutiva } from '../../../shared/entities/Ejecutiva.entity';
import { EmpresaProveedora } from '../../../shared/entities/EmpresaProveedora.entity';
import { ClienteFinal } from '../../../shared/entities/ClienteFinal.entity';
import { PersonaContacto } from '../../../shared/entities/PersonaContacto.entity';
import { Jefe } from '../../../shared/entities/Jefe.entity'; // ✅ AGREGAR

import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard'; // ← AJUSTA RUTA
import { JwtStrategy } from '../../../shared/strategies/jwt.strategy'; // ← AJUSTA RUTA
import { PassportModule } from '@nestjs/passport';


const envPath = path.join(process.cwd(), 'services/traceability-service/.env');
console.log('🔧 Loading env from:', envPath);
console.log('🔧 Env file exists:', fs.existsSync(envPath));

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'tu-super-secreto-cambiar-en-produccion-2024',
        signOptions: { expiresIn: '24h' },
      }),
    }),
    TypeOrmModule.forFeature([Jefe, EmpresaProveedora, Ejecutiva]), // ← ENTIDADES PARA JWT
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envPath,
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log('🔧 Traceability Service DB Config:');
        console.log('DB_HOST:', configService.get('DB_HOST'));
        console.log('DB_DATABASE:', configService.get('DB_DATABASE'));
        console.log('DB_PASSWORD:', configService.get('DB_PASSWORD') ? '***' : 'undefined');
        
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT') || 5432,
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [
            Trazabilidad,
            AuditoriaCambios,
            Ejecutiva,
            EmpresaProveedora,
            ClienteFinal,
            PersonaContacto,
            Jefe
          ],
          synchronize: false,
          logging: configService.get('NODE_ENV') === 'development',
        };
      },
    }),

    TypeOrmModule.forFeature([
      Trazabilidad,
      AuditoriaCambios,
      Ejecutiva,
      EmpresaProveedora,
      ClienteFinal,
      PersonaContacto,
      Jefe
    ]), 
  ],
  controllers: [
    AuditController, 
    TrazabilidadController,
  ],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    AuditService, 
    TrazabilidadService
  ],
})
export class AppModule {}
