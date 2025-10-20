import { Controller, Get, Post, Patch, Param, Body, HttpException, HttpStatus, Put } from '@nestjs/common';
import { EmpresasService } from '../../services/jefe/empresas.service';

@Controller('empresas') // ✅ Cambiar el controlador para usar prefijo jefe
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) { }

  @Get()
  async getEmpresas() {
    try {
      return await this.empresasService.getEmpresas();
    } catch (error) {
      throw new HttpException('Error al obtener empresas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async createEmpresa(@Body() body: any) {
    try {
      return await this.empresasService.createEmpresa(body);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al crear empresa', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id/estado')
  async updateEmpresaEstado(@Param('id') id: string, @Body() body: any) {
    try {
      const { activo } = body;
      if (typeof activo !== 'boolean') {
        throw new HttpException('El campo activo debe ser un booleano', HttpStatus.BAD_REQUEST);
      }
      return await this.empresasService.updateEmpresaEstado(parseInt(id), activo);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al actualizar estado de empresa', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // En EmpresasController.ts - agregar este endpoint
  @Put(':id')
  async updateEmpresa(
    @Param('id') id: string,
    @Body() data: any
  ) {
    return this.empresasService.updateEmpresa(Number.parseInt(id), data);
  }

  @Get(':id/ejecutivas')
  async getEmpresaEjecutivas(@Param('id') id: string) {
    try {
      return await this.empresasService.getEmpresaEjecutivas(parseInt(id));
    } catch (error) {
      throw new HttpException('Error al obtener ejecutivas de la empresa', HttpStatus.INTERNAL_SERVER_ERROR);
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

  @Post(':id/ejecutivas/:ejecutivaId/remove')
  async removeEjecutivaFromEmpresa(@Param('id') id: string, @Param('ejecutivaId') ejecutivaId: string) {
    try {
      return await this.empresasService.removeEjecutivaFromEmpresa(parseInt(id), parseInt(ejecutivaId));
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al remover ejecutiva', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}