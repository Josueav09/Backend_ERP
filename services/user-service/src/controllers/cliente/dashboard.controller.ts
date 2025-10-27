// import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
// import { ClienteDashboardService } from '../../services/cliente/dashboard.service';

// @Controller('cliente/dashboard')
// export class ClienteDashboardController {
//   constructor(private readonly dashboardService: ClienteDashboardService) {}

//   @Get('stats')
//   async getStats(@Query('clienteUsuarioId') clienteUsuarioId: string) {
//     try {
//       if (!clienteUsuarioId) {
//         throw new HttpException('ID de cliente requerido', HttpStatus.BAD_REQUEST);
//       }
//       return await this.dashboardService.getStats(clienteUsuarioId);
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       throw new HttpException('Error al obtener estadísticas', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }
// }

// user-service/src/empresa/empresa-dashboard.controller.ts
import { Controller, Get, Query, Req, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../../shared/guards/jwt-auth.guard';
import { EmpresaDashboardService } from '../../services/cliente/dashboard.service';

@Controller('empresa')
export class EmpresaDashboardController {
  constructor(private readonly dashboardService: EmpresaDashboardService) {}

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
  async getEjecutivaInfo(@Query('clienteUsuarioId') clienteUsuarioId: string, @Req() req) {
    try {
      console.log('👩‍💼 [EmpresaDashboardController] === OBTENER INFO EJECUTIVA ===');

      const empresaId = this.getEmpresaId(req, clienteUsuarioId);
      const ejecutivaInfo = await this.dashboardService.getEjecutivaInfo(empresaId);
      
      console.log('✅ [EmpresaDashboardController] Información de ejecutiva obtenida');
      return ejecutivaInfo;
    } catch (error) {
      console.error('❌ [EmpresaDashboardController] Error en getEjecutivaInfo:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error al obtener información de la ejecutiva',
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
}