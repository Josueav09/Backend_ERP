import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ClientesService } from '../../services/jefe/clientes.service';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  async getClientes() {
    try {
      return await this.clientesService.getClientes();
    } catch (error) {
      throw new HttpException('Error al obtener clientes', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getCliente(@Param('id') id: string) {
    try {
      const result = await this.clientesService.getClienteById(parseInt(id));
      if (!result) {
        throw new HttpException('Cliente no encontrado', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new HttpException('Error al obtener cliente', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async createCliente(@Body() body: any) {
    try {
      return await this.clientesService.createCliente(body);
    } catch (error) {
      throw new HttpException('Error al crear cliente', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async updateCliente(@Param('id') id: string, @Body() body: any) {
    try {
      const result = await this.clientesService.updateCliente(parseInt(id), body);
      if (!result) {
        throw new HttpException('Cliente no encontrado', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new HttpException('Error al actualizar cliente', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deleteCliente(@Param('id') id: string) {
    try {
      const result = await this.clientesService.deleteCliente(parseInt(id));
      if (!result) {
        throw new HttpException('Cliente no encontrado', HttpStatus.NOT_FOUND);
      }
      return { message: "Cliente desactivado exitosamente" };
    } catch (error) {
      throw new HttpException('Error al desactivar cliente', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}