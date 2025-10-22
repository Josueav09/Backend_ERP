// backend/services/traceability-service/src/controllers/ejecutiva/ejecutiva.controller.ts - CORREGIDO
// import { Controller, Get, Post, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
// import { EjecutivaTraceabilityService } from '../../services/ejecutiva/ejecutiva.service';

// @Controller('ejecutiva')
// export class EjecutivaTraceabilityController {
//   constructor(private readonly ejecutivaTraceabilityService: EjecutivaTraceabilityService) {}

//   @Get('trazabilidad')
//   async getTrazabilidad(@Query('ejecutivaId') ejecutivaId: string) {
//     if (!ejecutivaId) {
//       throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
//     }

//     try {
//       return await this.ejecutivaTraceabilityService.getTrazabilidad(ejecutivaId);
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       throw new HttpException('Error al obtener trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   @Post('trazabilidad')
//   async createTrazabilidad(@Body() body: any) {
//     const { 
//       id_ejecutiva, 
//       id_empresa_prov,  // ✅ Cambiado de id_empresa
//       id_cliente_final,  // ✅ Cambiado de id_cliente
//       id_contacto,
//       tipo_contacto,     // ✅ Cambiado de tipo_actividad
//       fecha_contacto,
//       resultado_contacto // ✅ Cambiado de estado
//     } = body;

//     if (!id_ejecutiva || !id_empresa_prov || !id_cliente_final || !id_contacto) {
//       throw new HttpException('Ejecutiva, empresa, cliente y contacto requeridos', HttpStatus.BAD_REQUEST);
//     }

//     try {
//       return await this.ejecutivaTraceabilityService.createTrazabilidad({
//         id_ejecutiva,
//         id_empresa_prov,
//         id_cliente_final,
//         id_contacto,
//         tipo_contacto,
//         fecha_contacto: fecha_contacto ? new Date(fecha_contacto) : new Date(),
//         resultado_contacto,
//         informacion_importante: body.informacion_importante,
//         reunion_agendada: body.reunion_agendada,
//         fecha_reunion: body.fecha_reunion ? new Date(body.fecha_reunion) : undefined,
//         participantes: body.participantes,
//         se_dio_reunion: body.se_dio_reunion,
//         resultados_reunion: body.resultados_reunion,
//         pasa_embudo_ventas: body.pasa_embudo_ventas,
//         nombre_oportunidad: body.nombre_oportunidad,
//         etapa_oportunidad: body.etapa_oportunidad,
//         producto_ofrecido: body.producto_ofrecido,
//         monto_total_sin_imp: body.monto_total_sin_imp,
//         probabilidad_cierre: body.probabilidad_cierre,
//         observaciones: body.observaciones
//       });
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       throw new HttpException('Error al crear trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   // ✅ NUEVO ENDPOINT: Pipeline de ventas
//   @Get('pipeline')
//   async getPipeline(@Query('ejecutivaId') ejecutivaId: string) {
//     if (!ejecutivaId) {
//       throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
//     }

//     try {
//       return await this.ejecutivaTraceabilityService.getPipeline(ejecutivaId);
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       throw new HttpException('Error al obtener pipeline', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   // ✅ NUEVO ENDPOINT: Actividades recientes
//   @Get('actividades')
//   async getActividadesRecientes(
//     @Query('ejecutivaId') ejecutivaId: string,
//     @Query('limit') limit: string = '10'
//   ) {
//     if (!ejecutivaId) {
//       throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
//     }

//     try {
//       return await this.ejecutivaTraceabilityService.getActividadesRecientes(
//         ejecutivaId, 
//         parseInt(limit)
//       );
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       throw new HttpException('Error al obtener actividades', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }
// }
// backend/services/traceability-service/src/controllers/ejecutiva/ejecutiva.controller.ts - CORREGIDO
import { Controller, Get, Post, Put, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { EjecutivaTraceabilityService } from '../../services/ejecutiva/ejecutiva.service';

@Controller('ejecutiva/trazabilidad')
export class EjecutivaTraceabilityController {
  constructor(private readonly ejecutivaTraceabilityService: EjecutivaTraceabilityService) {}

  @Get()
  async getTrazabilidad(@Query('ejecutivaId') ejecutivaId: string) {
    if (!ejecutivaId) {
      throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaTraceabilityService.getTrazabilidad(ejecutivaId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async createTrazabilidad(@Body() body: any) {
    const { 
      id_ejecutiva, 
      id_empresa_prov,
      id_cliente_final,
      id_contacto,
      tipo_contacto,
      fecha_contacto,
      resultado_contacto
    } = body;

    if (!id_ejecutiva || !id_empresa_prov || !id_cliente_final || !id_contacto) {
      throw new HttpException('Ejecutiva, empresa, cliente y contacto requeridos', HttpStatus.BAD_REQUEST);
    }

    // Validar tipo_contacto
    const tiposValidos = ['Llamada telefónica', 'Chat de Whatsapp', 'Correo electrónico', 'Contacto por linkedin', 'Reunión presencial', 'Otro'];
    if (!tiposValidos.includes(tipo_contacto)) {
      throw new HttpException('Tipo de contacto no válido', HttpStatus.BAD_REQUEST);
    }

    // Validar resultado_contacto
    const resultadosValidos = ['Positivo', 'Negativo', 'Pendiente', 'Neutro'];
    if (!resultadosValidos.includes(resultado_contacto)) {
      throw new HttpException('Resultado de contacto no válido', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaTraceabilityService.createTrazabilidad({
        id_ejecutiva,
        id_empresa_prov,
        id_cliente_final,
        id_contacto,
        tipo_contacto,
        fecha_contacto: fecha_contacto ? new Date(fecha_contacto) : new Date(),
        resultado_contacto,
        informacion_importante: body.informacion_importante,
        reunion_agendada: body.reunion_agendada,
        fecha_reunion: body.fecha_reunion ? new Date(body.fecha_reunion) : undefined,
        participantes: body.participantes,
        se_dio_reunion: body.se_dio_reunion,
        resultados_reunion: body.resultados_reunion,
        pasa_embudo_ventas: body.pasa_embudo_ventas,
        nombre_oportunidad: body.nombre_oportunidad,
        etapa_oportunidad: body.etapa_oportunidad,
        producto_ofrecido: body.producto_ofrecido,
        monto_total_sin_imp: body.monto_total_sin_imp,
        probabilidad_cierre: body.probabilidad_cierre,
        observaciones: body.observaciones
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al crear trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('pipeline')
  async getPipeline(@Query('ejecutivaId') ejecutivaId: string) {
    if (!ejecutivaId) {
      throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaTraceabilityService.getPipeline(ejecutivaId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener pipeline', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('actividades')
  async getActividadesRecientes(
    @Query('ejecutivaId') ejecutivaId: string,
    @Query('limit') limit: string = '10'
  ) {
    if (!ejecutivaId) {
      throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaTraceabilityService.getActividadesRecientes(
        ejecutivaId, 
        parseInt(limit)
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener actividades', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ NUEVO ENDPOINT: Actualizar etapa de oportunidad
  @Put('etapa')
  async updateEtapaOportunidad(
    @Body() body: { 
      trazabilidadId: string; 
      nuevaEtapa: string;
      ejecutivaId: string;
    }
  ) {
    const { trazabilidadId, nuevaEtapa, ejecutivaId } = body;

    if (!trazabilidadId || !nuevaEtapa || !ejecutivaId) {
      throw new HttpException('ID de trazabilidad, nueva etapa y ejecutiva requeridos', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaTraceabilityService.updateEtapaOportunidad(
        trazabilidadId, 
        nuevaEtapa, 
        ejecutivaId
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al actualizar etapa', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}