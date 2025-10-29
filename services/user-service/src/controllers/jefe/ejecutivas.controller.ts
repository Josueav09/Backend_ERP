import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { EjecutivasService } from '../../services/jefe/ejecutivas.service';
import { JwtAuthGuard } from 'shared/guards/jwt-auth.guard';
import { IsNull } from 'typeorm';

@Controller('ejecutivas')
@UseGuards(JwtAuthGuard)
export class EjecutivasController {
  ejecutivaRepository: any;
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
  // En ejecutivas.controller.ts - ENDPOINT DE EMERGENCIA
  @Get('disponibles-simple')
  async getEjecutivasDisponiblesSimple() {
    try {
      console.log('🔍 [EjecutivasController] Endpoint simple para ejecutivas disponibles');

      const ejecutivas = await this.ejecutivaRepository.find({
        where: {
          estado_ejecutiva: 'Activo',
          id_empresa_prov: IsNull()
        },
        select: [
          'id_ejecutiva',
          'dni',
          'nombre_completo',
          'correo',
          'telefono',
          'linkedin',
          'estado_ejecutiva',
          'fecha_creacion'
        ],
        order: { nombre_completo: 'ASC' }
      });

      // ✅ DATOS BÁSICOS SIN ESTADÍSTICAS COMPLEJAS
      const resultado = ejecutivas.map(ej => {
        const nombreParts = ej.nombre_completo?.split(' ') || ['Ejecutiva', ''];

        return {
          id_ejecutiva: ej.id_ejecutiva,
          id_usuario: ej.id_ejecutiva,
          dni: ej.dni,
          nombre_completo: ej.nombre_completo,
          nombre: nombreParts[0] || 'Ejecutiva',
          apellido: nombreParts.slice(1).join(' ') || '',
          correo: ej.correo,
          email: ej.correo,
          telefono: ej.telefono,
          linkedin: ej.linkedin,
          estado_ejecutiva: ej.estado_ejecutiva,
          activo: true,
          total_empresas: 0,
          total_clientes: 0,
          total_actividades: 0,
          fecha_creacion: ej.fecha_creacion
        };
      });

      console.log('✅ [EjecutivasController] Ejecutivas simples retornadas:', resultado.length);
      return resultado;

    } catch (error) {
      console.error('❌ [EjecutivasController] Error en endpoint simple:', error);

      // ✅ SIEMPRE RETORNAR ARRAY, NUNCA ERROR
      return [];
    }
  }

}