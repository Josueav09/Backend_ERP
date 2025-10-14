import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ClienteDashboardService } from '../../services/cliente/dashboard.service';

@Controller('cliente/dashboard')
export class ClienteDashboardController {
  constructor(private readonly dashboardService: ClienteDashboardService) {}

  @Get('stats')
  async getStats(@Query('clienteUsuarioId') clienteUsuarioId: string) {
    try {
      if (!clienteUsuarioId) {
        throw new HttpException('ID de cliente requerido', HttpStatus.BAD_REQUEST);
      }
      return await this.dashboardService.getStats(clienteUsuarioId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener estadísticas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}