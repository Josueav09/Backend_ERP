// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Query,
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
//     @Query('etapaOportunidad') etapaOportunidad?: string
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
//         etapaOportunidad
//       });
//       console.log('🔍 Usuario autenticado:', req.user);

//       // Validar que el usuario es JEFE
//       if (req.user.userType !== 'jefe') {
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
//         etapaOportunidad
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

//   @Post()
//   async createTrazabilidad(@Request() req, @Body() body: any) {
//     try {
//       console.log('👤 Usuario autenticado:', req.user);

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
//         etapa_oportunidad
//       } = body;

//       // Validar que la ejecutiva autenticada es la que está creando la trazabilidad
//       if (req.user.id_ejecutiva !== id_ejecutiva) {
//         throw new HttpException('No puedes crear trazabilidad para otra ejecutiva', HttpStatus.FORBIDDEN);
//       }

//       if (!id_ejecutiva || !id_empresa_prov || !id_cliente_final || !id_contacto ||
//         !tipo_contacto || !fecha_contacto || !resultado_contacto || !etapa_oportunidad) {
//         throw new HttpException('Todos los campos requeridos deben ser proporcionados', HttpStatus.BAD_REQUEST);
//       }

//       return await this.trazabilidadService.createTrazabilidad(body);
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       throw new HttpException('Error al crear trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
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

@Controller('trazabilidad')
@UseGuards(JwtAuthGuard)
export class TrazabilidadController {
  constructor(private readonly trazabilidadService: TrazabilidadService) { }

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
    @Query('etapa') etapa?: string // Nuevo parámetro para filtrar por etapa
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
        etapa // Nuevo parámetro
      });
      console.log('🔍 Usuario autenticado:', req.user);

      // Validar permisos según tipo de usuario
      if (req.user.userType === 'ejecutiva') {
        // Ejecutivas solo pueden ver sus propias trazabilidades
        if (ejecutivaId && parseInt(ejecutivaId) !== req.user.id_ejecutiva) {
          throw new HttpException('No autorizado para ver trazabilidades de otras ejecutivas', HttpStatus.FORBIDDEN);
        }
        // Forzar filtro por ejecutiva autenticada
        ejecutivaId = req.user.id_ejecutiva.toString();
      } else if (req.user.userType !== 'jefe') {
        console.log('❌ Usuario no autorizado:', req.user);
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
        etapa // Incluir nuevo filtro
      };

      console.log('🔍 Ejecutando servicio con filters:', filters);
      const result = await this.trazabilidadService.getTrazabilidad(filters);
      console.log('✅ [TrazabilidadController] Resultado exitoso, registros:', result.length);

      return result;
    } catch (error) {
      console.error('❌ [TrazabilidadController] ERROR:', error);
      console.error('❌ Stack trace:', error.stack);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('dashboard')
  async getDashboardTrazabilidad(@Request() req) {
    try {
      console.log('👤 Usuario autenticado:', req.user);

      // Solo jefe puede ver dashboard global
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
      console.log('👤 Usuario autenticado:', req.user);

      // Solo jefe puede ver estadísticas globales
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
      console.log('📝 Datos recibidos para crear trazabilidad:', body);

      // Validar permisos - Solo ejecutivas pueden crear trazabilidad
      if (req.user.userType !== 'ejecutiva') {
        throw new HttpException('Solo las ejecutivas pueden crear trazabilidad', HttpStatus.FORBIDDEN);
      }

      const {
        id_ejecutiva,
        id_empresa_prov,
        id_cliente_final,
        id_contacto,
        tipo_contacto,
        fecha_contacto,
        resultado_contacto,
        // Nuevos campos de etapa 1
        fecha_agregado_base,
        fecha_respuesta,
        informacion_importante,
        reunion_agendada,
        fecha_reunion,
        participantes,
        se_dio_reunion,
        resultados_reunion,
        pasa_embudo_ventas,
        // Campos de etapa 2
        fecha_inicio_etapa,
        nombre_oportunidad,
        tipo_oportunidad,
        etapa_oportunidad,
        producto_ofrecido,
        fecha_registro_oportunidad,
        fecha_cierre_esperado,
        monto_total_sin_imp,
        probabilidad_cierre,
        monto_cierre_final,
        observaciones
      } = body;

      // Validar que la ejecutiva autenticada es la que está creando la trazabilidad
      if (req.user.id_ejecutiva !== id_ejecutiva) {
        throw new HttpException('No puedes crear trazabilidad para otra ejecutiva', HttpStatus.FORBIDDEN);
      }

      // Validaciones básicas de campos requeridos
      if (!id_ejecutiva || !id_empresa_prov || !id_cliente_final || !id_contacto ||
        !tipo_contacto || !fecha_contacto || !resultado_contacto) {
        throw new HttpException('Todos los campos requeridos deben ser proporcionados', HttpStatus.BAD_REQUEST);
      }

      // Validar lógica de etapas
      if (pasa_embudo_ventas && !nombre_oportunidad) {
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
      console.log('📝 Actualizando trazabilidad ID:', id);
      console.log('📝 Datos de actualización:', body);

      // Validar permisos - Solo ejecutivas pueden actualizar trazabilidad
      if (req.user.userType !== 'ejecutiva') {
        throw new HttpException('Solo las ejecutivas pueden actualizar trazabilidad', HttpStatus.FORBIDDEN);
      }

      // Obtener la trazabilidad existente para validar permisos
      const trazabilidadExistente = await this.trazabilidadService.getTrazabilidad({
        id_trazabilidad: parseInt(id)
      });

      if (!trazabilidadExistente || trazabilidadExistente.length === 0) {
        throw new HttpException('Trazabilidad no encontrada', HttpStatus.NOT_FOUND);
      }

      // Validar que la ejecutiva autenticada es la dueña de la trazabilidad
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
}