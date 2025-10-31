// backend/services/auth-service/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

// ✅ IMPORTAR LAS ENTIDADES
import { Jefe } from '../../../../shared/entities/Jefe.entity';
import { EmpresaProveedora } from '../../../../shared/entities/EmpresaProveedora.entity';
import { Ejecutiva } from '../../../../shared/entities/Ejecutiva.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailModule } from '../email/email.module';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { ClienteFinal } from 'shared/entities/ClienteFinal.entity';
import { PersonaContacto } from 'shared/entities/PersonaContacto.entity';
import { Trazabilidad } from 'shared/entities/Trazabilidad.entity';
import { AuditoriaCambios } from 'shared/entities/AuditoriaCambios.entity';

// AGREGAR ESTO AL INICIO del archivo donde configuras TypeORM
console.log('=== TYPEORM CONFIG DEBUG ===');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_DATABASE:', process.env.DB_NAME);
console.log('Using user:', process.env.DB_USER);
console.log('=============================');
@Module({
  imports: [
    // ✅ REGISTRAR TODAS LAS ENTIDADES QUE SE USAN
    TypeOrmModule.forFeature([
      Trazabilidad,    // ✅ Asegurar que está incluida
      ClienteFinal,       // ✅ Asegurar que está incluida
      Jefe,
      EmpresaProveedora, 
      Ejecutiva,
      PersonaContacto,
      AuditoriaCambios
    ]),
    
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}