// backend/services/traceability-service/src/controllers/ejecutiva/ejecutiva.controller.ts - CORREGIDO
// import { Controller, Get, Post, Put, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
// import { EjecutivaTraceabilityService } from '../../services/ejecutiva/ejecutiva.service';

// @Controller('ejecutiva/trazabilidad')
// export class EjecutivaTraceabilityController {
//   constructor(private readonly ejecutivaTraceabilityService: EjecutivaTraceabilityService) {}

//   @Get()
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

//   @Post()
//   async createTrazabilidad(@Body() body: any) {
//     const { 
//       id_ejecutiva, 
//       id_empresa_prov,
//       id_cliente_final,
//       id_contacto,
//       tipo_contacto,
//       fecha_contacto,
//       resultado_contacto
//     } = body;

//     if (!id_ejecutiva || !id_empresa_prov || !id_cliente_final || !id_contacto) {
//       throw new HttpException('Ejecutiva, empresa, cliente y contacto requeridos', HttpStatus.BAD_REQUEST);
//     }

//     // Validar tipo_contacto
//     const tiposValidos = ['Llamada telefónica', 'Chat de Whatsapp', 'Correo electrónico', 'Contacto por linkedin', 'Reunión presencial', 'Otro'];
//     if (!tiposValidos.includes(tipo_contacto)) {
//       throw new HttpException('Tipo de contacto no válido', HttpStatus.BAD_REQUEST);
//     }

//     // Validar resultado_contacto
//     const resultadosValidos = ['Positivo', 'Negativo', 'Pendiente', 'Neutro'];
//     if (!resultadosValidos.includes(resultado_contacto)) {
//       throw new HttpException('Resultado de contacto no válido', HttpStatus.BAD_REQUEST);
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

//   // ✅ NUEVO ENDPOINT: Actualizar etapa de oportunidad
//   @Put('etapa')
//   async updateEtapaOportunidad(
//     @Body() body: { 
//       trazabilidadId: string; 
//       nuevaEtapa: string;
//       ejecutivaId: string;
//     }
//   ) {
//     const { trazabilidadId, nuevaEtapa, ejecutivaId } = body;

//     if (!trazabilidadId || !nuevaEtapa || !ejecutivaId) {
//       throw new HttpException('ID de trazabilidad, nueva etapa y ejecutiva requeridos', HttpStatus.BAD_REQUEST);
//     }

//     try {
//       return await this.ejecutivaTraceabilityService.updateEtapaOportunidad(
//         trazabilidadId, 
//         nuevaEtapa, 
//         ejecutivaId
//       );
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       throw new HttpException('Error al actualizar etapa', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }
// }

// backend/services/traceability-service/src/controllers/ejecutiva/ejecutiva.controller.ts
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
      console.error('❌ Error en getTrazabilidad controller:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async createTrazabilidad(@Body() body: any) {
    console.log('📝 POST /ejecutiva/trazabilidad - Body recibido:', body);

    const { 
      id_ejecutiva, 
      id_empresa_prov,
      id_cliente_final,
      id_contacto,
      tipo_contacto,
      fecha_contacto,
      resultado_contacto
    } = body;

    // Validación de campos requeridos
    if (!id_ejecutiva || !id_empresa_prov || !id_cliente_final || !id_contacto) {
      throw new HttpException(
        'Ejecutiva, empresa, cliente y contacto son requeridos', 
        HttpStatus.BAD_REQUEST
      );
    }

    // Validar tipo_contacto
    const tiposValidos = [
      'Llamada telefónica', 
      'Chat de Whatsapp', 
      'Correo electrónico', 
      'Contacto por linkedin', 
      'Reunión presencial', 
      'Otro'
    ];
    if (!tipo_contacto || !tiposValidos.includes(tipo_contacto)) {
      throw new HttpException(
        `Tipo de contacto no válido. Debe ser uno de: ${tiposValidos.join(', ')}`, 
        HttpStatus.BAD_REQUEST
      );
    }

    // Validar resultado_contacto
    const resultadosValidos = ['Positivo', 'Negativo', 'Pendiente', 'Neutro'];
    if (!resultado_contacto || !resultadosValidos.includes(resultado_contacto)) {
      throw new HttpException(
        `Resultado de contacto no válido. Debe ser uno de: ${resultadosValidos.join(', ')}`, 
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      const result = await this.ejecutivaTraceabilityService.createTrazabilidad({
        id_ejecutiva,
        id_empresa_prov,
        id_cliente_final,
        id_contacto,
        tipo_contacto,
        fecha_contacto: fecha_contacto ? new Date(fecha_contacto) : new Date(),
        resultado_contacto,
        informacion_importante: body.informacion_importante,
        reunion_agendada: body.reunion_agendada || false,
        fecha_reunion: body.fecha_reunion ? new Date(body.fecha_reunion) : undefined,
        participantes: body.participantes,
        se_dio_reunion: body.se_dio_reunion,
        resultados_reunion: body.resultados_reunion,
        pasa_embudo_ventas: body.pasa_embudo_ventas || false,
        nombre_oportunidad: body.nombre_oportunidad,
        etapa_oportunidad: body.etapa_oportunidad,
        producto_ofrecido: body.producto_ofrecido,
        monto_total_sin_imp: body.monto_total_sin_imp ? parseFloat(body.monto_total_sin_imp) : undefined,
        probabilidad_cierre: body.probabilidad_cierre ? parseInt(body.probabilidad_cierre) : undefined,
        observaciones: body.observaciones
      });

      console.log('✅ Trazabilidad creada exitosamente:', result);
      return result;
    } catch (error) {
      console.error('❌ Error en createTrazabilidad controller:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error.message || 'Error al crear trazabilidad', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
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
      console.error('❌ Error en getPipeline controller:', error);
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
      console.error('❌ Error en getActividadesRecientes controller:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener actividades', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

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
      throw new HttpException(
        'ID de trazabilidad, nueva etapa y ejecutiva requeridos', 
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      return await this.ejecutivaTraceabilityService.updateEtapaOportunidad(
        trazabilidadId, 
        nuevaEtapa, 
        ejecutivaId
      );
    } catch (error) {
      console.error('❌ Error en updateEtapaOportunidad controller:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al actualizar etapa', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ Endpoint para obtener estadísticas de trazabilidad
  @Get('stats')
  async getStats(@Query('ejecutivaId') ejecutivaId: string) {
    if (!ejecutivaId) {
      throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaTraceabilityService.getStats(ejecutivaId);
    } catch (error) {
      console.error('❌ Error en getStats controller:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener estadísticas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

// ====== NOTA IMPORTANTE ======
// Este controlador maneja SOLO rutas de trazabilidad bajo /ejecutiva/trazabilidad/*
// Las estadísticas generales de la ejecutiva (totalEmpresas, totalClientes, etc.) 
// deben manejarse en un controlador separado bajo /ejecutiva/stats