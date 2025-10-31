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

    // 🗄 PostgreSQL CON ENTIDADES COMPARTIDAS - CONFIGURACIÓN CORREGIDA
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = {
          type: 'postgres' as const,
          // ✅ NOMBRES CORREGIDOS - usar los mismos que en docker-compose.yml
          host: configService.get('DB_HOST'),
          port: parseInt(configService.get('DB_PORT') || '5432'),
          username: configService.get('DB_USER'),        // ✅ CORREGIDO: 'DB_USER'
          password: configService.get('DB_PASSWORD'),    // ✅ CORREGIDO: 'DB_PASSWORD'
          database: configService.get('DB_NAME'),        // ✅ CORREGIDO: 'DB_NAME'

          synchronize: false,

          // ✅ ENTIDADES ACTUALIZADAS
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

          // ✅ SSL PARA AZURE
          ssl: configService.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,

          // ✅ Configuración extra
          extra: {
            max: 20,
            connectionTimeoutMillis: 10000,
          }
        };

        console.log('=== FINAL TYPEORM CONFIG ===');
        console.log('TypeORM username:', dbConfig.username);
        console.log('TypeORM host:', dbConfig.host);
        console.log('TypeORM database:', dbConfig.database);
        console.log('=============================');

        return dbConfig;
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

    // 🛡 Passport
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // 📦 Módulos
    AuthModule,
    EmailModule,
  ],
})
export class AppModule { }