import * as path from 'path';
import * as fs from 'fs';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EjecutivasController } from './controllers/jefe/ejecutivas.controller';
import { EmpresasController } from './controllers/jefe/empresas.controller';
import { JefeController } from './controllers/jefe/jefe.controller';
import { EjecutivasService } from './services/jefe/ejecutivas.service';
import { EmpresasService } from './services/jefe/empresas.service';
import { JefeService } from './services/jefe/jefe.service';
import { EmpresaDashboardController } from './controllers/cliente/dashboard.controller';
import { EmpresaDashboardService } from './services/cliente/dashboard.service';
import { EjecutivaController } from './controllers/ejecutiva/ejecutiva.controller';
import { EjecutivaService } from './services/ejecutiva/ejecutiva.service';

// Entidades compartidas
import { Jefe } from '../../../shared/entities/Jefe.entity';
import { Ejecutiva } from '../../../shared/entities/Ejecutiva.entity';
import { EmpresaProveedora } from '../../../shared/entities/EmpresaProveedora.entity';
import { ClienteFinal } from '../../../shared/entities/ClienteFinal.entity';
import { PersonaContacto } from '../../../shared/entities/PersonaContacto.entity'; // ✅ AGREGAR
import { Trazabilidad } from '../../../shared/entities/Trazabilidad.entity';
import { AuditoriaCambios } from '../../../shared/entities/AuditoriaCambios.entity';
import { ClientesController } from './controllers/jefe/clienteFinal.controller';
import { ClientesService } from './services/jefe/clientes.service';
import { JwtModule } from '@nestjs/jwt';

import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard'; // ← AJUSTA RUTA
import { JwtStrategy } from '../../../shared/strategies/jwt.strategy'; // ← AJUSTA RUTA
import { PassportModule } from '@nestjs/passport';



const envPath = path.join(process.cwd(), 'services/user-service/.env');
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
        console.log('🔧 User Service DB Config:');
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
            Jefe,
            Ejecutiva,
            EmpresaProveedora,
            ClienteFinal,
            PersonaContacto, 
            Trazabilidad
          ],
          synchronize: false,
          logging: configService.get('NODE_ENV') === 'development',
        };
      },
    }),

    TypeOrmModule.forFeature([
      Trazabilidad,    // ✅ Asegurar que está incluida
      ClienteFinal,       // ✅ Asegurar que está incluida
      Jefe,
      EmpresaProveedora, 
      Ejecutiva,
      PersonaContacto,
      AuditoriaCambios
    ]),
  ],
  controllers: [
    EjecutivasController,
    EmpresasController,
    JefeController,
    EjecutivaController,
    ClientesController,
    EmpresaDashboardController
  ],
  providers: [
    JefeService,
    JwtStrategy,
    JwtAuthGuard,
    EjecutivasService,
    EmpresasService,
    EjecutivaService,
    ClientesService,
    EmpresaDashboardService
 ],
})
export class AppModule { }

