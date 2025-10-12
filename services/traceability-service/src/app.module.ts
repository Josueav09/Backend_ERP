import { Module } from '@nestjs/common';
import { AuditController } from './controllers/audit.controller';
import { TrazabilidadController } from './controllers/trazabilidad.controller';
import { AuditService } from './services/audit.service';
import { TrazabilidadService } from './services/trazabilidad.service';

@Module({
  imports: [],
  controllers: [AuditController, TrazabilidadController],
  providers: [AuditService, TrazabilidadService],
})
export class AppModule {}