import { Module } from '@nestjs/common';
import { EjecutivasController } from './controllers/ejecutivas.controller';
import { EmpresasController } from './controllers/empresas.controller';
import { JefeController } from './controllers/jefe.controller';
import { EjecutivasService } from './services/ejecutivas.service';
import { EmpresasService } from './services/empresas.service';
import { JefeService } from './services/jefe.service';

@Module({
  imports: [],
  controllers: [EjecutivasController, EmpresasController, JefeController],
  providers: [EjecutivasService, EmpresasService, JefeService],
})
export class AppModule {}