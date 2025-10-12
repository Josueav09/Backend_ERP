import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AuditService } from '../services/audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('contratos')
  async getAuditoriaContratos() {
    try {
      return await this.auditService.getAuditoriaContratos();
    } catch (error) {
      throw new HttpException('Error al obtener auditoría', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}