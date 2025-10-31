import { Body, Controller, Get, HttpException, HttpStatus, Post, Put, Delete, Param, Query, Req, Patch, UseInterceptors, UploadedFile, Res, Headers } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';

@Controller()
export class ApiGatewayController {
  constructor(private readonly httpService: HttpService) { }

  // 🔐 FUNCIÓN AUXILIAR PARA PROPAGAR HEADERS
  private getHeadersWithAuth(req?: Request) {
    const headers: any = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // ✅ PROPAGAR HEADER AUTHORIZATION CRÍTICO
    if (req?.headers?.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }

    // Propagar otros headers si es necesario
    if (req?.headers && req.headers['user-agent']) {
      headers['User-Agent'] = req.headers['user-agent'];
    }

    return headers;
  }

  // 🔧 FUNCIÓN AUXILIAR PARA URLs DINÁMICAS
  private getServiceBaseUrl(service: string): string {
    // Detectar si estamos en Docker
    const isDocker = process.env.NODE_ENV === 'production' ||
      fs.existsSync('/.dockerenv') ||
      process.env.COMPOSE_PROJECT_NAME !== undefined;

    const services = {
      auth: isDocker ? 'http://auth-service:3001' : 'http://localhost:3001',
      user: isDocker ? 'http://user-service:3002' : 'http://localhost:3002',
      sales: isDocker ? 'http://sales-service:3003' : 'http://localhost:3003',
      traceability: isDocker ? 'http://traceability-service:3007' : 'http://localhost:3007'
    };

    return services[service];
  }

  // 🔐 =====================================================
  // AUTH SERVICE (Puerto 3001)
  // =====================================================

  @Get('auth/captcha')
  async getCaptcha(@Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const authUrl = this.getServiceBaseUrl('auth');
      const response = await firstValueFrom(
        this.httpService.get(`${authUrl}/auth/captcha`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener captcha',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('auth/login')
  async login(@Body() body: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const authUrl = this.getServiceBaseUrl('auth');
      const response = await firstValueFrom(
        this.httpService.post(`${authUrl}/auth/login`, body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error en login',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('auth/verify-email')
  async verifyEmail(@Body() body: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const authUrl = this.getServiceBaseUrl('auth');
      const response = await firstValueFrom(
        this.httpService.post(`${authUrl}/auth/verify-email`, body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error en verificación',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('auth/logout')
  async logout(@Body() body: any, @Req() req: Request, @Headers() headers: any) {
    try {
      // Pasar el header de autorización al servicio de auth
      const authHeaders = {
        ...this.getHeadersWithAuth(req),
        'Content-Type': 'application/json'
      };

      const authUrl = this.getServiceBaseUrl('auth');
      const response = await firstValueFrom(
        this.httpService.post(`${authUrl}/auth/logout`, body, {
          headers: authHeaders
        })
      );

      return response.data;
    } catch (error) {

      // ✅ IMPORTANTE: Siempre retornar éxito para permitir limpieza del frontend
      return {
        success: true,
        message: 'Sesión cerrada exitosamente'
      };
    }
  }

  // 👔 =====================================================
  // JEFE - USER SERVICE (Puerto 3002)
  // =====================================================

  @Get('jefe/perfil')
  async getJefePerfil(@Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);

      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/jefe/perfil`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener perfil',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('jefe/perfil')
  async updateJefePerfil(@Body() body: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.put(`${userUrl}/jefe/perfil`, body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al actualizar perfil',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('jefe/password')
  async updateJefePassword(@Body() body: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.put(`${userUrl}/jefe/password`, body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al cambiar contraseña',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/stats')
  async getJefeStats(@Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/jefe/stats`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener estadísticas',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // 👔 =====================================================
  // JEFE - EJECUTIVAS (User Service)
  // =====================================================

  @Get('jefe/ejecutivas')
  async getJefeEjecutivas(@Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/ejecutivas`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener ejecutivas',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/ejecutivas/:id')
  async getJefeEjecutiva(@Param('id') id: string, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/ejecutivas/${id}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener ejecutiva',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('jefe/ejecutivas')
  async createJefeEjecutiva(@Body() body: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.post(`${userUrl}/ejecutivas`, body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al crear ejecutiva',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('jefe/ejecutivas/:id')
  async updateJefeEjecutiva(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.put(`${userUrl}/ejecutivas/${id}`, body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al actualizar ejecutiva',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('jefe/ejecutivas/:id')
  async deleteJefeEjecutiva(@Param('id') id: string, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.delete(`${userUrl}/ejecutivas/${id}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al eliminar ejecutiva',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/ejecutivas/disponibles')
  async getJefeEjecutivasDisponibles(@Req() req: Request) {
    try {

      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');

      // ✅ VERIFICAR QUE LA URL SEA CORRECTA
      const url = `${userUrl}/ejecutivas/disponibles`;


      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers,
          timeout: 10000
        })
      );


      return response.data;

    } catch (error) {

      // ✅ RETORNAR ARRAY VACÍO EN CASO DE ERROR
      if (error.response?.status === 404 || error.response?.status === 500) {
        return [];
      }

      throw new HttpException(
        error.response?.data || 'Error interno del servidor',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // 👔 =====================================================
  // JEFE - EMPRESAS PROVEEDORAS (User Service)
  // =====================================================

  @Get('jefe/empresas')
  async getJefeEmpresas(@Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/empresas`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener empresas',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/empresas/:id')
  async getJefeEmpresa(@Param('id') id: string, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/empresas/${id}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener empresa',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('jefe/empresas')
  async createJefeEmpresa(@Body() body: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.post(`${userUrl}/empresas`, body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al crear empresa',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('jefe/empresas/:id')
  async updateJefeEmpresa(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.put(`${userUrl}/empresas/${id}`, body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al actualizar empresa',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch('jefe/empresas/:id/estado')
  async updateJefeEmpresaEstado(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.patch(`${userUrl}/empresas/${id}/estado`, body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al actualizar estado',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/empresas/:id/ejecutivas')
  async getJefeEmpresaEjecutivas(@Param('id') id: string, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/empresas/${id}/ejecutivas`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener ejecutivas de empresa',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('jefe/empresas/:id/ejecutivas')
  async addJefeEmpresaEjecutiva(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.post(`${userUrl}/empresas/${id}/ejecutivas`, body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al asignar ejecutiva',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('jefe/empresas/:empresaId/ejecutivas/:ejecutivaId')
  async removeJefeEmpresaEjecutiva(
    @Param('empresaId') empresaId: string,
    @Param('ejecutivaId') ejecutivaId: string,
    @Req() req: Request
  ) {
    try {

      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');

      // ✅ Apuntar al servicio correcto
      const url = `${userUrl}/empresas/${empresaId}/ejecutivas/${ejecutivaId}`;


      const response = await firstValueFrom(
        this.httpService.delete(url, { headers })
      );

      return response.data;

    } catch (error) {

      throw new HttpException(
        error.response?.data?.message || 'Error al remover ejecutiva',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('jefe/empresas/:id/asignar-ejecutiva')
  async asignarEjecutivaAEmpresa(
    @Param('id') id: string,
    @Body() body: { id_ejecutiva: number },
    @Req() req: Request
  ) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.put(
          `${userUrl}/empresas/${id}/asignar-ejecutiva`,
          body,
          { headers }
        )
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al asignar ejecutiva',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/empresas/ejecutivas/disponibles')
  async getJefeEmpresasEjecutivasDisponibles(@Req() req: Request) {
    try {

      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');

      // ✅ Apuntar al servicio correcto
      const url = `${userUrl}/empresas/ejecutivas/disponibles`;


      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers,
          timeout: 10000
        })
      );

      return response.data;

    } catch (error) {

      // ✅ RETORNAR ARRAY VACÍO EN CASO DE ERROR
      if (error.response?.status === 404 || error.response?.status === 500) {
        return [];
      }

      throw new HttpException(
        error.response?.data || 'Error interno del servidor',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // 👔 =====================================================
  // JEFE - CLIENTES FINALES (Sales Service - Puerto 3003)
  // =====================================================

  @Get('jefe/clientes')
  async getJefeClientes(@Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const salesUrl = this.getServiceBaseUrl('sales');
      const response = await firstValueFrom(
        this.httpService.get(`${salesUrl}/clientes`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener clientes',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/clientes/:id')
  async getJefeCliente(@Param('id') id: string, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const salesUrl = this.getServiceBaseUrl('sales');
      const response = await firstValueFrom(
        this.httpService.get(`${salesUrl}/clientes/${id}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener cliente',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('jefe/clientes')
  async createJefeCliente(@Body() body: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const salesUrl = this.getServiceBaseUrl('sales');
      const response = await firstValueFrom(
        this.httpService.post(`${salesUrl}/clientes`, body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al crear cliente',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('jefe/clientes/:id')
  async updateJefeCliente(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const salesUrl = this.getServiceBaseUrl('sales');
      const response = await firstValueFrom(
        this.httpService.put(`${salesUrl}/clientes/${id}`, body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al actualizar cliente',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch('jefe/clientes/:id/activate')
  async activateJefeCliente(@Param('id') id: string, @Req() req: Request) {
    try {

      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.patch(
          `${userUrl}/clientes/${id}/activate`,
          {}, // body vacío
          { headers }
        )
      );

      return response.data;

    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al activar cliente',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch('jefe/clientes/:id/deactivate')
  async deactivateJefeCliente(@Param('id') id: string, @Req() req: Request) {
    try {

      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.patch(
          `${userUrl}/clientes/${id}/deactivate`,
          {}, // body vacío
          { headers }
        )
      );

      return response.data;

    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al desactivar cliente',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // 👔 =====================================================
  // JEFE - TRAZABILIDAD (Traceability Service)
  // =====================================================

  @Get('jefe/trazabilidad')
  async getJefeTrazabilidad(
    @Query('empresa') empresaId?: string,
    @Query('ejecutiva') ejecutivaId?: string,
    @Query('cliente') clienteId?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('tipoContacto') tipoContacto?: string,
    @Query('etapaOportunidad') etapaOportunidad?: string,
    @Query('etapa') etapa?: string,
    @Req() req?: Request
  ) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      let url = `${traceabilityUrl}/jefe/trazabilidad?`;

      const params = new URLSearchParams();
      if (empresaId) params.append('empresa', empresaId);
      if (ejecutivaId) params.append('ejecutiva', ejecutivaId);
      if (clienteId) params.append('cliente', clienteId);
      if (fechaInicio) params.append('fechaInicio', fechaInicio);
      if (fechaFin) params.append('fechaFin', fechaFin);
      if (tipoContacto) params.append('tipoContacto', tipoContacto);
      if (etapaOportunidad) params.append('etapaOportunidad', etapaOportunidad);
      if (etapa) params.append('etapa', etapa);

      url += params.toString();

      const response = await firstValueFrom(
        this.httpService.get(url, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener trazabilidad',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/trazabilidad/dashboard')
  async getJefeTrazabilidadDashboard(@Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      const response = await firstValueFrom(
        this.httpService.get(`${traceabilityUrl}/jefe/trazabilidad/dashboard`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener dashboard de trazabilidad',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/trazabilidad/estadisticas-etapas')
  async getJefeEstadisticasEtapas(
    @Query('empresa') empresaId?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Req() req?: Request
  ) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      let url = `${traceabilityUrl}/jefe/trazabilidad/estadisticas-etapas?`;

      if (empresaId) url += `empresa=${empresaId}&`;
      if (fechaInicio) url += `fechaInicio=${fechaInicio}&`;
      if (fechaFin) url += `fechaFin=${fechaFin}&`;

      const response = await firstValueFrom(
        this.httpService.get(url, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener estadísticas por etapa',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('jefe/trazabilidad')
  async createJefeTrazabilidad(@Body() body: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      const response = await firstValueFrom(
        this.httpService.post(`${traceabilityUrl}/jefe/trazabilidad`, body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al crear trazabilidad',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('jefe/trazabilidad/:id')
  async updateJefeTrazabilidad(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: Request
  ) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      const response = await firstValueFrom(
        this.httpService.put(`${traceabilityUrl}/jefe/trazabilidad/${id}`, body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al actualizar trazabilidad',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ============================================
  // NUEVOS ENDPOINTS PARA KPIs Y GRÁFICOS
  // ============================================

  @Get('jefe/trazabilidad/kpis')
  async getJefeTrazabilidadKPIs(
    @Query('ejecutivaId') ejecutivaId?: string,
    @Query('empresaId') empresaId?: string,
    @Query('clienteId') clienteId?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Req() req?: Request
  ) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      let url = `${traceabilityUrl}/jefe/trazabilidad/kpis?`;

      const params = new URLSearchParams();
      if (ejecutivaId) params.append('ejecutivaId', ejecutivaId);
      if (empresaId) params.append('empresaId', empresaId);
      if (clienteId) params.append('clienteId', clienteId);
      if (fechaDesde) params.append('fechaDesde', fechaDesde);
      if (fechaHasta) params.append('fechaHasta', fechaHasta);

      url += params.toString();

      const response = await firstValueFrom(
        this.httpService.get(url, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener KPIs de trazabilidad',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/trazabilidad/kpis/nuevos-clientes')
  async getJefeTrazabilidadNuevosClientes(
    @Query('meses') meses?: string,
    @Query('ejecutivaId') ejecutivaId?: string,
    @Req() req?: Request
  ) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      let url = `${traceabilityUrl}/jefe/trazabilidad/kpis/nuevos-clientes?`;

      if (meses) url += `meses=${meses}&`;
      if (ejecutivaId) url += `ejecutivaId=${ejecutivaId}&`;

      const response = await firstValueFrom(
        this.httpService.get(url, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener nuevos clientes',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/trazabilidad/kpis/contactos-por-tipo')
  async getJefeTrazabilidadContactosPorTipo(
    @Query('ejecutivaId') ejecutivaId?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Req() req?: Request
  ) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      let url = `${traceabilityUrl}/jefe/trazabilidad/kpis/contactos-por-tipo?`;

      if (ejecutivaId) url += `ejecutivaId=${ejecutivaId}&`;
      if (fechaDesde) url += `fechaDesde=${fechaDesde}&`;
      if (fechaHasta) url += `fechaHasta=${fechaHasta}&`;

      const response = await firstValueFrom(
        this.httpService.get(url, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener contactos por tipo',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/trazabilidad/kpis/montos-por-etapa')
  async getJefeTrazabilidadMontosPorEtapa(
    @Query('ejecutivaId') ejecutivaId?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Req() req?: Request
  ) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      let url = `${traceabilityUrl}/jefe/trazabilidad/kpis/montos-por-etapa?`;

      if (ejecutivaId) url += `ejecutivaId=${ejecutivaId}&`;
      if (fechaDesde) url += `fechaDesde=${fechaDesde}&`;
      if (fechaHasta) url += `fechaHasta=${fechaHasta}&`;

      const response = await firstValueFrom(
        this.httpService.get(url, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener montos por etapa',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/trazabilidad/kpis/tasa-conversion')
  async getJefeTrazabilidadTasaConversion(
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Req() req?: Request
  ) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      let url = `${traceabilityUrl}/jefe/trazabilidad/kpis/tasa-conversion?`;

      if (fechaDesde) url += `fechaDesde=${fechaDesde}&`;
      if (fechaHasta) url += `fechaHasta=${fechaHasta}&`;

      const response = await firstValueFrom(
        this.httpService.get(url, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener tasa de conversión',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // NUEVOS ENDPOINTS PARA GRÁFICOS DE TRAZABILIDAD

  @Get('jefe/trazabilidad/kpis/nuevas-reuniones')
  async getNuevasReuniones(@Query() query: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      const { meses, ejecutivaId } = query;

      const params = new URLSearchParams();
      if (meses) params.append('meses', meses);
      if (ejecutivaId) params.append('ejecutivaId', ejecutivaId);

      const response = await firstValueFrom(
        this.httpService.get(`${traceabilityUrl}/jefe/trazabilidad/kpis/nuevas-reuniones?${params.toString()}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener nuevas reuniones',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/trazabilidad/kpis/nuevas-ventas')
  async getNuevasVentas(@Query() query: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      const { meses, ejecutivaId } = query;

      const params = new URLSearchParams();
      if (meses) params.append('meses', meses);
      if (ejecutivaId) params.append('ejecutivaId', ejecutivaId);

      const response = await firstValueFrom(
        this.httpService.get(`${traceabilityUrl}/jefe/trazabilidad/kpis/nuevas-ventas?${params.toString()}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener nuevas ventas',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/trazabilidad/kpis/efectividad-canales')
  async getEfectividadCanales(@Query() query: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      const { ejecutivaId, fechaDesde, fechaHasta } = query;

      const params = new URLSearchParams();
      if (ejecutivaId) params.append('ejecutivaId', ejecutivaId);
      if (fechaDesde) params.append('fechaDesde', fechaDesde);
      if (fechaHasta) params.append('fechaHasta', fechaHasta);

      const response = await firstValueFrom(
        this.httpService.get(`${traceabilityUrl}/jefe/trazabilidad/kpis/efectividad-canales?${params.toString()}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener efectividad de canales',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/trazabilidad/kpis/resumen-semanal')
  async getResumenSemanal(@Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');

      const response = await firstValueFrom(
        this.httpService.get(`${traceabilityUrl}/jefe/trazabilidad/kpis/resumen-semanal`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener resumen semanal',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/trazabilidad/kpis/embudo-ventas')
  async getEmbudoVentas(@Query() query: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      const { ejecutivaId, fechaDesde, fechaHasta } = query;

      const params = new URLSearchParams();
      if (ejecutivaId) params.append('ejecutivaId', ejecutivaId);
      if (fechaDesde) params.append('fechaDesde', fechaDesde);
      if (fechaHasta) params.append('fechaHasta', fechaHasta);

      const response = await firstValueFrom(
        this.httpService.get(`${traceabilityUrl}/jefe/trazabilidad/kpis/embudo-ventas?${params.toString()}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener embudo de ventas',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/trazabilidad/kpis/ranking-ejecutivas')
  async getRankingEjecutivas(@Query() query: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      const { fechaDesde, fechaHasta } = query;

      const params = new URLSearchParams();
      if (fechaDesde) params.append('fechaDesde', fechaDesde);
      if (fechaHasta) params.append('fechaHasta', fechaHasta);

      const response = await firstValueFrom(
        this.httpService.get(`${traceabilityUrl}/jefe/trazabilidad/kpis/ranking-ejecutivas?${params.toString()}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener ranking de ejecutivas',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('jefe/trazabilidad/report')
  async generateTrazabilidadReport(
    @Body() reportDto: any,
    @Req() req: Request
  ) {
    try {

      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');

      // ✅ VERIFICA que el puerto sea 3007 (servicio de trazabilidad)
      const response = await firstValueFrom(
        this.httpService.post(
          `${traceabilityUrl}/jefe/trazabilidad/report`,
          reportDto,
          {
            headers,
            responseType: 'text'
          }
        )
      );

      return response.data;

    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al generar reporte',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // En tu API Gateway - Endpoint de prueba
  @Get('jefe/trazabilidad/report-test')
  async testReport(@Req() req: Request) {
    try {

      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');

      const response = await firstValueFrom(
        this.httpService.post(
          `${traceabilityUrl}/jefe/trazabilidad/report`,
          {
            reportType: 'etapa1',
            filters: {},
            format: 'csv'
          },
          {
            headers,
            responseType: 'text'
          }
        )
      );

      return { success: true, data: response.data.substring(0, 100) + '...' };

    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status
      };
    }
  }

  // ============================================
  // ENDPOINTS PARA ETAPAS
  // ============================================

  @Get('jefe/trazabilidad/etapa1')
  async getJefeTrazabilidadEtapa1(
    @Query('ejecutivaId') ejecutivaId?: string,
    @Query('empresaId') empresaId?: string,
    @Query('clienteId') clienteId?: string,
    @Query('resultadoContacto') resultadoContacto?: string,
    @Query('tipoContacto') tipoContacto?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: Request
  ) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      let url = `${traceabilityUrl}/jefe/trazabilidad/etapa1?`;

      const params = new URLSearchParams();
      if (ejecutivaId) params.append('ejecutivaId', ejecutivaId);
      if (empresaId) params.append('empresaId', empresaId);
      if (clienteId) params.append('clienteId', clienteId);
      if (resultadoContacto) params.append('resultadoContacto', resultadoContacto);
      if (tipoContacto) params.append('tipoContacto', tipoContacto);
      if (fechaDesde) params.append('fechaDesde', fechaDesde);
      if (fechaHasta) params.append('fechaHasta', fechaHasta);
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);

      url += params.toString();

      const response = await firstValueFrom(
        this.httpService.get(url, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener datos de etapa 1',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/trazabilidad/etapa2')
  async getJefeTrazabilidadEtapa2(
    @Query('ejecutivaId') ejecutivaId?: string,
    @Query('empresaId') empresaId?: string,
    @Query('clienteId') clienteId?: string,
    @Query('etapaOportunidad') etapaOportunidad?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: Request
  ) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      let url = `${traceabilityUrl}/jefe/trazabilidad/etapa2?`;

      const params = new URLSearchParams();
      if (ejecutivaId) params.append('ejecutivaId', ejecutivaId);
      if (empresaId) params.append('empresaId', empresaId);
      if (clienteId) params.append('clienteId', clienteId);
      if (etapaOportunidad) params.append('etapaOportunidad', etapaOportunidad);
      if (fechaDesde) params.append('fechaDesde', fechaDesde);
      if (fechaHasta) params.append('fechaHasta', fechaHasta);
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);

      url += params.toString();

      const response = await firstValueFrom(
        this.httpService.get(url, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener datos de etapa 2',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ============================================
  // FILTER OPTIONS
  // ============================================

  @Get('jefe/trazabilidad/filter-options')
  async getJefeTrazabilidadFilterOptions(@Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      const response = await firstValueFrom(
        this.httpService.get(`${traceabilityUrl}/jefe/trazabilidad/filter-options`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener opciones de filtro',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // 👩‍💼 =====================================================
  // JEFE (AUDITORIA) TRACEABILITY SERVICE (3007)
  // ============================================================

  @Get('auditoria/contratos')
  async getAuditoriaContratos(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('accion') accion?: string,
    @Query('usuario') usuario?: string,
    @Req() req?: Request
  ) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      let url = `${traceabilityUrl}/auditoria/contratos?`;
      if (fechaInicio) url += `fechaInicio=${fechaInicio}&`;
      if (fechaFin) url += `fechaFin=${fechaFin}&`;
      if (accion) url += `accion=${accion}&`;
      if (usuario) url += `usuario=${usuario}&`;

      const response = await firstValueFrom(
        this.httpService.get(url, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener auditoría',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('auditoria/estadisticas')
  async getAuditoriaEstadisticas(@Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      const response = await firstValueFrom(
        this.httpService.get(`${traceabilityUrl}/auditoria/estadisticas`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener estadísticas de auditoría',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('auditoria/resumen-mensual')
  async getAuditoriaResumenMensual(@Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      const response = await firstValueFrom(
        this.httpService.get(`${traceabilityUrl}/auditoria/resumen-mensual`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener resumen mensual',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // 🏢 =====================================================
  // CLIENTE (EMPRESA PROVEEDORA) - USER SERVICE
  // =====================================================

  @Get('cliente/dashboard/stats')
  async getClienteDashboardStats(@Query('empresaId') empresaId: string, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/cliente/dashboard/stats?empresaId=${empresaId}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener estadísticas del cliente',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // 🏢 =====================================================
  // CLIENTE - TRAZABILIDAD (Traceability Service)
  // =====================================================

  @Get('cliente/trazabilidad')
  async getClienteTrazabilidad(@Query('empresaId') empresaId: string, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      const response = await firstValueFrom(
        this.httpService.get(`${traceabilityUrl}/cliente/trazabilidad?empresaId=${empresaId}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener trazabilidad del cliente',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // 👩‍💼 =====================================================
  // EJECUTIVA - USER SERVICE (Puerto 3002)
  // =====================================================

  @Get('ejecutiva/stats')
  async getEjecutivaStats(@Query('ejecutivaId') ejecutivaId: string, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/ejecutiva/stats?ejecutivaId=${ejecutivaId}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener estadísticas de ejecutiva',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('ejecutiva/empresas')
  async getEjecutivaEmpresas(@Query('ejecutivaId') ejecutivaId: string, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/ejecutiva/empresas?ejecutivaId=${ejecutivaId}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener empresas de ejecutiva',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('ejecutiva/empresas')
  async createEjecutivaEmpresa(@Body() body: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.post(`${userUrl}/ejecutiva/empresas`, body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al crear empresa',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('ejecutiva/clientes')
  async getEjecutivaClientes(@Query('ejecutivaId') ejecutivaId: string, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/ejecutiva/clientes?ejecutivaId=${ejecutivaId}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener clientes de ejecutiva',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('ejecutiva/clientes')
  async createEjecutivaCliente(@Body() body: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.post(`${userUrl}/ejecutiva/clientes`, body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al crear cliente',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('ejecutiva/empresas/registradas')
  async getEjecutivaEmpresasRegistradas(@Query('ejecutivaId') ejecutivaId: string, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/ejecutiva/empresas/registradas?ejecutivaId=${ejecutivaId}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener empresas registradas de ejecutiva',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('ejecutiva/empresas/registrar')
  async createEjecutivaEmpresaRegistrar(@Body() body: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.post(`${userUrl}/ejecutiva/empresas/registrar`, body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al registrar empresa',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('ejecutiva/contactos')
  async createEjecutivaContacto(@Body() body: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.post(`${userUrl}/ejecutiva/contactos`, body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al crear contacto',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('ejecutiva/contactos')
  async getEjecutivaContactos(
    @Query('clienteId') clienteId: string,
    @Query('ejecutivaId') ejecutivaId: string,
    @Req() req: Request
  ) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/ejecutiva/contactos?clienteId=${clienteId}&ejecutivaId=${ejecutivaId}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener contactos de ejecutiva',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('ejecutiva/pipeline')
  async getEjecutivaPipeline(@Query('ejecutivaId') ejecutivaId: string, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/ejecutiva/pipeline?ejecutivaId=${ejecutivaId}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener pipeline de ejecutiva',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('ejecutiva/actividades')
  async getEjecutivaActividades(
    @Query('ejecutivaId') ejecutivaId: string,
    @Query('limit') limit: string = '10',
    @Req() req: Request
  ) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/ejecutiva/actividades?ejecutivaId=${ejecutivaId}&limit=${limit}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener actividades de ejecutiva',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('ejecutiva/kpis/semanales')
  async getEjecutivaKPIsSemanales(@Query('ejecutivaId') ejecutivaId: string, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');
      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/ejecutiva/kpis/semanales?ejecutivaId=${ejecutivaId}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener KPIs semanales de ejecutiva',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // 👩‍💼 =====================================================
  // EJECUTIVA - TRAZABILIDAD (Traceability Service)
  // =====================================================

  @Get('ejecutiva/trazabilidad')
  async getEjecutivaTrazabilidad(@Query('ejecutivaId') ejecutivaId: string, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      const response = await firstValueFrom(
        this.httpService.get(`${traceabilityUrl}/ejecutiva/trazabilidad?ejecutivaId=${ejecutivaId}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener trazabilidad de ejecutiva',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('ejecutiva/trazabilidad')
  async createEjecutivaTrazabilidad(@Body() body: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      const response = await firstValueFrom(
        this.httpService.post(`${traceabilityUrl}/ejecutiva/trazabilidad`, body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al crear trazabilidad',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('ejecutiva/trazabilidad/pipeline')
  async getEjecutivaTrazabilidadPipeline(@Query('ejecutivaId') ejecutivaId: string, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      const response = await firstValueFrom(
        this.httpService.get(`${traceabilityUrl}/ejecutiva/trazabilidad/pipeline?ejecutivaId=${ejecutivaId}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener pipeline de trazabilidad',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('ejecutiva/trazabilidad/actividades')
  async getEjecutivaTrazabilidadActividades(
    @Query('ejecutivaId') ejecutivaId: string,
    @Query('limit') limit: string = '1000',
    @Req() req: Request
  ) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      const response = await firstValueFrom(
        this.httpService.get(`${traceabilityUrl}/ejecutiva/trazabilidad/actividades?ejecutivaId=${ejecutivaId}&limit=${limit}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener actividades de trazabilidad',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('ejecutiva/trazabilidad/etapa')
  async updateEjecutivaTrazabilidadEtapa(@Body() body: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      const response = await firstValueFrom(
        this.httpService.put(`${traceabilityUrl}/ejecutiva/trazabilidad/etapa`, body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al actualizar etapa de trazabilidad',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ✅ ENDPOINT FALTANTE: Estadísticas de Trazabilidad
  @Get('ejecutiva/trazabilidad/stats')
  async getEjecutivaTrazabilidadStats(@Query('ejecutivaId') ejecutivaId: string, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const traceabilityUrl = this.getServiceBaseUrl('traceability');
      const response = await firstValueFrom(
        this.httpService.get(`${traceabilityUrl}/ejecutiva/trazabilidad/stats?ejecutivaId=${ejecutivaId}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener estadísticas de trazabilidad',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // EMPRESASSSSSS
  // EMPRESASSSSSS

  @Get('empresa/dashboard/stats')
  async getEmpresaDashboardStats(@Query('clienteUsuarioId') clienteUsuarioId: string, @Req() req) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');

      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/empresa/dashboard/stats?clienteUsuarioId=${clienteUsuarioId}`, { headers })
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener estadísticas del dashboard',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('empresa/trazabilidad')
  async getEmpresaTrazabilidad(@Query('clienteUsuarioId') clienteUsuarioId: string, @Req() req) {
    try {

      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');

      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/empresa/trazabilidad?clienteUsuarioId=${clienteUsuarioId}`, { headers })
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener trazabilidad',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('empresa/ejecutiva')
  async getEmpresaEjecutiva(@Query('clienteUsuarioId') clienteUsuarioId: string, @Req() req) {
    try {

      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');

      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/empresa/ejecutiva?clienteUsuarioId=${clienteUsuarioId}`, { headers })
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener información de la ejecutiva',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('empresa/actividades')
  async getEmpresaActividades(@Query('clienteUsuarioId') clienteUsuarioId: string, @Req() req) {
    try {

      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');

      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/empresa/actividades?clienteUsuarioId=${clienteUsuarioId}`, { headers })
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener actividades',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ✅ NUEVO ENDPOINT PARA CLIENTES RECIENTES
  @Get('empresa/clientes')
  async getEmpresaClientes(@Query('clienteUsuarioId') clienteUsuarioId: string, @Req() req) {
    try {

      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');

      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/empresa/clientes?clienteUsuarioId=${clienteUsuarioId}`, { headers })
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener clientes',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // EMPRESAS - EQUIPO DE EJECUTIVAS
  // EMPRESAS - EQUIPO DE EJECUTIVAS

  @Get('empresa/ejecutivas')
  async getEmpresaEjecutivas(@Query('empresaId') empresaId: string, @Req() req) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');

      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/empresa/ejecutivas?empresaId=${empresaId}`, { headers })
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener ejecutivas',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('empresa/equipo/stats')
  async getEmpresaEquipoStats(@Query('empresaId') empresaId: string, @Req() req) {
    try {

      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');

      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/empresa/equipo/stats?empresaId=${empresaId}`, { headers })
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener estadísticas del equipo',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('empresa/ejecutiva/:id/embudo')
  async getEjecutivaEmbudo(@Param('id') ejecutivaId: string, @Query('empresaId') empresaId: string, @Req() req) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');

      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/empresa/ejecutiva/${ejecutivaId}/embudo?empresaId=${empresaId}`, { headers })
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener embudo de ejecutiva',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('empresa/ejecutiva/:id/estadisticas')
  async getEjecutivaEstadisticas(@Param('id') ejecutivaId: string, @Query('empresaId') empresaId: string, @Req() req) {
    try {

      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');

      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/empresa/ejecutiva/${ejecutivaId}/estadisticas?empresaId=${empresaId}`, { headers })
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener estadísticas de ejecutiva',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('empresa/ejecutiva/:id/clientes')
  async getEmpresaEjecutivaClientes(@Param('id') ejecutivaId: string, @Query('empresaId') empresaId: string, @Req() req) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');

      const response = await firstValueFrom(
        this.httpService.get(`${userUrl}/empresa/ejecutiva/${ejecutivaId}/clientes?empresaId=${empresaId}`, { headers })
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener clientes de ejecutiva',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // 👩‍💼 =====================================================
  // EJECUTIVA - BULK UPLOAD CLIENTES (User Service - Puerto 3002)
  // =====================================================

  /**
   * ✅ NUEVO: Subir archivo CSV para crear clientes en lote
   */
  @Post('ejecutiva/clientes/bulk')
  @UseInterceptors(FileInterceptor('file'))
  async bulkCreateEjecutivaClientes(
    @UploadedFile() file: any,
    @Body('ejecutivaId') ejecutivaId: string,
    @Req() req: Request
  ) {
    try {

      if (!file) {
        throw new HttpException('Archivo no proporcionado', HttpStatus.BAD_REQUEST);
      }

      if (!file.originalname.match(/\.csv$/i)) {
        throw new HttpException('Formato de archivo no válido. Use CSV', HttpStatus.BAD_REQUEST);
      }


      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');

      // Crear FormData para enviar el archivo
      const formData = new FormData();
      const blob = new Blob([file.buffer], { type: file.mimetype });
      formData.append('file', blob, file.originalname);
      formData.append('ejecutivaId', ejecutivaId);

      const response = await firstValueFrom(
        this.httpService.post(
          `${userUrl}/ejecutiva/clientes/bulk`,
          formData,
          {
            headers: {
              ...headers,
              'Content-Type': 'multipart/form-data'
            }
          }
        )
      );

      return response.data;

    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al procesar archivo de clientes',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * ✅ NUEVO: Descargar plantilla CSV para clientes
   */
  @Get('ejecutiva/clientes/plantilla')
  async downloadEjecutivaPlantillaClientes(
    @Query('ejecutivaId') ejecutivaId: string,
    @Res() res: Response,
    @Req() req: Request
  ) {
    try {

      const headers = this.getHeadersWithAuth(req);
      const userUrl = this.getServiceBaseUrl('user');

      const response = await firstValueFrom(
        this.httpService.get(
          `${userUrl}/ejecutiva/clientes/plantilla?ejecutivaId=${ejecutivaId}`,
          {
            headers,
            responseType: 'stream' // Para manejar la descarga de archivos
          }
        )
      );

      // Configurar headers para descarga
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="plantilla_clientes.csv"');

      // Pipe la respuesta del servicio al response del cliente
      response.data.pipe(res);

    } catch (error) {

      // Si hay error, generar plantilla básica desde el gateway
      const plantillaBasica = this.generarPlantillaBasica();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="plantilla_clientes.csv"');
      res.send(plantillaBasica);
    }
  }

  /**
   * ✅ MÉTODO AUXILIAR: Generar plantilla básica en caso de error
   */
  private generarPlantillaBasica(): string {
    const headers = [
      'razon_social',
      'ruc',
      'direccion',
      'telefono',
      'correo',
      'pagina_web',
      'pais',
      'departamento',
      'provincia',
      'linkedin',
      'grupo_economico',
      'rubro',
      'sub_rubro',
      'tamanio_empresa',
      'facturacion_anual',
      'cantidad_empleados'
    ];

    const ejemplo = {
      razon_social: 'Mi Empresa Ejemplo SAC',
      ruc: '20123456789',
      direccion: 'Av. Ejemplo 123, Lima',
      telefono: '+51 987 654 321',
      correo: 'contacto@miempresa.com',
      pagina_web: 'https://miempresa.com',
      pais: 'Perú',
      departamento: 'Lima',
      provincia: 'Lima',
      linkedin: 'https://linkedin.com/company/miempresa',
      grupo_economico: 'Grupo Ejemplo',
      rubro: 'Tecnología',
      sub_rubro: 'Desarrollo Software',
      tamanio_empresa: 'Mediana',
      facturacion_anual: '500000.00',
      cantidad_empleados: '50'
    };

    let csvContent = headers.join(',') + '\n';
    const row = headers.map(header => `"${ejemplo[header] || ''}"`).join(',');
    csvContent += row + '\n';

    return csvContent;
  }
}