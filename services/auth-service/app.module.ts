
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as path from 'path';
import * as fs from 'fs';
import { AuthModule } from './src/auth/auth.module';
import { UsersModule } from './src/users/user.module';
import { EmailModule } from './src/email/email.module';

// Encontrar el archivo .env correctamente
const envPath = path.join(process.cwd(), 'services/auth-service/.env');
console.log('🔧 Loading env from:', envPath);
console.log('🔧 Env file exists:', fs.existsSync(envPath));

@Module({
  imports: [
    // 🔧 Configuración CORREGIDA
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envPath,
    }),

    // 🗄️ PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log('=== DATABASE CONFIG DEBUG ===');
        console.log('DB_HOST:', configService.get('DB_HOST'));
        console.log('DB_PORT:', configService.get('DB_PORT'));
        console.log('DB_USERNAME:', configService.get('DB_USERNAME'));
        console.log('DB_PASSWORD:', configService.get('DB_PASSWORD'));
        console.log('DB_DATABASE:', configService.get('DB_DATABASE'));
        console.log('=============================');

        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false,
          logging: configService.get('NODE_ENV') === 'development',
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
    UsersModule,
    EmailModule,
  ],
})
export class AppModule {}