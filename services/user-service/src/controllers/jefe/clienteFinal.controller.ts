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
    try {
      const clientes = await this.clientesService.findAll();
      return clientes;
    } catch (error) {
      throw new HttpException(
        'Error al obtener clientes',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.clientesService.findOne(parseInt(id));
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error al obtener cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  async create(@Body() body: any) {
    try {
      return await this.clientesService.create(body);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error.message || 'Error al crear cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    try {
      return await this.clientesService.update(parseInt(id), body);
    } catch (error) {
      if (error instanceof HttpException) throw error;
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
    try {
      return await this.clientesService.activate(parseInt(id));
    } catch (error) {
      if (error instanceof HttpException) throw error;
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
    try {
      return await this.clientesService.deactivate(parseInt(id));
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error al desactivar cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

}