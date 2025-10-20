
// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import * as path from 'path';
// import * as fs from 'fs';
// import { AuthModule } from './src/auth/auth.module';
// import { UsersModule } from './src/users/user.module';
// import { EmailModule } from './src/email/email.module';

// // Encontrar el archivo .env correctamente
// const envPath = path.join(process.cwd(), 'services/auth-service/.env');
// console.log('🔧 Loading env from:', envPath);
// console.log('🔧 Env file exists:', fs.existsSync(envPath));

// @Module({
//   imports: [
//     // 🔧 Configuración CORREGIDA
//     ConfigModule.forRoot({
//       isGlobal: true,
//       envFilePath: envPath,
//     }),

//     // 🗄️ PostgreSQL
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => {
//         console.log('=== DATABASE CONFIG DEBUG ===');
//         console.log('DB_HOST:', configService.get('DB_HOST'));
//         console.log('DB_PORT:', configService.get('DB_PORT'));
//         console.log('DB_USERNAME:', configService.get('DB_USERNAME'));
//         console.log('DB_PASSWORD:', configService.get('DB_PASSWORD'));
//         console.log('DB_DATABASE:', configService.get('DB_DATABASE'));
//         console.log('=============================');

//         return {
//           type: 'postgres',
//           host: configService.get('DB_HOST'),
//           port: configService.get('DB_PORT'),
//           username: configService.get('DB_USERNAME'),
//           password: configService.get('DB_PASSWORD'),
//           database: configService.get('DB_DATABASE'),
//           entities: [__dirname + '/**/*.entity{.ts,.js}'],
//           synchronize: false,
//           logging: configService.get('NODE_ENV') === 'development',
//         };
//       },
//     }),

//     // 🔐 JWT Global
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => ({
//         secret: configService.get('JWT_SECRET'),
//         signOptions: { expiresIn: '24h' },
//       }),
//     }),

//     // 🛡️ Passport
//     PassportModule.register({ defaultStrategy: 'jwt' }),

//     // 📦 Módulos
//     AuthModule,
//     UsersModule,
//     EmailModule,
//   ],
// })
// export class AppModule {}


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
console.log('🔧 Loading env from:', envPath);
console.log('🔧 Env file exists:', fs.existsSync(envPath));

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
        console.log('=== DATABASE CONFIG DEBUG ===');
        console.log('DB_HOST:', configService.get('DB_HOST'));
        console.log('DB_PASSWORD:', configService.get('DB_PASSWORD') ? '***' : 'undefined');
        console.log('DB_DATABASE:', configService.get('DB_DATABASE'));
        console.log('=============================');

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