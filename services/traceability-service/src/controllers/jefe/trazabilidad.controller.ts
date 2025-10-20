// import { Controller, Get, Post, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
// import { TrazabilidadService } from '../../services/jefe/trazabilidad.service';

// @Controller('trazabilidad')
// export class TrazabilidadController {
//   constructor(private readonly trazabilidadService: TrazabilidadService) {}

//   @Get()
//   async getTrazabilidad(
//     @Query('empresa') empresaId?: string,
//     @Query('ejecutiva') ejecutivaId?: string,
//     @Query('cliente') clienteId?: string,
//     @Query('fechaInicio') fechaInicio?: string,
//     @Query('fechaFin') fechaFin?: string,
//     @Query('tipoContacto') tipoContacto?: string,
//     @Query('etapaOportunidad') etapaOportunidad?: string
//   ) {
//     try {
//       const filters = {
//         empresaId,
//         ejecutivaId,
//         clienteId,
//         fechaInicio,
//         fechaFin,
//         tipoContacto,
//         etapaOportunidad
//       };

//       return await this.trazabilidadService.getTrazabilidad(filters);
//     } catch (error) {
//       throw new HttpException('Error al obtener trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   @Get('dashboard')
//   async getDashboardTrazabilidad() {
//     try {
//       return await this.trazabilidadService.getDashboardTrazabilidad();
//     } catch (error) {
//       throw new HttpException('Error al obtener dashboard de trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   @Post()
//   async createTrazabilidad(@Body() body: any) {
//     try {
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

//       if (!id_ejecutiva || !id_empresa_prov || !id_cliente_final || !id_contacto || 
//           !tipo_contacto || !fecha_contacto || !resultado_contacto || !etapa_oportunidad) {
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
  Body,
  Query,
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

  // @Get()
  // async getTrazabilidad(
  //   @Request() req,
  //   @Query('empresa') empresaId?: string,
  //   @Query('ejecutiva') ejecutivaId?: string,
  //   @Query('cliente') clienteId?: string,
  //   @Query('fechaInicio') fechaInicio?: string,
  //   @Query('fechaFin') fechaFin?: string,
  //   @Query('tipoContacto') tipoContacto?: string,
  //   @Query('etapaOportunidad') etapaOportunidad?: string
  // ) {
  //   try {
  //     console.log('👤 Usuario autenticado:', req.user);

  //     // Validar que el usuario es JEFE
  //     if (req.user.userType !== 'jefe') {
  //       throw new HttpException('No autorizado para esta operación', HttpStatus.FORBIDDEN);
  //     }

  //     const filters = {
  //       empresaId,
  //       ejecutivaId,
  //       clienteId,
  //       fechaInicio,
  //       fechaFin,
  //       tipoContacto,
  //       etapaOportunidad
  //     };

  //     return await this.trazabilidadService.getTrazabilidad(filters);
  //   } catch (error) {
  //     if (error instanceof HttpException) throw error;
  //     throw new HttpException('Error al obtener trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  @Get()
  async getTrazabilidad(
    @Request() req,
    @Query('empresa') empresaId?: string,
    @Query('ejecutiva') ejecutivaId?: string,
    @Query('cliente') clienteId?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('tipoContacto') tipoContacto?: string,
    @Query('etapaOportunidad') etapaOportunidad?: string
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
        etapaOportunidad
      });
      console.log('🔍 Usuario autenticado:', req.user);

      // Validar que el usuario es JEFE
      if (req.user.userType !== 'jefe') {
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
        etapaOportunidad
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

  @Post()
  async createTrazabilidad(@Request() req, @Body() body: any) {
    try {
      console.log('👤 Usuario autenticado:', req.user);

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
        etapa_oportunidad
      } = body;

      // Validar que la ejecutiva autenticada es la que está creando la trazabilidad
      if (req.user.id_ejecutiva !== id_ejecutiva) {
        throw new HttpException('No puedes crear trazabilidad para otra ejecutiva', HttpStatus.FORBIDDEN);
      }

      if (!id_ejecutiva || !id_empresa_prov || !id_cliente_final || !id_contacto ||
        !tipo_contacto || !fecha_contacto || !resultado_contacto || !etapa_oportunidad) {
        throw new HttpException('Todos los campos requeridos deben ser proporcionados', HttpStatus.BAD_REQUEST);
      }

      return await this.trazabilidadService.createTrazabilidad(body);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al crear trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}