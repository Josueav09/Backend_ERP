import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ClienteTrazabilidadService } from '../../services/cliente/traceability.service';

@Controller('cliente/trazabilidad')
export class ClienteTrazabilidadController {
  constructor(private readonly trazabilidadService: ClienteTrazabilidadService) {}

  @Get()
  async getTrazabilidad(@Query('clienteUsuarioId') clienteUsuarioId: string) {
    try {
      if (!clienteUsuarioId) {
        throw new HttpException('ID de cliente requerido', HttpStatus.BAD_REQUEST);
      }
      return await this.trazabilidadService.getTrazabilidadByCliente(clienteUsuarioId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}