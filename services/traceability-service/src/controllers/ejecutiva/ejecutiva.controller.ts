// backend/services/traceability-service/src/controllers/ejecutiva/ejecutiva.controller.ts
import { Controller, Get, Post, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { EjecutivaTraceabilityService } from '../../services/ejecutiva/ejecutiva.service';

@Controller('ejecutiva')
export class EjecutivaTraceabilityController {
  constructor(private readonly ejecutivaTraceabilityService: EjecutivaTraceabilityService) {}

  @Get('trazabilidad')
  async getTrazabilidad(@Query('ejecutivaId') ejecutivaId: string) {
    if (!ejecutivaId) {
      throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaTraceabilityService.getTrazabilidad(ejecutivaId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('trazabilidad')
  async createTrazabilidad(@Body() body: any) {
    const { id_ejecutiva, id_empresa, id_cliente, tipo_actividad, descripcion, estado, notas } = body;

    if (!id_ejecutiva || !id_empresa) {
      throw new HttpException('Ejecutiva y empresa requeridos', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaTraceabilityService.createTrazabilidad({
        id_ejecutiva,
        id_empresa,
        id_cliente,
        tipo_actividad,
        descripcion,
        estado,
        notas,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al crear trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}