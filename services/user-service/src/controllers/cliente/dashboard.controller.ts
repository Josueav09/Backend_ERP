// user-service/src/empresa/empresa-dashboard.controller.ts
import { Controller, Get, Query, Req, HttpException, HttpStatus, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../../shared/guards/jwt-auth.guard';
import { EmpresaDashboardService } from '../../services/cliente/dashboard.service';

@Controller('empresa')
export class EmpresaDashboardController {
  constructor(private readonly dashboardService: EmpresaDashboardService) { }

  @Get('dashboard/stats')
  @UseGuards(JwtAuthGuard)
  async getStats(@Query('clienteUsuarioId') clienteUsuarioId: string, @Req() req) {
    try {
      console.log('📊 [EmpresaDashboardController] === OBTENER STATS ===');

      const empresaId = this.getEmpresaId(req, clienteUsuarioId);
      console.log('📊 [EmpresaDashboardController] Empresa ID:', empresaId);

      const stats = await this.dashboardService.getStats(empresaId);
      console.log('✅ [EmpresaDashboardController] Stats obtenidas exitosamente');

      return stats;
    } catch (error) {
      console.error('❌ [EmpresaDashboardController] Error en getStats:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error al obtener estadísticas del dashboard',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('trazabilidad')
  @UseGuards(JwtAuthGuard)
  async getTrazabilidad(@Query('clienteUsuarioId') clienteUsuarioId: string, @Req() req) {
    try {
      console.log('📋 [EmpresaDashboardController] === OBTENER TRAZABILIDAD ===');

      const empresaId = this.getEmpresaId(req, clienteUsuarioId);
      const trazabilidad = await this.dashboardService.getTrazabilidad(empresaId);

      console.log(`✅ [EmpresaDashboardController] ${trazabilidad.length} actividades obtenidas`);
      return trazabilidad;
    } catch (error) {
      console.error('❌ [EmpresaDashboardController] Error en getTrazabilidad:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error al obtener trazabilidad',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('ejecutiva')
  @UseGuards(JwtAuthGuard)

  async getEjecutivaInfo(@Query('clienteUsuarioId') clienteUsuarioId: string) {
    try {
      if (!clienteUsuarioId) {
        throw new HttpException('clienteUsuarioId es requerido', HttpStatus.BAD_REQUEST);
      }

      const empresaId = parseInt(clienteUsuarioId);
      if (isNaN(empresaId)) {
        throw new HttpException('clienteUsuarioId debe ser un número válido', HttpStatus.BAD_REQUEST);
      }

      // ✅ Usar el método MEJORADO que incluye estadísticas reales
      return await this.dashboardService.getEjecutivaInfoCompleta(empresaId);
    } catch (error) {
      console.error('❌ [EmpresaDashboardController] Error en getEjecutivaInfo:', error);
      throw new HttpException(
        'Error al obtener información de ejecutiva',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('clientes')
  @UseGuards(JwtAuthGuard)
  async getClientesRecientes(@Query('clienteUsuarioId') clienteUsuarioId: string) {
    try {
      if (!clienteUsuarioId) {
        throw new HttpException('clienteUsuarioId es requerido', HttpStatus.BAD_REQUEST);
      }

      const empresaId = parseInt(clienteUsuarioId);
      if (isNaN(empresaId)) {
        throw new HttpException('clienteUsuarioId debe ser un número válido', HttpStatus.BAD_REQUEST);
      }

      return await this.dashboardService.getClientesRecientes(empresaId);
    } catch (error) {
      console.error('❌ [EmpresaDashboardController] Error en getClientesRecientes:', error);
      throw new HttpException(
        'Error al obtener clientes recientes',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


  @Get('actividades')
  @UseGuards(JwtAuthGuard)
  async getActividades(@Query('clienteUsuarioId') clienteUsuarioId: string, @Req() req) {
    try {
      console.log('📝 [EmpresaDashboardController] === OBTENER ACTIVIDADES ===');

      const empresaId = this.getEmpresaId(req, clienteUsuarioId);
      const actividades = await this.dashboardService.getTrazabilidad(empresaId);

      console.log(`✅ [EmpresaDashboardController] ${actividades.length} actividades obtenidas`);
      return actividades;
    } catch (error) {
      console.error('❌ [EmpresaDashboardController] Error en getActividades:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error al obtener actividades',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private getEmpresaId(req: any, clienteUsuarioId: string): number {
    if (req.user && req.user.id_empresa_prov) {
      const empresaId = req.user.id_empresa_prov;
      console.log('🔐 [EmpresaDashboardController] Usando empresaId del JWT:', empresaId);
      return empresaId;
    } else if (clienteUsuarioId) {
      const empresaId = parseInt(clienteUsuarioId);
      console.log('🔐 [EmpresaDashboardController] Usando empresaId del query:', empresaId);
      return empresaId;
    } else {
      console.error('❌ [EmpresaDashboardController] No se pudo obtener empresaId');
      throw new HttpException('Empresa no identificada', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('ejecutivas')
  @UseGuards(JwtAuthGuard)
  async getEjecutivasByEmpresa(@Query('empresaId') empresaId: string, @Req() req) {
    try {
      console.log('👥 [EmpresaEquipoController] === OBTENER EJECUTIVAS ===');
      
      const idEmpresa = this.getEmpresaId(req, empresaId);
      const ejecutivas = await this.dashboardService.getEjecutivasByEmpresa(idEmpresa);
      
      console.log(`✅ [EmpresaEquipoController] ${ejecutivas.length} ejecutivas obtenidas`);
      return ejecutivas;
    } catch (error) {
      console.error('❌ [EmpresaEquipoController] Error en getEjecutivasByEmpresa:', error);
      throw new HttpException(
        'Error al obtener ejecutivas',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('equipo/stats')
  @UseGuards(JwtAuthGuard)
  async getEquipoStats(@Query('empresaId') empresaId: string, @Req() req) {
    try {
      console.log('📊 [EmpresaEquipoController] === OBTENER STATS DE EQUIPO ===');
      
      const idEmpresa = this.getEmpresaId(req, empresaId);
      const stats = await this.dashboardService.getEquipoStats(idEmpresa);
      
      console.log('✅ [EmpresaEquipoController] Stats de equipo obtenidas');
      return stats;
    } catch (error) {
      console.error('❌ [EmpresaEquipoController] Error en getEquipoStats:', error);
      throw new HttpException(
        'Error al obtener estadísticas del equipo',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('ejecutiva/:id/embudo')
  @UseGuards(JwtAuthGuard)
  async getEjecutivaEmbudo(@Param('id') ejecutivaId: string, @Query('empresaId') empresaId: string, @Req() req) {
    try {
      console.log('🎯 [EmpresaEquipoController] === OBTENER EMBUDO EJECUTIVA ===');
      
      const idEmpresa = this.getEmpresaId(req, empresaId);
      const idEjecutiva = parseInt(ejecutivaId);
      
      if (isNaN(idEjecutiva)) {
        throw new HttpException('ID de ejecutiva inválido', HttpStatus.BAD_REQUEST);
      }

      const embudo = await this.dashboardService.getEmbudoVentasEjecutiva(idEjecutiva, idEmpresa);
      
      console.log('✅ [EmpresaEquipoController] Embudo de ejecutiva obtenido');
      return embudo;
    } catch (error) {
      console.error('❌ [EmpresaEquipoController] Error en getEjecutivaEmbudo:', error);
      throw new HttpException(
        'Error al obtener embudo de ejecutiva',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('ejecutiva/:id/estadisticas')
  @UseGuards(JwtAuthGuard)
  async getEjecutivaEstadisticas(@Param('id') ejecutivaId: string, @Query('empresaId') empresaId: string, @Req() req) {
    try {
      console.log('📈 [EmpresaEquipoController] === OBTENER ESTADÍSTICAS EJECUTIVA ===');
      
      const idEmpresa = this.getEmpresaId(req, empresaId);
      const idEjecutiva = parseInt(ejecutivaId);
      
      if (isNaN(idEjecutiva)) {
        throw new HttpException('ID de ejecutiva inválido', HttpStatus.BAD_REQUEST);
      }

      const estadisticas = await this.dashboardService.getEstadisticasEjecutivaCompleta(idEjecutiva, idEmpresa);
      
      console.log('✅ [EmpresaEquipoController] Estadísticas de ejecutiva obtenidas');
      return estadisticas;
    } catch (error) {
      console.error('❌ [EmpresaEquipoController] Error en getEjecutivaEstadisticas:', error);
      throw new HttpException(
        'Error al obtener estadísticas de ejecutiva',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('ejecutiva/:id/clientes')
  @UseGuards(JwtAuthGuard)
  async getEmpresaEjecutivaClientes(@Param('id') ejecutivaId: string, @Query('empresaId') empresaId: string, @Req() req) {
    try {
      console.log('👥 [EmpresaEquipoController] === OBTENER CLIENTES EJECUTIVA ===');
      
      const idEmpresa = this.getEmpresaId(req, empresaId);
      const idEjecutiva = parseInt(ejecutivaId);
      
      if (isNaN(idEjecutiva)) {
        throw new HttpException('ID de ejecutiva inválido', HttpStatus.BAD_REQUEST);
      }

      const clientes = await this.dashboardService.getClientesPorEjecutiva(idEjecutiva, idEmpresa);
      
      console.log(`✅ [EmpresaEquipoController] ${clientes.length} clientes de ejecutiva obtenidos`);
      return clientes;
    } catch (error) {
      console.error('❌ [EmpresaEquipoController] Error en getEjecutivaClientes:', error);
      throw new HttpException(
        'Error al obtener clientes de ejecutiva',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

}