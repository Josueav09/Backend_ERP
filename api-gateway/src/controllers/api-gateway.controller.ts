import { Body, Controller, Get, HttpException, HttpStatus, Post, Put, Delete, Param, Query, Req, Patch } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';

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
      console.log('🔐 [API Gateway] Propagando Authorization header');
    }

    // Propagar otros headers si es necesario
    if (req?.headers && req.headers['user-agent']) {
      headers['User-Agent'] = req.headers['user-agent'];
    }

    console.log('🔐 [API Gateway] Headers a enviar:', Object.keys(headers));
    return headers;
  }

  // 🔐 =====================================================
  // AUTH SERVICE (Puerto 3001)
  // =====================================================

  @Get('auth/captcha')
  async getCaptcha(@Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const response = await firstValueFrom(
        this.httpService.get('http://localhost:3001/auth/captcha', { headers })
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
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:3001/auth/login', body, { headers })
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
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:3001/auth/verify-email', body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error en verificación',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // 👔 =====================================================
  // JEFE - USER SERVICE (Puerto 3002)
  // =====================================================

  @Get('jefe/perfil')
  async getJefePerfil(@Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      console.log('🔐 [API Gateway /jefe/perfil] Headers:', headers);

      const response = await firstValueFrom(
        this.httpService.get('http://localhost:3002/jefe/perfil', { headers })
      );
      return response.data;
    } catch (error) {
      console.error('❌ [API Gateway /jefe/perfil] Error:', error.response?.data);
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
      const response = await firstValueFrom(
        this.httpService.put('http://localhost:3002/jefe/perfil', body, { headers })
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
      const response = await firstValueFrom(
        this.httpService.put('http://localhost:3002/jefe/password', body, { headers })
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
      const response = await firstValueFrom(
        this.httpService.get('http://localhost:3002/jefe/stats', { headers })
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
      const response = await firstValueFrom(
        this.httpService.get('http://localhost:3002/ejecutivas', { headers })
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
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3002/ejecutivas/${id}`, { headers })
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
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:3002/ejecutivas', body, { headers })
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
      const response = await firstValueFrom(
        this.httpService.put(`http://localhost:3002/ejecutivas/${id}`, body, { headers })
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
      const response = await firstValueFrom(
        this.httpService.delete(`http://localhost:3002/ejecutivas/${id}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al eliminar ejecutiva',
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
      const response = await firstValueFrom(
        this.httpService.get('http://localhost:3002/empresas', { headers })
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
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3002/empresas/${id}`, { headers })
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
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:3002/empresas', body, { headers })
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
      const response = await firstValueFrom(
        this.httpService.put(`http://localhost:3002/empresas/${id}`, body, { headers })
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
      const response = await firstValueFrom(
        this.httpService.patch(`http://localhost:3002/empresas/${id}/estado`, body, { headers })
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
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3002/empresas/${id}/ejecutivas`, { headers })
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
      const response = await firstValueFrom(
        this.httpService.post(`http://localhost:3002/empresas/${id}/ejecutivas`, body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al asignar ejecutiva',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('jefe/empresas/:id/ejecutivas/:ejecutivaId/remove')
  async removeJefeEmpresaEjecutiva(
    @Param('id') id: string,
    @Param('ejecutivaId') ejecutivaId: string,
    @Req() req: Request
  ) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const response = await firstValueFrom(
        this.httpService.post(`http://localhost:3002/empresas/${id}/ejecutivas/${ejecutivaId}/remove`, {}, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al remover ejecutiva',
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
      const response = await firstValueFrom(
        this.httpService.get('http://localhost:3003/clientes', { headers })
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
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3003/clientes/${id}`, { headers })
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
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:3003/clientes', body, { headers })
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
      const response = await firstValueFrom(
        this.httpService.put(`http://localhost:3003/clientes/${id}`, body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al actualizar cliente',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('jefe/clientes/:id')
  async deleteJefeCliente(@Param('id') id: string, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const response = await firstValueFrom(
        this.httpService.delete(`http://localhost:3003/clientes/${id}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al eliminar cliente',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // 👔 =====================================================
  // JEFE - TRAZABILIDAD (Traceability Service - Puerto 3007)
  // =====================================================

  // @Get('jefe/trazabilidad')
  // async getJefeTrazabilidad(
  //   @Query('empresa') empresaId?: string,
  //   @Query('ejecutiva') ejecutivaId?: string,
  //   @Query('cliente') clienteId?: string,
  //   @Query('fechaInicio') fechaInicio?: string,
  //   @Query('fechaFin') fechaFin?: string,
  //   @Req() req?: Request
  // ) {
  //   try {
  //     const headers = this.getHeadersWithAuth(req);
  //     let url = 'http://localhost:3007/trazabilidad?';
  //     if (empresaId) url += `empresa=${empresaId}&`;
  //     if (ejecutivaId) url += `ejecutiva=${ejecutivaId}&`;
  //     if (clienteId) url += `cliente=${clienteId}&`;
  //     if (fechaInicio) url += `fechaInicio=${fechaInicio}&`;
  //     if (fechaFin) url += `fechaFin=${fechaFin}&`;

  //     const response = await firstValueFrom(
  //       this.httpService.get(url, { headers })
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw new HttpException(
  //       error.response?.data?.message || 'Error al obtener trazabilidad',
  //       error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }

  // @Get('jefe/trazabilidad/dashboard')
  // async getJefeTrazabilidadDashboard(@Req() req: Request) {
  //   try {
  //     const headers = this.getHeadersWithAuth(req);
  //     const response = await firstValueFrom(
  //       this.httpService.get('http://localhost:3007/trazabilidad/dashboard', { headers })
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw new HttpException(
  //       error.response?.data?.message || 'Error al obtener dashboard de trazabilidad',
  //       error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }

  // @Post('jefe/trazabilidad')
  // async createJefeTrazabilidad(@Body() body: any, @Req() req: Request) {
  //   try {
  //     const headers = this.getHeadersWithAuth(req);
  //     const response = await firstValueFrom(
  //       this.httpService.post('http://localhost:3007/trazabilidad', body, { headers })
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw new HttpException(
  //       error.response?.data?.message || 'Error al crear trazabilidad',
  //       error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }

  // 👔 =====================================================
  // JEFE - TRAZABILIDAD (Traceability Service - Puerto 3007)
  // =====================================================

  @Get('jefe/trazabilidad')
  async getJefeTrazabilidad(
    @Query('empresa') empresaId?: string,
    @Query('ejecutiva') ejecutivaId?: string,
    @Query('cliente') clienteId?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Req() req?: Request
  ) {
    try {
      const headers = this.getHeadersWithAuth(req);
      let url = 'http://localhost:3002/trazabilidad?';
      if (empresaId) url += `empresa=${empresaId}&`;
      if (ejecutivaId) url += `ejecutiva=${ejecutivaId}&`;
      if (clienteId) url += `cliente=${clienteId}&`;
      if (fechaInicio) url += `fechaInicio=${fechaInicio}&`;
      if (fechaFin) url += `fechaFin=${fechaFin}&`;

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
      const response = await firstValueFrom(
        this.httpService.get('http://localhost:3002/trazabilidad/dashboard', { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener dashboard de trazabilidad',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('jefe/trazabilidad')
  async createJefeTrazabilidad(@Body() body: any, @Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:3002/trazabilidad', body, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al crear trazabilidad',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


  // 👔 =====================================================
  // JEFE - TRAZABILIDAD ENDPOINTS (Nuevos - Puerto 3007)
  // =====================================================

  @Get('jefe/trazabilidad/kpis')
  async getTrazabilidadKPIs(
    @Query('ejecutivaId') ejecutivaId?: string,
    @Query('empresaId') empresaId?: string,
    @Query('clienteId') clienteId?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Req() req?: Request
  ) {
    console.log('🔗 [API Gateway] GET /jefe/trazabilidad/kpis llamado con params:', {
      ejecutivaId, empresaId, clienteId, fechaDesde, fechaHasta
    });

    try {
      const headers = this.getHeadersWithAuth(req);
      let url = 'http://localhost:3002/jefe/trazabilidad/kpis?';
      if (ejecutivaId) url += `ejecutivaId=${ejecutivaId}&`;
      if (empresaId) url += `empresaId=${empresaId}&`;
      if (clienteId) url += `clienteId=${clienteId}&`;
      if (fechaDesde) url += `fechaDesde=${fechaDesde}&`;
      if (fechaHasta) url += `fechaHasta=${fechaHasta}&`;

      console.log('🔗 [API Gateway] URL destino:', url);

      const response = await firstValueFrom(
        this.httpService.get(url, { headers })
      );
      return response.data;
    } catch (error) {
      console.error('❌ [API Gateway] Error en /kpis:', error.response?.data);
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener KPIs de trazabilidad',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/trazabilidad/etapa1')
  async getTrazabilidadEtapa1(
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
      let url = 'http://localhost:3002/jefe/trazabilidad/etapa1?';
      if (ejecutivaId) url += `ejecutivaId=${ejecutivaId}&`;
      if (empresaId) url += `empresaId=${empresaId}&`;
      if (clienteId) url += `clienteId=${clienteId}&`;
      if (resultadoContacto) url += `resultadoContacto=${resultadoContacto}&`;
      if (tipoContacto) url += `tipoContacto=${tipoContacto}&`;
      if (fechaDesde) url += `fechaDesde=${fechaDesde}&`;
      if (fechaHasta) url += `fechaHasta=${fechaHasta}&`;
      if (page) url += `page=${page}&`;
      if (limit) url += `limit=${limit}&`;

      const response = await firstValueFrom(
        this.httpService.get(url, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener etapa 1 de trazabilidad',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/trazabilidad/etapa2')
  async getTrazabilidadEtapa2(
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
      let url = 'http://localhost:3002/jefe/trazabilidad/etapa2?';
      if (ejecutivaId) url += `ejecutivaId=${ejecutivaId}&`;
      if (empresaId) url += `empresaId=${empresaId}&`;
      if (clienteId) url += `clienteId=${clienteId}&`;
      if (etapaOportunidad) url += `etapaOportunidad=${etapaOportunidad}&`;
      if (fechaDesde) url += `fechaDesde=${fechaDesde}&`;
      if (fechaHasta) url += `fechaHasta=${fechaHasta}&`;
      if (page) url += `page=${page}&`;
      if (limit) url += `limit=${limit}&`;

      const response = await firstValueFrom(
        this.httpService.get(url, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener etapa 2 de trazabilidad',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/trazabilidad/kpis/nuevos-clientes')
  async getNuevosClientesKPIs(
    @Query('meses') meses?: string,
    @Query('ejecutivaId') ejecutivaId?: string,
    @Req() req?: Request
  ) {
    try {
      const headers = this.getHeadersWithAuth(req);
      let url = 'http://localhost:3002/jefe/trazabilidad/kpis/nuevos-clientes?';
      if (meses) url += `meses=${meses}&`;
      if (ejecutivaId) url += `ejecutivaId=${ejecutivaId}&`;

      const response = await firstValueFrom(
        this.httpService.get(url, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener KPIs de nuevos clientes',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/trazabilidad/kpis/contactos-por-tipo')
  async getContactosPorTipoKPIs(
    @Query('ejecutivaId') ejecutivaId?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Req() req?: Request
  ) {
    try {
      const headers = this.getHeadersWithAuth(req);
      let url = 'http://localhost:3002/jefe/trazabilidad/kpis/contactos-por-tipo?';
      if (ejecutivaId) url += `ejecutivaId=${ejecutivaId}&`;
      if (fechaDesde) url += `fechaDesde=${fechaDesde}&`;
      if (fechaHasta) url += `fechaHasta=${fechaHasta}&`;

      const response = await firstValueFrom(
        this.httpService.get(url, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener KPIs de contactos por tipo',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/trazabilidad/kpis/montos-por-etapa')
  async getMontosPorEtapaKPIs(
    @Query('ejecutivaId') ejecutivaId?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Req() req?: Request
  ) {
    try {
      const headers = this.getHeadersWithAuth(req);
      let url = 'http://localhost:3002/jefe/trazabilidad/kpis/montos-por-etapa?';
      if (ejecutivaId) url += `ejecutivaId=${ejecutivaId}&`;
      if (fechaDesde) url += `fechaDesde=${fechaDesde}&`;
      if (fechaHasta) url += `fechaHasta=${fechaHasta}&`;

      const response = await firstValueFrom(
        this.httpService.get(url, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener KPIs de montos por etapa',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/trazabilidad/kpis/tasa-conversion')
  async getTasaConversionKPIs(
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Req() req?: Request
  ) {
    try {
      const headers = this.getHeadersWithAuth(req);
      let url = 'http://localhost:3002/jefe/trazabilidad/kpis/tasa-conversion?';
      if (fechaDesde) url += `fechaDesde=${fechaDesde}&`;
      if (fechaHasta) url += `fechaHasta=${fechaHasta}&`;

      const response = await firstValueFrom(
        this.httpService.get(url, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener KPIs de tasa de conversión',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/trazabilidad/:id')
  async getTrazabilidadDetail(
    @Param('id') id: string,
    @Req() req?: Request
  ) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3002/jefe/trazabilidad/${id}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener detalle de trazabilidad',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('jefe/trazabilidad/test')
  async testTrazabilidadEndpoint(@Req() req?: Request) {
    console.log('🔗 [API Gateway] GET /jefe/trazabilidad/test llamado');
    try {
      const headers = this.getHeadersWithAuth(req);
      const response = await firstValueFrom(
        this.httpService.get('http://localhost:3002/jefe/trazabilidad/test', { headers })
      );
      return response.data;
    } catch (error) {
      console.error('❌ [API Gateway] Error en test:', error.response?.data);
      throw new HttpException(
        error.response?.data?.message || 'Error en test de trazabilidad',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


  // 👔 =====================================================
  // JEFE - AUDITORÍA (Traceability Service - Puerto 3007)
  // =====================================================

  @Get('jefe/auditoria')
  async getJefeAuditoria(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('accion') accion?: string,
    @Query('usuario') usuario?: string,
    @Req() req?: Request
  ) {
    try {
      const headers = this.getHeadersWithAuth(req);
      let url = 'http://localhost:3007/audit/contratos?';
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

  @Get('jefe/auditoria/estadisticas')
  async getJefeAuditoriaEstadisticas(@Req() req: Request) {
    try {
      const headers = this.getHeadersWithAuth(req);
      const response = await firstValueFrom(
        this.httpService.get('http://localhost:3007/audit/estadisticas', { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener estadísticas de auditoría',
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
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3002/cliente/dashboard/stats?empresaId=${empresaId}`, { headers })
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
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3007/cliente/trazabilidad?empresaId=${empresaId}`, { headers })
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
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3002/ejecutiva/stats?ejecutivaId=${ejecutivaId}`, { headers })
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
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3002/ejecutiva/empresas?ejecutivaId=${ejecutivaId}`, { headers })
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
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:3002/ejecutiva/empresas', body, { headers })
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
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3002/ejecutiva/clientes?ejecutivaId=${ejecutivaId}`, { headers })
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
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:3002/ejecutiva/clientes', body, { headers })
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
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3002/ejecutiva/empresas/registradas?ejecutivaId=${ejecutivaId}`, { headers })
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
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:3002/ejecutiva/empresas/registrar', body, { headers })
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
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:3002/ejecutiva/contactos', body, { headers })
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
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3002/ejecutiva/contactos?clienteId=${clienteId}&ejecutivaId=${ejecutivaId}`, { headers })
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
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3002/ejecutiva/pipeline?ejecutivaId=${ejecutivaId}`, { headers })
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
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3002/ejecutiva/actividades?ejecutivaId=${ejecutivaId}&limit=${limit}`, { headers })
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
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3002/ejecutiva/kpis/semanales?ejecutivaId=${ejecutivaId}`, { headers })
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
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3007/ejecutiva/trazabilidad?ejecutivaId=${ejecutivaId}`, { headers })
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
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:3007/ejecutiva/trazabilidad', body, { headers })
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
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3007/ejecutiva/trazabilidad/pipeline?ejecutivaId=${ejecutivaId}`, { headers })
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
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3007/ejecutiva/trazabilidad/actividades?ejecutivaId=${ejecutivaId}&limit=${limit}`, { headers })
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
      const response = await firstValueFrom(
        this.httpService.put('http://localhost:3007/ejecutiva/trazabilidad/etapa', body, { headers })
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
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3007/ejecutiva/trazabilidad/stats?ejecutivaId=${ejecutivaId}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error al obtener estadísticas de trazabilidad',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

}
