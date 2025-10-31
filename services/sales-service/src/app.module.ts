import * as path from 'path';
import * as fs from 'fs';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesController } from './controllers/jefe/clientes.controller';
import { ClientesService } from './services/jefe/clientes.service';

// Entidades compartidas
import { ClienteFinal } from '../../../shared/entities/ClienteFinal.entity';
import { Ejecutiva } from '../../../shared/entities/Ejecutiva.entity';
import { EmpresaProveedora } from '../../../shared/entities/EmpresaProveedora.entity';
import { PersonaContacto } from '../../../shared/entities/PersonaContacto.entity';
import { Trazabilidad } from '../../../shared/entities/Trazabilidad.entity';
import { Jefe } from '../../../shared/entities/Jefe.entity'; // ✅ AGREGAR

const envPath = path.join(process.cwd(), 'services/sales-service/.env');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envPath,
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT') || 5432,
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [
            ClienteFinal,
            Ejecutiva,
            EmpresaProveedora,
            PersonaContacto,
            Trazabilidad,
            Jefe
          ],
          synchronize: false, 
          logging: configService.get('NODE_ENV') === 'development',
        };
      },
    }),

    TypeOrmModule.forFeature([
      ClienteFinal,
      Ejecutiva,
      EmpresaProveedora,
      PersonaContacto,
      Trazabilidad,
      Jefe
    ]),
  ],
  controllers: [ClientesController],
  providers: [ClientesService],
})
export class AppModule {}