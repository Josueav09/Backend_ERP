// backend/services/auth-service/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as path from 'path';
import * as fs from 'fs';

// Importar entidades compartidas
import { Jefe } from '../../../shared/entities/Jefe.entity';
import { EmpresaProveedora } from '../../../shared/entities/EmpresaProveedora.entity';
import { Ejecutiva } from '../../../shared/entities/Ejecutiva.entity';
import { ClienteFinal } from '../../../shared/entities/ClienteFinal.entity';
import { PersonaContacto } from '../../../shared/entities/PersonaContacto.entity';
import { Trazabilidad } from '../../../shared/entities/Trazabilidad.entity';
import { AuditoriaCambios } from '../../../shared/entities/AuditoriaCambios.entity';

import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';

const envPath = path.join(process.cwd(), 'services/auth-service/.env');

@Module({ 
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envPath,
    }),

    // 🗄️ PostgreSQL CON ENTIDADES COMPARTIDAS
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          
                    synchronize: false, // ✅ Mantener en false, usar migraciones


          // ✅ ENTIDADES ACTUALIZADAS - incluir todas las entidades
          entities: [
            Jefe,
            EmpresaProveedora,
            Ejecutiva,
            ClienteFinal,
            PersonaContacto,
            Trazabilidad,
            AuditoriaCambios
          ],
          
          logging: configService.get('NODE_ENV') === 'development',
          
          // ✅ Opcional: Configuración extra para producción
          extra: {
            max: 20, // máximo de conexiones en pool
            connectionTimeoutMillis: 10000,
          }
        };
      },
    }),

    // 🔐 JWT Global
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),

    // 🛡️ Passport
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // 📦 Módulos
    AuthModule,
    EmailModule,
  ],
})
export class AppModule {}