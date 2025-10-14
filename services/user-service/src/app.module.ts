import { Module } from '@nestjs/common';
import { EjecutivasController } from './controllers/jefe/ejecutivas.controller';
import { EmpresasController } from './controllers/jefe/empresas.controller';
import { JefeController } from './controllers/jefe/jefe.controller';
import { EjecutivasService } from './services/jefe/ejecutivas.service';
import { EmpresasService } from './services/jefe/empresas.service';
import { JefeService } from './services/jefe/jefe.service';
import { ClienteDashboardController } from './controllers/cliente/dashboard.controller';
import { ClienteDashboardService } from './services/cliente/dashboard.service';
import {EjecutivaController} from './controllers/ejecutiva/ejecutiva.controller';
import {EjecutivaService} from './services/ejecutiva/ejecutiva.service';

@Module({
  imports: [],
  controllers: [EjecutivasController, EmpresasController, JefeController, ClienteDashboardController, EjecutivaController],
  providers: [EjecutivasService, EmpresasService, JefeService, ClienteDashboardService, EjecutivaService],
})
export class AppModule {}