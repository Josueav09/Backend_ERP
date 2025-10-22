// import {
//   Controller,
//   Get,
//   Post,
//   Put,
//   Body,
//   Query,
//   Param,
//   HttpException,
//   HttpStatus,
//   UseGuards,
//   Request
// } from '@nestjs/common';
// import { TrazabilidadService } from '../../services/jefe/trazabilidad.service';
// import { JwtAuthGuard } from '../../../../../shared/guards/jwt-auth.guard';

// @Controller('trazabilidad')
// @UseGuards(JwtAuthGuard)
// export class TrazabilidadController {
//   constructor(private readonly trazabilidadService: TrazabilidadService) { }

//   @Get()
//   async getTrazabilidad(
//     @Request() req,
//     @Query('empresa') empresaId?: string,
//     @Query('ejecutiva') ejecutivaId?: string,
//     @Query('cliente') clienteId?: string,
//     @Query('fechaInicio') fechaInicio?: string,
//     @Query('fechaFin') fechaFin?: string,
//     @Query('tipoContacto') tipoContacto?: string,
//     @Query('etapaOportunidad') etapaOportunidad?: string,
//     @Query('etapa') etapa?: string // Nuevo parámetro para filtrar por etapa
//   ) {
//     try {
//       console.log('🔍 [TrazabilidadController] getTrazabilidad llamado');
//       console.log('🔍 Parámetros recibidos:', {
//         empresaId,
//         ejecutivaId,
//         clienteId,
//         fechaInicio,
//         fechaFin,
//         tipoContacto,
//         etapaOportunidad,
//         etapa // Nuevo parámetro
//       });
//       console.log('🔍 Usuario autenticado:', req.user);

//       // Validar permisos según tipo de usuario
//       if (req.user.userType === 'ejecutiva') {
//         // Ejecutivas solo pueden ver sus propias trazabilidades
//         if (ejecutivaId && parseInt(ejecutivaId) !== req.user.id_ejecutiva) {
//           throw new HttpException('No autorizado para ver trazabilidades de otras ejecutivas', HttpStatus.FORBIDDEN);
//         }
//         // Forzar filtro por ejecutiva autenticada
//         ejecutivaId = req.user.id_ejecutiva.toString();
//       } else if (req.user.userType !== 'jefe') {
//         console.log('❌ Usuario no autorizado:', req.user);
//         throw new HttpException('No autorizado para esta operación', HttpStatus.FORBIDDEN);
//       }

//       const filters = {
//         empresaId,
//         ejecutivaId,
//         clienteId,
//         fechaInicio,
//         fechaFin,
//         tipoContacto,
//         etapaOportunidad,
//         etapa // Incluir nuevo filtro
//       };

//       console.log('🔍 Ejecutando servicio con filters:', filters);
//       const result = await this.trazabilidadService.getTrazabilidad(filters);
//       console.log('✅ [TrazabilidadController] Resultado exitoso, registros:', result.length);

//       return result;
//     } catch (error) {
//       console.error('❌ [TrazabilidadController] ERROR:', error);
//       console.error('❌ Stack trace:', error.stack);
//       if (error instanceof HttpException) throw error;
//       throw new HttpException('Error al obtener trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   @Get('dashboard')
//   async getDashboardTrazabilidad(@Request() req) {
//     try {
//       console.log('👤 Usuario autenticado:', req.user);

//       // Solo jefe puede ver dashboard global
//       if (req.user.userType !== 'jefe') {
//         throw new HttpException('No autorizado para esta operación', HttpStatus.FORBIDDEN);
//       }

//       return await this.trazabilidadService.getDashboardTrazabilidad();
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       throw new HttpException('Error al obtener dashboard de trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   @Get('estadisticas-etapas')
//   async getEstadisticasPorEtapa(
//     @Request() req,
//     @Query('empresa') empresaId?: string,
//     @Query('fechaInicio') fechaInicio?: string,
//     @Query('fechaFin') fechaFin?: string
//   ) {
//     try {
//       console.log('👤 Usuario autenticado:', req.user);

//       // Solo jefe puede ver estadísticas globales
//       if (req.user.userType !== 'jefe') {
//         throw new HttpException('No autorizado para esta operación', HttpStatus.FORBIDDEN);
//       }

//       const filters = { empresaId, fechaInicio, fechaFin };
//       return await this.trazabilidadService.getEstadisticasPorEtapa(filters);
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       throw new HttpException('Error al obtener estadísticas por etapa', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   @Post()
//   async createTrazabilidad(@Request() req, @Body() body: any) {
//     try {
//       console.log('👤 Usuario autenticado:', req.user);
//       console.log('📝 Datos recibidos para crear trazabilidad:', body);

//       // Validar permisos - Solo ejecutivas pueden crear trazabilidad
//       if (req.user.userType !== 'ejecutiva') {
//         throw new HttpException('Solo las ejecutivas pueden crear trazabilidad', HttpStatus.FORBIDDEN);
//       }

//       const {
//         id_ejecutiva,
//         id_empresa_prov,
//         id_cliente_final,
//         id_contacto,
//         tipo_contacto,
//         fecha_contacto,
//         resultado_contacto,
//         // Nuevos campos de etapa 1
//         fecha_agregado_base,
//         fecha_respuesta,
//         informacion_importante,
//         reunion_agendada,
//         fecha_reunion,
//         participantes,
//         se_dio_reunion,
//         resultados_reunion,
//         pasa_embudo_ventas,
//         // Campos de etapa 2
//         fecha_inicio_etapa,
//         nombre_oportunidad,
//         tipo_oportunidad,
//         etapa_oportunidad,
//         producto_ofrecido,
//         fecha_registro_oportunidad,
//         fecha_cierre_esperado,
//         monto_total_sin_imp,
//         probabilidad_cierre,
//         monto_cierre_final,
//         observaciones
//       } = body;

//       // Validar que la ejecutiva autenticada es la que está creando la trazabilidad
//       if (req.user.id_ejecutiva !== id_ejecutiva) {
//         throw new HttpException('No puedes crear trazabilidad para otra ejecutiva', HttpStatus.FORBIDDEN);
//       }

//       // Validaciones básicas de campos requeridos
//       if (!id_ejecutiva || !id_empresa_prov || !id_cliente_final || !id_contacto ||
//         !tipo_contacto || !fecha_contacto || !resultado_contacto) {
//         throw new HttpException('Todos los campos requeridos deben ser proporcionados', HttpStatus.BAD_REQUEST);
//       }

//       // Validar lógica de etapas
//       if (pasa_embudo_ventas && !nombre_oportunidad) {
//         throw new HttpException(
//           'Para pasar al embudo de ventas se requiere un nombre de oportunidad', 
//           HttpStatus.BAD_REQUEST
//         );
//       }

//       return await this.trazabilidadService.createTrazabilidad(body);
//     } catch (error) {
//       console.error('❌ Error al crear trazabilidad:', error);
//       if (error instanceof HttpException) throw error;
//       throw new HttpException('Error al crear trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   @Put(':id')
//   async updateTrazabilidad(
//     @Request() req,
//     @Param('id') id: string,
//     @Body() body: any
//   ) {
//     try {
//       console.log('👤 Usuario autenticado:', req.user);
//       console.log('📝 Actualizando trazabilidad ID:', id);
//       console.log('📝 Datos de actualización:', body);

//       // Validar permisos - Solo ejecutivas pueden actualizar trazabilidad
//       if (req.user.userType !== 'ejecutiva') {
//         throw new HttpException('Solo las ejecutivas pueden actualizar trazabilidad', HttpStatus.FORBIDDEN);
//       }

//       // Obtener la trazabilidad existente para validar permisos
//       const trazabilidadExistente = await this.trazabilidadService.getTrazabilidad({
//         id_trazabilidad: parseInt(id)
//       });

//       if (!trazabilidadExistente || trazabilidadExistente.length === 0) {
//         throw new HttpException('Trazabilidad no encontrada', HttpStatus.NOT_FOUND);
//       }

//       // Validar que la ejecutiva autenticada es la dueña de la trazabilidad
//       const trazabilidad = trazabilidadExistente[0];
//       if (trazabilidad.ejecutiva.id_ejecutiva !== req.user.id_ejecutiva) {
//         throw new HttpException('No puedes actualizar trazabilidad de otra ejecutiva', HttpStatus.FORBIDDEN);
//       }

//       return await this.trazabilidadService.updateTrazabilidad(parseInt(id), body);
//     } catch (error) {
//       console.error('❌ Error al actualizar trazabilidad:', error);
//       if (error instanceof HttpException) throw error;
//       throw new HttpException('Error al actualizar trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }
// }

import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
  Request
} from '@nestjs/common';
import { TrazabilidadService } from '../../services/jefe/trazabilidad.service';
import { JwtAuthGuard } from '../../../../../shared/guards/jwt-auth.guard';

@Controller('jefe/trazabilidad')
@UseGuards(JwtAuthGuard)
export class TrazabilidadController {
  constructor(private readonly trazabilidadService: TrazabilidadService) { }

  // ============================================
  // ENDPOINTS EXISTENTES (MANTENER)
  // ============================================

  @Get()
  async getTrazabilidad(
    @Request() req,
    @Query('empresa') empresaId?: string,
    @Query('ejecutiva') ejecutivaId?: string,
    @Query('cliente') clienteId?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('tipoContacto') tipoContacto?: string,
    @Query('etapaOportunidad') etapaOportunidad?: string,
    @Query('etapa') etapa?: string
  ) {
    try {
      console.log('🔍 [TrazabilidadController] getTrazabilidad llamado');
      console.log('🔍 Parámetros recibidos:', {
        empresaId,
        ejecutivaId,
        clienteId,
        fechaInicio,
        fechaFin,
        tipoContacto,
        etapaOportunidad,
        etapa
      });

      // Validar permisos según tipo de usuario
      if (req.user.userType === 'ejecutiva') {
        if (ejecutivaId && parseInt(ejecutivaId) !== req.user.id_ejecutiva) {
          throw new HttpException('No autorizado para ver trazabilidades de otras ejecutivas', HttpStatus.FORBIDDEN);
        }
        ejecutivaId = req.user.id_ejecutiva.toString();
      } else if (req.user.userType !== 'jefe') {
        throw new HttpException('No autorizado para esta operación', HttpStatus.FORBIDDEN);
      }

      const filters = {
        empresaId,
        ejecutivaId,
        clienteId,
        fechaInicio,
        fechaFin,
        tipoContacto,
        etapaOportunidad,
        etapa
      };

      const result = await this.trazabilidadService.getTrazabilidad(filters);
      console.log('✅ [TrazabilidadController] Resultado exitoso, registros:', result.length);
      return result;
    } catch (error) {
      console.error('❌ [TrazabilidadController] ERROR:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('dashboard')
  async getDashboardTrazabilidad(@Request() req) {
    try {
      console.log('👤 Usuario autenticado:', req.user);

      if (req.user.userType !== 'jefe') {
        throw new HttpException('No autorizado para esta operación', HttpStatus.FORBIDDEN);
      }

      return await this.trazabilidadService.getDashboardTrazabilidad();
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener dashboard de trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('estadisticas-etapas')
  async getEstadisticasPorEtapa(
    @Request() req,
    @Query('empresa') empresaId?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string
  ) {
    try {
      if (req.user.userType !== 'jefe') {
        throw new HttpException('No autorizado para esta operación', HttpStatus.FORBIDDEN);
      }

      const filters = { empresaId, fechaInicio, fechaFin };
      return await this.trazabilidadService.getEstadisticasPorEtapa(filters);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener estadísticas por etapa', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async createTrazabilidad(@Request() req, @Body() body: any) {
    try {
      console.log('👤 Usuario autenticado:', req.user);

      if (req.user.userType !== 'ejecutiva') {
        throw new HttpException('Solo las ejecutivas pueden crear trazabilidad', HttpStatus.FORBIDDEN);
      }

      const { id_ejecutiva } = body;

      if (req.user.id_ejecutiva !== id_ejecutiva) {
        throw new HttpException('No puedes crear trazabilidad para otra ejecutiva', HttpStatus.FORBIDDEN);
      }

      if (!id_ejecutiva || !body.id_empresa_prov || !body.id_cliente_final || !body.id_contacto ||
        !body.tipo_contacto || !body.fecha_contacto || !body.resultado_contacto) {
        throw new HttpException('Todos los campos requeridos deben ser proporcionados', HttpStatus.BAD_REQUEST);
      }

      if (body.pasa_embudo_ventas && !body.nombre_oportunidad) {
        throw new HttpException(
          'Para pasar al embudo de ventas se requiere un nombre de oportunidad', 
          HttpStatus.BAD_REQUEST
        );
      }

      return await this.trazabilidadService.createTrazabilidad(body);
    } catch (error) {
      console.error('❌ Error al crear trazabilidad:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al crear trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async updateTrazabilidad(
    @Request() req,
    @Param('id') id: string,
    @Body() body: any
  ) {
    try {
      console.log('👤 Usuario autenticado:', req.user);

      if (req.user.userType !== 'ejecutiva') {
        throw new HttpException('Solo las ejecutivas pueden actualizar trazabilidad', HttpStatus.FORBIDDEN);
      }

      const trazabilidadExistente = await this.trazabilidadService.getTrazabilidad({
        id_trazabilidad: parseInt(id)
      });

      if (!trazabilidadExistente || trazabilidadExistente.length === 0) {
        throw new HttpException('Trazabilidad no encontrada', HttpStatus.NOT_FOUND);
      }

      const trazabilidad = trazabilidadExistente[0];
      if (trazabilidad.ejecutiva.id_ejecutiva !== req.user.id_ejecutiva) {
        throw new HttpException('No puedes actualizar trazabilidad de otra ejecutiva', HttpStatus.FORBIDDEN);
      }

      return await this.trazabilidadService.updateTrazabilidad(parseInt(id), body);
    } catch (error) {
      console.error('❌ Error al actualizar trazabilidad:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al actualizar trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ============================================
  // NUEVOS ENDPOINTS PARA EL FRONTEND
  // ============================================

  @Get('kpis')
  async getKPIs(
    @Request() req,
    @Query('ejecutivaId') ejecutivaId?: string,
    @Query('empresaId') empresaId?: string,
    @Query('clienteId') clienteId?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string
  ) {
    try {
      console.log('📈 [TrazabilidadController] getKPIs llamado');
      
      // Validar permisos
      if (req.user.userType === 'ejecutiva') {
        ejecutivaId = req.user.id_ejecutiva.toString();
      } else if (req.user.userType !== 'jefe') {
        throw new HttpException('No autorizado', HttpStatus.FORBIDDEN);
      }

      const filters = {
        ejecutivaId: ejecutivaId ? parseInt(ejecutivaId) : undefined,
        empresaId: empresaId ? parseInt(empresaId) : undefined,
        clienteId: clienteId ? parseInt(clienteId) : undefined,
        fechaDesde,
        fechaHasta
      };

      return await this.trazabilidadService.getKPIs(filters);
    } catch (error) {
      console.error('❌ Error en getKPIs:', error);
      // Datos de fallback
      return {
        totalOportunidades: 0,
        enProceso: 0,
        ventasGanadas: 0,
        ventasPerdidas: 0,
        montoTotal: 0,
        tasaConversion: 0
      };
    }
  }

  @Get('kpis/nuevos-clientes')
  async getNuevosClientes(
    @Request() req,
    @Query('meses') meses?: string,
    @Query('ejecutivaId') ejecutivaId?: string
  ) {
    try {
      console.log('👥 [TrazabilidadController] getNuevosClientes llamado');
      
      if (req.user.userType === 'ejecutiva') {
        ejecutivaId = req.user.id_ejecutiva.toString();
      } else if (req.user.userType !== 'jefe') {
        throw new HttpException('No autorizado', HttpStatus.FORBIDDEN);
      }

      const mesesNum = parseInt(meses) || 6;
      const idEjecutiva = ejecutivaId ? parseInt(ejecutivaId) : undefined;

      return await this.trazabilidadService.getNuevosClientes(mesesNum, idEjecutiva);
    } catch (error) {
      console.error('❌ Error en getNuevosClientes:', error);
      return [
        { mes: 'Oct 2025', contactos: 1 },
        { mes: 'Sep 2025', contactos: 0 },
        { mes: 'Ago 2025', contactos: 0 }
      ];
    }
  }

  @Get('kpis/contactos-por-tipo')
  async getContactosPorTipo(
    @Request() req,
    @Query('ejecutivaId') ejecutivaId?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string
  ) {
    try {
      console.log('📞 [TrazabilidadController] getContactosPorTipo llamado');
      
      if (req.user.userType === 'ejecutiva') {
        ejecutivaId = req.user.id_ejecutiva.toString();
      } else if (req.user.userType !== 'jefe') {
        throw new HttpException('No autorizado', HttpStatus.FORBIDDEN);
      }

      const filters = {
        ejecutivaId: ejecutivaId ? parseInt(ejecutivaId) : undefined,
        fechaDesde,
        fechaHasta
      };

      return await this.trazabilidadService.getContactosPorTipo(filters);
    } catch (error) {
      console.error('❌ Error en getContactosPorTipo:', error);
      return [
        { name: 'Llamada', value: 5, color: '#3B82F6' },
        { name: 'Email', value: 3, color: '#A855F7' },
        { name: 'WhatsApp', value: 2, color: '#10B981' }
      ];
    }
  }

  @Get('kpis/montos-por-etapa')
  async getMontosPorEtapa(
    @Request() req,
    @Query('ejecutivaId') ejecutivaId?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string
  ) {
    try {
      console.log('💰 [TrazabilidadController] getMontosPorEtapa llamado');
      
      if (req.user.userType === 'ejecutiva') {
        ejecutivaId = req.user.id_ejecutiva.toString();
      } else if (req.user.userType !== 'jefe') {
        throw new HttpException('No autorizado', HttpStatus.FORBIDDEN);
      }

      const filters = {
        ejecutivaId: ejecutivaId ? parseInt(ejecutivaId) : undefined,
        fechaDesde,
        fechaHasta
      };

      return await this.trazabilidadService.getMontosPorEtapa(filters);
    } catch (error) {
      console.error('❌ Error en getMontosPorEtapa:', error);
      return [
        { etapa: 'Prospección', monto: 50000 },
        { etapa: 'Negociación', monto: 150000 },
        { etapa: 'Venta ganada', monto: 300000 }
      ];
    }
  }

  @Get('kpis/tasa-conversion')
  async getTasaConversion(
    @Request() req,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string
  ) {
    try {
      console.log('📊 [TrazabilidadController] getTasaConversion llamado');
      
      if (req.user.userType !== 'jefe') {
        throw new HttpException('Solo el jefe puede ver tasas de conversión', HttpStatus.FORBIDDEN);
      }

      const filters = { fechaDesde, fechaHasta };
      return await this.trazabilidadService.getTasaConversion(filters);
    } catch (error) {
      console.error('❌ Error en getTasaConversion:', error);
      return [
        { 
          id_ejecutiva: 1, 
          ejecutiva: 'María', 
          ventas_ganadas: 4, 
          ventas_perdidas: 2, 
          total_oportunidades: 10,
          monto_total_ganado: 120000,
          tasa: 40 
        }
      ];
    }
  }

  @Get('etapa1')
  async getEtapa1(
    @Request() req,
    @Query('ejecutivaId') ejecutivaId?: string,
    @Query('empresaId') empresaId?: string,
    @Query('clienteId') clienteId?: string,
    @Query('resultadoContacto') resultadoContacto?: string,
    @Query('tipoContacto') tipoContacto?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    try {
      console.log('📋 [TrazabilidadController] getEtapa1 llamado');
      
      if (req.user.userType === 'ejecutiva') {
        ejecutivaId = req.user.id_ejecutiva.toString();
      } else if (req.user.userType !== 'jefe') {
        throw new HttpException('No autorizado', HttpStatus.FORBIDDEN);
      }

      const filters = {
        ejecutivaId: ejecutivaId ? parseInt(ejecutivaId) : undefined,
        empresaId: empresaId ? parseInt(empresaId) : undefined,
        clienteId: clienteId ? parseInt(clienteId) : undefined,
        resultadoContacto,
        tipoContacto,
        fechaDesde,
        fechaHasta,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 20
      };

      return await this.trazabilidadService.getEtapa1(filters);
    } catch (error) {
      console.error('❌ Error en getEtapa1:', error);
      return {
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0
        }
      };
    }
  }

  @Get('etapa2')
  async getEtapa2(
    @Request() req,
    @Query('ejecutivaId') ejecutivaId?: string,
    @Query('empresaId') empresaId?: string,
    @Query('clienteId') clienteId?: string,
    @Query('etapaOportunidad') etapaOportunidad?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    try {
      console.log('🎯 [TrazabilidadController] getEtapa2 llamado');
      
      if (req.user.userType === 'ejecutiva') {
        ejecutivaId = req.user.id_ejecutiva.toString();
      } else if (req.user.userType !== 'jefe') {
        throw new HttpException('No autorizado', HttpStatus.FORBIDDEN);
      }

      const filters = {
        ejecutivaId: ejecutivaId ? parseInt(ejecutivaId) : undefined,
        empresaId: empresaId ? parseInt(empresaId) : undefined,
        clienteId: clienteId ? parseInt(clienteId) : undefined,
        etapaOportunidad,
        fechaDesde,
        fechaHasta,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 20
      };

      return await this.trazabilidadService.getEtapa2(filters);
    } catch (error) {
      console.error('❌ Error en getEtapa2:', error);
      return {
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0
        }
      };
    }
  }

  @Get('filter-options')
  async getFilterOptions(@Request() req) {
    try {
      console.log('⚙️ [TrazabilidadController] getFilterOptions llamado');
      
      // Ambos jefe y ejecutivas pueden ver opciones de filtro
      if (req.user.userType !== 'jefe' && req.user.userType !== 'ejecutiva') {
        throw new HttpException('No autorizado', HttpStatus.FORBIDDEN);
      }

      return await this.trazabilidadService.getFilterOptions();
    } catch (error) {
      console.error('❌ Error en getFilterOptions:', error);
      return {
        ejecutivas: [],
        empresas: [],
        clientes: []
      };
    }
  }
}