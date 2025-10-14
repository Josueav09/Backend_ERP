// backend/services/user-service/src/controllers/ejecutiva/ejecutiva.controller.ts
import { Controller, Get, Post, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { EjecutivaService } from '../../services/ejecutiva/ejecutiva.service';

@Controller('ejecutiva')
export class EjecutivaController {
  constructor(private readonly ejecutivaService: EjecutivaService) {}

  @Get('stats')
  async getStats(@Query('ejecutivaId') ejecutivaId: string) {
    if (!ejecutivaId) {
      throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaService.getStats(ejecutivaId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener estadísticas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('empresas')
  async getEmpresas(@Query('ejecutivaId') ejecutivaId: string) {
    if (!ejecutivaId) {
      throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaService.getEmpresas(ejecutivaId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener empresas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('empresas')
  async createEmpresa(@Body() body: any) {
    const { nombre_empresa, rut, direccion, telefono, email_contacto, ejecutivaId } = body;

    if (!ejecutivaId) {
      throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaService.createEmpresa({
        nombre_empresa,
        rut,
        direccion,
        telefono,
        email_contacto,
        ejecutivaId
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al crear empresa', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('clientes')
  async getClientes(@Query('ejecutivaId') ejecutivaId: string) {
    if (!ejecutivaId) {
      throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaService.getClientes(ejecutivaId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener clientes', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('clientes')
  async createCliente(@Body() body: any) {
    const { id_empresa, id_ejecutiva, nombre_cliente, rut_cliente, direccion, telefono, email } = body;

    if (!id_empresa || !id_ejecutiva) {
      throw new HttpException('Empresa y ejecutiva requeridos', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaService.createCliente({
        id_empresa,
        id_ejecutiva,
        nombre_cliente,
        rut_cliente,
        direccion,
        telefono,
        email
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al crear cliente', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}