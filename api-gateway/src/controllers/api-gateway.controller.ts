import { Body, Controller, Get, HttpException, HttpStatus, Post, Put, Query } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller()
export class ApiGatewayController {
  constructor(private readonly httpService: HttpService) { }


  // 🔐 RUTAS DE AUTENTICACIÓN
  @Get('auth/captcha')
  async getCaptcha() {
    try {
      const response = await firstValueFrom(
        this.httpService.get('http://localhost:3001/auth/captcha')
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Error al obtener captcha', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('auth/login')
  async login(@Body() body: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:3001/auth/login', body)
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Error en login', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('auth/verify-email')
  async verifyEmail(@Body() body: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:3001/auth/verify-email', body)
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Error en verificación', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('jefe/perfil')
  async getPerfil() {
    try {
      const response = await firstValueFrom(
        this.httpService.get('http://localhost:3002/jefe/perfil')
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Error al obtener perfil', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('jefe/perfil')
  async updatePerfil(@Body() body: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.put('http://localhost:3002/jefe/perfil', body)
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Error al actualizar perfil', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('jefe/password')
  async updatePassword(@Body() body: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.put('http://localhost:3002/jefe/password', body)
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Error al cambiar contraseña', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



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

  // 👤 RUTAS DEL CLIENTE - DASHBOARD
  @Get('cliente/dashboard/stats')
  async getClienteStats() {
    try {
      // Los parámetros vienen en la URL, no necesitas @Query
      const response = await firstValueFrom(
        this.httpService.get('http://localhost:3002/cliente/dashboard/stats')
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Error al obtener estadísticas del cliente', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 👤 RUTAS DEL CLIENTE - TRAZABILIDAD
  @Get('cliente/trazabilidad')
  async getClienteTrazabilidad() {
    try {
      const response = await firstValueFrom(
        this.httpService.get('http://localhost:3007/cliente/trazabilidad')
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Error al obtener trazabilidad del cliente', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('traceability/cliente/trazabilidad')
  async getTraceabilityClienteTrazabilidad() {
    try {
      const response = await firstValueFrom(
        this.httpService.get('http://localhost:3007/cliente/trazabilidad')
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Error al obtener trazabilidad del cliente', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ NUEVAS RUTAS PARA EJECUTIVA
  @Get('user-service/ejecutiva/stats')
  async getEjecutivaStats(@Query('ejecutivaId') ejecutivaId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3002/ejecutiva/stats?ejecutivaId=${ejecutivaId}`)
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Error al obtener estadísticas de ejecutiva', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('user-service/ejecutiva/empresas')
  async getEjecutivaEmpresas(@Query('ejecutivaId') ejecutivaId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3002/ejecutiva/empresas?ejecutivaId=${ejecutivaId}`)
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Error al obtener empresas de ejecutiva', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('user-service/ejecutiva/empresas')
  async createEjecutivaEmpresa(@Body() body: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:3002/ejecutiva/empresas', body)
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Error al crear empresa', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('user-service/ejecutiva/clientes')
  async getEjecutivaClientes(@Query('ejecutivaId') ejecutivaId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3002/ejecutiva/clientes?ejecutivaId=${ejecutivaId}`)
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Error al obtener clientes de ejecutiva', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('user-service/ejecutiva/clientes')
  async createEjecutivaCliente(@Body() body: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:3002/ejecutiva/clientes', body)
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Error al crear cliente', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('traceability-service/ejecutiva/trazabilidad')
  async getEjecutivaTrazabilidad(@Query('ejecutivaId') ejecutivaId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3007/ejecutiva/trazabilidad?ejecutivaId=${ejecutivaId}`)
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Error al obtener trazabilidad de ejecutiva', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('traceability-service/ejecutiva/trazabilidad')
  async createEjecutivaTrazabilidad(@Body() body: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:3007/ejecutiva/trazabilidad', body)
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Error al crear trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }




}