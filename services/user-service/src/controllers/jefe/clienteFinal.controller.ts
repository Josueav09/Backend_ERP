import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Patch,
  Request
} from '@nestjs/common';
import { ClientesService } from '../../services/jefe/clientes.service';
import { JwtAuthGuard } from '../../../../../shared/guards/jwt-auth.guard';

@Controller('clientes')  // ✅ CAMBIADO: Agregar 'jefe/'
@UseGuards(JwtAuthGuard)
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) { }

  @Get()
  async findAll(@Request() req) {
    console.log('🚀 [ClientesController] === FINDALL INICIADO ===');
    console.log('📍 Ruta: /jefe/clientes');
    console.log('👤 Usuario:', req.user);

    try {
      console.log('🔄 Llamando a clientesService.findAll()...');
      const clientes = await this.clientesService.findAll();
      console.log(`✅ [ClientesController] ${clientes.length} clientes encontrados`);
      return clientes;
    } catch (error) {
      console.error('❌ [ClientesController] Error en findAll:', error);
      throw new HttpException(
        'Error al obtener clientes',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log('🔍 [ClientesController] GET /jefe/clientes/:id -', id);
    try {
      return await this.clientesService.findOne(parseInt(id));
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('❌ [ClientesController] Error en findOne:', error);
      throw new HttpException(
        'Error al obtener cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  async create(@Body() body: any) {
    console.log('➕ [ClientesController] POST /jefe/clientes -', body.razon_social);
    try {
      return await this.clientesService.create(body);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('❌ [ClientesController] Error en create:', error);
      throw new HttpException(
        error.message || 'Error al crear cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    console.log('📝 [ClientesController] PUT /jefe/clientes/:id -', id);
    try {
      return await this.clientesService.update(parseInt(id), body);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('❌ [ClientesController] Error en update:', error);
      throw new HttpException(
        'Error al actualizar cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * ✅ ACTIVAR CLIENTE
   */
  @Patch(':id/activate') // ✅ Ruta: PATCH /clientes/:id/activate
  async activate(@Param('id') id: string) {
    console.log('🔄 [ClientesController] PATCH /clientes/:id/activate -', id);
    try {
      return await this.clientesService.activate(parseInt(id));
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('❌ [ClientesController] Error en activate:', error);
      throw new HttpException(
        'Error al activar cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * ✅ DESACTIVAR CLIENTE
   */
  @Patch(':id/deactivate') // ✅ Ruta: PATCH /clientes/:id/deactivate
  async deactivate(@Param('id') id: string) {
    console.log('🔄 [ClientesController] PATCH /clientes/:id/deactivate -', id);
    try {
      return await this.clientesService.deactivate(parseInt(id));
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('❌ [ClientesController] Error en deactivate:', error);
      throw new HttpException(
        'Error al desactivar cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

}