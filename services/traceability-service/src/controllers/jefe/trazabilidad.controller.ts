import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { TrazabilidadService } from '../../services/jefe/trazabilidad.service';

@Controller('trazabilidad')
export class TrazabilidadController {
  constructor(private readonly trazabilidadService: TrazabilidadService) {}

  @Get()
  async getTrazabilidad(
    @Query('empresa') empresaId?: string,
    @Query('ejecutiva') ejecutivaId?: string,
    @Query('cliente') clienteId?: string
  ) {
    try {
      return await this.trazabilidadService.getTrazabilidad(empresaId, ejecutivaId, clienteId);
    } catch (error) {
      throw new HttpException('Error al obtener trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}