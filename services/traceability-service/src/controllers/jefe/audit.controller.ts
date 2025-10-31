import { 
  Controller, 
  Get, 
  Query, 
  HttpException, 
  HttpStatus,
  UseGuards,
  Request
} from '@nestjs/common';
import { AuditService } from '../../services/jefe/audit.service';
import { JwtAuthGuard } from '../../../../../shared/guards/jwt-auth.guard';

@Controller('auditoria')
@UseGuards(JwtAuthGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('contratos')
  async getAuditoriaContratos(
    @Request() req,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('accion') accion?: string,
    @Query('usuario') usuario?: string
  ) {
    try {
      // Solo jefe puede ver auditoría
      if (req.user.userType !== 'jefe') {
        throw new HttpException('No autorizado para ver auditoría', HttpStatus.FORBIDDEN);
      }

      const filters = { fechaInicio, fechaFin, accion, usuario };
      return await this.auditService.getAuditoriaContratos(filters);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener auditoría', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('estadisticas')
  async getEstadisticasAuditoria(@Request() req) {
    try {
      
      // Solo jefe puede ver estadísticas de auditoría
      if (req.user.userType !== 'jefe') {
        throw new HttpException('No autorizado para ver estadísticas de auditoría', HttpStatus.FORBIDDEN);
      }

      return await this.auditService.getEstadisticasAuditoria();
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener estadísticas de auditoría', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('resumen-mensual')
  async getAuditoriaResumenMensual(@Request() req) {
    try {
      
      // Solo jefe puede ver resumen mensual
      if (req.user.userType !== 'jefe') {
        throw new HttpException('No autorizado para ver resumen mensual', HttpStatus.FORBIDDEN);
      }

      return await this.auditService.getAuditoriaResumenMensual();
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener resumen mensual', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}