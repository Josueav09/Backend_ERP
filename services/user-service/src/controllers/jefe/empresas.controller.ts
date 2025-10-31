import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  HttpException,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { EmpresasService } from '../../services/jefe/empresas.service';
import { JwtAuthGuard } from '../../../../../shared/guards/jwt-auth.guard';

@Controller('empresas')
@UseGuards(JwtAuthGuard)
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) { }

  @Get()
  async getEmpresas() {
    try {
      return await this.empresasService.getEmpresas();
    } catch (error) {
      throw new HttpException(
        'Error al obtener empresas',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id/ejecutivas')
  async getEmpresaEjecutivas(@Param('id') id: string) {
    try {
      return await this.empresasService.getEmpresaEjecutivas(parseInt(id));
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error al obtener ejecutivas de la empresa',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  async createEmpresa(@Body() body: any) {
    try {
      return await this.empresasService.createEmpresa(body);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error.message || 'Error al crear empresa',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id')
  async updateEmpresa(@Param('id') id: string, @Body() data: any) {
    try {
      return await this.empresasService.updateEmpresa(parseInt(id), data);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error.message || 'Error al actualizar empresa',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':id/estado')
  async updateEmpresaEstado(@Param('id') id: string, @Body() body: any) {
    try {
      const { activo } = body;
      if (typeof activo !== 'boolean') {
        throw new HttpException(
          'El campo activo debe ser un booleano',
          HttpStatus.BAD_REQUEST
        );
      }
      return await this.empresasService.updateEmpresaEstado(parseInt(id), activo);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error al actualizar estado de empresa',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


  @Post(':id/ejecutivas')
  async addEjecutivaToEmpresa(@Param('id') id: string, @Body() body: any) {
    try {
      const { id_ejecutiva } = body;
      if (!id_ejecutiva) {
        throw new HttpException('ID de ejecutiva es requerido', HttpStatus.BAD_REQUEST);
      }
      return await this.empresasService.addEjecutivaToEmpresa(parseInt(id), parseInt(id_ejecutiva));
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al agregar ejecutiva', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // En EmpresasController.ts - VERIFICAR QUE EXISTA
  @Delete(':empresaId/ejecutivas/:ejecutivaId')
  async removeEjecutivaFromEmpresa(
    @Param('empresaId') empresaId: string,
    @Param('ejecutivaId') ejecutivaId: string
  ) {
    try {
      return await this.empresasService.removeEjecutivaFromEmpresa(
        parseInt(empresaId), 
        parseInt(ejecutivaId)
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error al remover ejecutiva',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // En empresas.controller.ts (puerto 3002)
  @Put(':id/asignar-ejecutiva')
  async asignarEjecutivaAEmpresa(
    @Param('id') id: string,
    @Body() body: { id_ejecutiva: number }
  ) {
    try {
      return await this.empresasService.asignarEjecutivaAEmpresa(parseInt(id), body.id_ejecutiva);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al asignar ejecutiva',
        HttpStatus.BAD_REQUEST
      );
    }
  }
  // En EmpresasController.ts - AGREGAR ESTE ENDPOINT NUEVO
  @Get('ejecutivas/disponibles')
  async getEjecutivasDisponibles() {
    try {
      return await this.empresasService.getEjecutivasDisponibles();
    } catch (error) {
      throw new HttpException(
        'Error al obtener ejecutivas disponibles',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

}