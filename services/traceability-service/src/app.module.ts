import { Module } from '@nestjs/common';
import { AuditController } from './controllers/jefe/audit.controller';
import { TrazabilidadController } from './controllers/jefe/trazabilidad.controller';
import { AuditService } from './services/jefe/audit.service';
import { TrazabilidadService } from './services/jefe/trazabilidad.service';
import { ClienteTrazabilidadController } from './controllers/cliente/traceability.controller';
import { ClienteTrazabilidadService } from './services/cliente/traceability.service';
import { EjecutivaTraceabilityController} from './controllers/ejecutiva/ejecutiva.controller';
import { EjecutivaTraceabilityService} from './services/ejecutiva/ejecutiva.service';

@Module({
  imports: [],
  controllers: [AuditController, TrazabilidadController, ClienteTrazabilidadController, EjecutivaTraceabilityController],
  providers: [AuditService, TrazabilidadService, ClienteTrazabilidadService, EjecutivaTraceabilityService],
})
export class AppModule {}