import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller()
export class ApiGatewayController {
  constructor(private readonly httpService: HttpService) {}

  @Get('jefe/stats')
  async getJefeStats() {
    try {
      const response = await firstValueFrom(
        this.httpService.get('http://localhost:3002/jefe/stats')
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Error al obtener estadísticas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('jefe/auditoria')
  async getAuditoria() {
    try {
      const response = await firstValueFrom(
        this.httpService.get('http://localhost:3007/audit/contratos')
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Error al obtener auditoría', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('jefe/clientes')
  async getClientes() {
    try {
      const response = await firstValueFrom(
        this.httpService.get('http://localhost:3003/clientes')
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Error al obtener clientes', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('jefe/ejecutivas')
  async getEjecutivas() {
    try {
      const response = await firstValueFrom(
        this.httpService.get('http://localhost:3002/ejecutivas')
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Error al obtener ejecutivas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('jefe/empresas')
  async getEmpresas() {
    try {
      const response = await firstValueFrom(
        this.httpService.get('http://localhost:3002/empresas')
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Error al obtener empresas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('jefe/trazabilidad')
  async getTrazabilidad() {
    try {
      const response = await firstValueFrom(
        this.httpService.get('http://localhost:3007/trazabilidad')
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Error al obtener trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Agregar más rutas según necesites
}