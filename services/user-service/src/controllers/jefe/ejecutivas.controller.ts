import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { EjecutivasService } from '../../services/jefe/ejecutivas.service';
import { JwtAuthGuard } from 'shared/guards/jwt-auth.guard';

@Controller('ejecutivas')
  @UseGuards(JwtAuthGuard)
export class EjecutivasController {
  constructor(private readonly ejecutivasService: EjecutivasService) { }

  @Get()
  async getEjecutivas() {
    try {
      return await this.ejecutivasService.getEjecutivas();
    } catch (error) {
      throw new HttpException('Error al obtener ejecutivas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getEjecutiva(@Param('id') id: string) {
    try {
      const result = await this.ejecutivasService.getEjecutivaById(parseInt(id));
      if (!result) {
        throw new HttpException('Ejecutiva no encontrada', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener ejecutiva', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async createEjecutiva(@Body() body: any) {
    try {
      const { dni, nombre_completo, correo, contraseña, telefono } = body;

      if (!dni || !nombre_completo || !correo || !contraseña) {
        throw new HttpException('DNI, nombre completo, correo y contraseña son requeridos', HttpStatus.BAD_REQUEST);
      }

      return await this.ejecutivasService.createEjecutiva(body);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al crear ejecutiva', error);
    }
  }

  @Put(':id')
  async updateEjecutiva(@Param('id') id: string, @Body() body: any) {
    try {
      const result = await this.ejecutivasService.updateEjecutiva(parseInt(id), body);
      if (!result) {
        throw new HttpException('Ejecutiva no encontrada', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al actualizar ejecutiva', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deleteEjecutiva(@Param('id') id: string) {
    try {
      const result = await this.ejecutivasService.deleteEjecutiva(parseInt(id));
      if (!result) {
        throw new HttpException('Ejecutiva no encontrada', HttpStatus.NOT_FOUND);
      }
      return { message: 'Ejecutiva desactivada correctamente' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al desactivar ejecutiva', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // En ejecutivas.controller.ts - VERSIÓN CORREGIDA
  @Get('disponibles')

  async getEjecutivasDisponibles() {
    try {
      console.log('🔍 [EjecutivasController] Obteniendo ejecutivas disponibles');
      const resultado = await this.ejecutivasService.getEjecutivasDisponibles();
      console.log('✅ [EjecutivasController] Ejecutivas disponibles encontradas:', resultado.length);
      return resultado;
    } catch (error) {
      console.error('❌ [EjecutivasController] Error obteniendo ejecutivas disponibles:', error);
      throw new HttpException(
        {
          message: 'Error al obtener ejecutivas disponibles',
          error: error.message,
          timestamp: new Date().toISOString()
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

}