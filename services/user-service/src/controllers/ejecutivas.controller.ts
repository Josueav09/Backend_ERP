import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { EjecutivasService } from '../services/ejecutivas.service';

@Controller('ejecutivas')
export class EjecutivasController {
  constructor(private readonly ejecutivasService: EjecutivasService) {}

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
      const { nombre, apellido, email, telefono, password } = body;

      if (!nombre || !apellido || !email || !password) {
        throw new HttpException('Faltan campos requeridos', HttpStatus.BAD_REQUEST);
      }

      return await this.ejecutivasService.createEjecutiva(body);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al crear ejecutiva', HttpStatus.INTERNAL_SERVER_ERROR);
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
}