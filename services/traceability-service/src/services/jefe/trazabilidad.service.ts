// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Trazabilidad } from '../../../../../shared/entities/Trazabilidad.entity';
// import { Ejecutiva } from '../../../../../shared/entities/Ejecutiva.entity';
// import { EmpresaProveedora } from '../../../../../shared/entities/EmpresaProveedora.entity';
// import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
// import { PersonaContacto } from '../../../../../shared/entities/PersonaContacto.entity';

// @Injectable()
// export class TrazabilidadService {
//   constructor(
//     @InjectRepository(Trazabilidad)
//     private trazabilidadRepository: Repository<Trazabilidad>,
//   ) {
//     console.log('🔧 TrazabilidadService inicializado');

//   }
//   async getTrazabilidad(filters?: any) {
//     try {
//       console.log('🔍 [TrazabilidadService] getTrazabilidad ejecutándose');
//       console.log('🔍 Filters recibidos:', filters);

//       Verificar que el repository esté funcionando
//       const totalCount = await this.trazabilidadRepository.count();
//       console.log('🔍 Total de registros en BD:', totalCount);

//       const {
//         empresaId,
//         ejecutivaId,
//         clienteId,
//         fechaInicio,
//         fechaFin,
//         tipoContacto,
//         etapaOportunidad
//       } = filters || {};

//       const query = this.trazabilidadRepository
//         .createQueryBuilder('trazabilidad')
//         .leftJoinAndSelect('trazabilidad.ejecutiva', 'ejecutiva')
//         .leftJoinAndSelect('trazabilidad.empresa_proveedora', 'empresa')
//         .leftJoinAndSelect('trazabilidad.cliente_final', 'cliente')
//         .leftJoinAndSelect('trazabilidad.persona_contacto', 'contacto')
//         .orderBy('trazabilidad.fecha_contacto', 'DESC');

//       console.log('🔍 Query construido, aplicando filtros...');

//       ... resto del código de filtros ...

//       const trazabilidades = await query.getMany();
//       console.log('✅ [TrazabilidadService] Query ejecutado exitosamente');
//       console.log('✅ Registros encontrados:', trazabilidades.length);

//       return trazabilidades;

//     } catch (error) {
//       console.error('❌ [TrazabilidadService] ERROR en getTrazabilidad:', error);
//       console.error('❌ Error details:', {
//         message: error.message,
//         stack: error.stack,
//         code: error.code
//       });
//       throw error;
//     }
//   }

//   async getDashboardTrazabilidad() {
//     Usar vistas SQL existentes
//     const [pipelineVentas, dashboardEjecutivas] = await Promise.all([
//       this.trazabilidadRepository.query('SELECT * FROM vista_pipeline_ventas'),
//       this.trazabilidadRepository.query('SELECT * FROM vista_dashboard_ejecutiva')
//     ]);

//     Estadísticas adicionales
//     const totalGestiones = await this.trazabilidadRepository.count();

//     const gestionesPorTipo = await this.trazabilidadRepository
//       .createQueryBuilder('t')
//       .select('t.tipo_contacto, COUNT(*) as total')
//       .groupBy('t.tipo_contacto')
//       .getRawMany();

//     const oportunidadesPorEtapa = await this.trazabilidadRepository
//       .createQueryBuilder('t')
//       .select('t.etapa_oportunidad, COUNT(*) as total')
//       .groupBy('t.etapa_oportunidad')
//       .getRawMany();

//     const revenueTotal = pipelineVentas.reduce((sum: number, item: any) => {
//       return sum + (Number(item.monto_total_sin_imp) || 0);
//     }, 0);

//     return {
//       pipeline_ventas: pipelineVentas,
//       dashboard_ejecutivas: dashboardEjecutivas,
//       estadisticas: {
//         total_gestiones: totalGestiones,
//         revenue_total: revenueTotal,
//         gestiones_por_tipo: gestionesPorTipo,
//         oportunidades_por_etapa: oportunidadesPorEtapa
//       }
//     };
//   }

//   async createTrazabilidad(data: any) {
//     const {
//       id_ejecutiva,
//       id_empresa_prov,
//       id_cliente_final,
//       id_contacto,
//       tipo_contacto,
//       fecha_contacto,
//       resultado_contacto,
//       etapa_oportunidad,
//       nombre_oportunidad,
//       monto_total_sin_imp,
//       probabilidad_cierre,
//       observaciones
//     } = data;

//     Cargar las entidades relacionadas usando el manager del repository
//     const [ejecutiva, empresa, cliente, contacto] = await Promise.all([
//       this.trazabilidadRepository.manager.findOne(Ejecutiva, {
//         where: { id_ejecutiva }
//       }),
//       this.trazabilidadRepository.manager.findOne(EmpresaProveedora, {
//         where: { id_empresa_prov }
//       }),
//       this.trazabilidadRepository.manager.findOne(ClienteFinal, {
//         where: { id_cliente_final }
//       }),
//       this.trazabilidadRepository.manager.findOne(PersonaContacto, {
//         where: { id_contacto }
//       })
//     ]);

//     Validar que existen
//     if (!ejecutiva) {
//       throw new HttpException('Ejecutiva no encontrada', HttpStatus.BAD_REQUEST);
//     }
//     if (!empresa) {
//       throw new HttpException('Empresa proveedora no encontrada', HttpStatus.BAD_REQUEST);
//     }
//     if (!cliente) {
//       throw new HttpException('Cliente final no encontrado', HttpStatus.BAD_REQUEST);
//     }
//     if (!contacto) {
//       throw new HttpException('Persona de contacto no encontrada', HttpStatus.BAD_REQUEST);
//     }



//     ✅ CORRECTO - Crear con objetos de relación completos
//     const nuevaTrazabilidad = this.trazabilidadRepository.create({
//       ejecutiva,
//       empresa_proveedora: empresa,
//       cliente_final: cliente,
//       persona_contacto: contacto,
//       tipo_contacto,
//       fecha_contacto: new Date(fecha_contacto),
//       resultado_contacto,
//       etapa_oportunidad,
//       nombre_oportunidad: nombre_oportunidad || null,
//       monto_total_sin_imp: monto_total_sin_imp || null,
//       probabilidad_cierre: probabilidad_cierre || null,
//       observaciones: observaciones || null
//     });

//     return await this.trazabilidadRepository.save(nuevaTrazabilidad);
//   }
// }


import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trazabilidad } from '../../../../../shared/entities/Trazabilidad.entity';
import { Ejecutiva } from '../../../../../shared/entities/Ejecutiva.entity';
import { EmpresaProveedora } from '../../../../../shared/entities/EmpresaProveedora.entity';
import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
import { PersonaContacto } from '../../../../../shared/entities/PersonaContacto.entity';

@Injectable()
export class TrazabilidadService {
  constructor(
    @InjectRepository(Trazabilidad)
    private trazabilidadRepository: Repository<Trazabilidad>,
  ) {
    console.log('🔧 TrazabilidadService inicializado');
  }

  async getTrazabilidad(filters?: any) {
    try {
      console.log('🔍 [TrazabilidadService] getTrazabilidad ejecutándose');
      console.log('🔍 Filters recibidos:', filters);

      // Verificar que el repository esté funcionando
      const totalCount = await this.trazabilidadRepository.count();
      console.log('🔍 Total de registros en BD:', totalCount);

      const {
        empresaId,
        ejecutivaId,
        clienteId,
        fechaInicio,
        fechaFin,
        tipoContacto,
        etapaOportunidad,
        etapa // Nueva: filtrar por etapa (1 o 2)
      } = filters || {};

      const query = this.trazabilidadRepository
        .createQueryBuilder('trazabilidad')
        .leftJoinAndSelect('trazabilidad.ejecutiva', 'ejecutiva')
        .leftJoinAndSelect('trazabilidad.empresa_proveedora', 'empresa')
        .leftJoinAndSelect('trazabilidad.cliente_final', 'cliente')
        .leftJoinAndSelect('trazabilidad.persona_contacto', 'contacto')
        .orderBy('trazabilidad.fecha_contacto', 'DESC');

      console.log('🔍 Query construido, aplicando filtros...');

      // Filtros existentes
      if (empresaId) {
        query.andWhere('trazabilidad.id_empresa_prov = :empresaId', { 
          empresaId: parseInt(empresaId) 
        });
      } 

      if (ejecutivaId) {
        query.andWhere('trazabilidad.id_ejecutiva = :ejecutivaId', { 
          ejecutivaId: parseInt(ejecutivaId) 
        });
      }

      if (clienteId) {
        query.andWhere('trazabilidad.id_cliente_final = :clienteId', { 
          clienteId: parseInt(clienteId) 
        });
      }

      if (fechaInicio && fechaFin) {
        query.andWhere('trazabilidad.fecha_contacto BETWEEN :fechaInicio AND :fechaFin', {
          fechaInicio,
          fechaFin: `${fechaFin} 23:59:59`
        });
      }

      if (tipoContacto) {
        query.andWhere('trazabilidad.tipo_contacto = :tipoContacto', { tipoContacto });
      }

      if (etapaOportunidad) {
        query.andWhere('trazabilidad.etapa_oportunidad = :etapaOportunidad', { etapaOportunidad });
      }

      // Nuevo filtro por etapa
      if (etapa) {
        if (etapa === '1') {
          // Etapa 1: Contactos iniciales (sin embudo de ventas)
          query.andWhere('(trazabilidad.pasa_embudo_ventas = FALSE OR trazabilidad.nombre_oportunidad IS NULL)');
        } else if (etapa === '2') {
          // Etapa 2: Embudo de ventas
          query.andWhere('trazabilidad.pasa_embudo_ventas = TRUE AND trazabilidad.nombre_oportunidad IS NOT NULL');
        }
      }

      const trazabilidades = await query.getMany();
      console.log('✅ [TrazabilidadService] Query ejecutado exitosamente');
      console.log('✅ Registros encontrados:', trazabilidades.length);

      return trazabilidades;

    } catch (error) {
      console.error('❌ [TrazabilidadService] ERROR en getTrazabilidad:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        code: error.code
      });
      throw error;
    }
  }

  async getDashboardTrazabilidad() {
    // Usar vistas SQL existentes actualizadas
    const [etapa1Generacion, etapa2Embudo, kpisSemanales, dashboardEjecutivas] = await Promise.all([
      this.trazabilidadRepository.query('SELECT * FROM vista_etapa1_generacion'),
      this.trazabilidadRepository.query('SELECT * FROM vista_etapa2_embudo'),
      this.trazabilidadRepository.query('SELECT * FROM vista_kpis_semanales'),
      this.trazabilidadRepository.query('SELECT * FROM vista_dashboard_ejecutiva')
    ]);

    // Estadísticas adicionales
    const totalGestiones = await this.trazabilidadRepository.count();

    const gestionesPorTipo = await this.trazabilidadRepository
      .createQueryBuilder('t')
      .select('t.tipo_contacto, COUNT(*) as total')
      .groupBy('t.tipo_contacto')
      .getRawMany();

    const oportunidadesPorEtapa = await this.trazabilidadRepository
      .createQueryBuilder('t')
      .select('t.etapa_oportunidad, COUNT(*) as total')
      .where('t.etapa_oportunidad IS NOT NULL')
      .groupBy('t.etapa_oportunidad')
      .getRawMany();

    // Revenue total de ventas ganadas
    const revenueTotal = await this.trazabilidadRepository
      .createQueryBuilder('t')
      .select('COALESCE(SUM(t.monto_cierre_final), 0)', 'revenue_total')
      .where('t.etapa_oportunidad = :etapa', { etapa: 'Venta ganada' })
      .getRawOne();

    // Estadísticas por etapa
    const estadisticasEtapas = await this.trazabilidadRepository
      .createQueryBuilder('t')
      .select(`
        COUNT(CASE WHEN t.pasa_embudo_ventas = FALSE OR t.nombre_oportunidad IS NULL THEN 1 END) as total_etapa1,
        COUNT(CASE WHEN t.pasa_embudo_ventas = TRUE AND t.nombre_oportunidad IS NOT NULL THEN 1 END) as total_etapa2,
        COUNT(CASE WHEN t.etapa_oportunidad = 'Venta ganada' THEN 1 END) as ventas_ganadas
      `)
      .getRawOne();

    return {
      etapa1_generacion: etapa1Generacion,
      etapa2_embudo: etapa2Embudo,
      kpis_semanales: kpisSemanales,
      dashboard_ejecutivas: dashboardEjecutivas,
      estadisticas: {
        total_gestiones: totalGestiones,
        revenue_total: parseFloat(revenueTotal?.revenue_total || 0),
        gestiones_por_tipo: gestionesPorTipo,
        oportunidades_por_etapa: oportunidadesPorEtapa,
        por_etapa: estadisticasEtapas
      }
    };
  }

  async createTrazabilidad(data: any) {
    const {
      id_ejecutiva,
      id_empresa_prov,
      id_cliente_final,
      id_contacto,
      
      // ETAPA 1: Campos de generación
      fecha_agregado_base,
      tipo_contacto,
      fecha_contacto,
      fecha_respuesta,
      resultado_contacto,
      informacion_importante,
      reunion_agendada,
      fecha_reunion,
      participantes,
      se_dio_reunion,
      resultados_reunion,
      pasa_embudo_ventas,
      
      // ETAPA 2: Campos de oportunidad
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
    } = data;

    // Cargar las entidades relacionadas usando el manager del repository
    const [ejecutiva, empresa, cliente, contacto] = await Promise.all([
      this.trazabilidadRepository.manager.findOne(Ejecutiva, {
        where: { id_ejecutiva }
      }),
      this.trazabilidadRepository.manager.findOne(EmpresaProveedora, {
        where: { id_empresa_prov }
      }),
      this.trazabilidadRepository.manager.findOne(ClienteFinal, {
        where: { id_cliente_final }
      }),
      this.trazabilidadRepository.manager.findOne(PersonaContacto, {
        where: { id_contacto }
      })
    ]);

    // Validar que existen
    if (!ejecutiva) {
      throw new HttpException('Ejecutiva no encontrada', HttpStatus.BAD_REQUEST);
    }
    if (!empresa) {
      throw new HttpException('Empresa proveedora no encontrada', HttpStatus.BAD_REQUEST);
    }
    if (!cliente) {
      throw new HttpException('Cliente final no encontrado', HttpStatus.BAD_REQUEST);
    }
    if (!contacto) {
      throw new HttpException('Persona de contacto no encontrada', HttpStatus.BAD_REQUEST);
    }

    // Validar lógica de etapas
    if (pasa_embudo_ventas && !nombre_oportunidad) {
      throw new HttpException(
        'Para pasar al embudo de ventas se requiere un nombre de oportunidad', 
        HttpStatus.BAD_REQUEST
      );
    }

    // ✅ CORRECTO - Crear con objetos de relación completos
    const nuevaTrazabilidad = this.trazabilidadRepository.create({
      ejecutiva,
      empresa_proveedora: empresa,
      cliente_final: cliente,
      persona_contacto: contacto,
      
      // ETAPA 1
      fecha_agregado_base: fecha_agregado_base ? new Date(fecha_agregado_base) : null,
      tipo_contacto,
      fecha_contacto: new Date(fecha_contacto),
      fecha_respuesta: fecha_respuesta ? new Date(fecha_respuesta) : null,
      resultado_contacto,
      informacion_importante: informacion_importante || null,
      reunion_agendada: reunion_agendada || false,
      fecha_reunion: fecha_reunion ? new Date(fecha_reunion) : null,
      participantes: participantes || null,
      se_dio_reunion: se_dio_reunion || null,
      resultados_reunion: resultados_reunion || null,
      pasa_embudo_ventas: pasa_embudo_ventas || false,
      
      // ETAPA 2
      fecha_inicio_etapa: fecha_inicio_etapa ? new Date(fecha_inicio_etapa) : null,
      nombre_oportunidad: nombre_oportunidad || null,
      tipo_oportunidad: tipo_oportunidad || null,
      etapa_oportunidad: etapa_oportunidad || null,
      producto_ofrecido: producto_ofrecido || null,
      fecha_registro_oportunidad: fecha_registro_oportunidad ? new Date(fecha_registro_oportunidad) : null,
      fecha_cierre_esperado: fecha_cierre_esperado ? new Date(fecha_cierre_esperado) : null,
      monto_total_sin_imp: monto_total_sin_imp || null,
      probabilidad_cierre: probabilidad_cierre || null,
      monto_cierre_final: monto_cierre_final || null,
      observaciones: observaciones || null
    });

    return await this.trazabilidadRepository.save(nuevaTrazabilidad);
  }

  // Nuevo método para actualizar trazabilidad
  async updateTrazabilidad(id: number, data: any) {
    const trazabilidad = await this.trazabilidadRepository.findOne({
      where: { id_trazabilidad: id },
      relations: ['ejecutiva', 'empresa_proveedora', 'cliente_final', 'persona_contacto']
    });

    if (!trazabilidad) {
      throw new HttpException('Trazabilidad no encontrada', HttpStatus.NOT_FOUND);
    }

    // Validar transición de etapas
    if (data.pasa_embudo_ventas && !data.nombre_oportunidad) {
      throw new HttpException(
        'Para pasar al embudo de ventas se requiere un nombre de oportunidad', 
        HttpStatus.BAD_REQUEST
      );
    }

    // Actualizar campos
    Object.assign(trazabilidad, data);

    return await this.trazabilidadRepository.save(trazabilidad);
  }

  // Método para obtener estadísticas por etapa
  async getEstadisticasPorEtapa(filters?: any) {
    const { empresaId, fechaInicio, fechaFin } = filters || {};

    const query = this.trazabilidadRepository
      .createQueryBuilder('t')
      .select(`
        COUNT(*) as total_gestiones,
        COUNT(CASE WHEN t.pasa_embudo_ventas = FALSE OR t.nombre_oportunidad IS NULL THEN 1 END) as etapa1_generacion,
        COUNT(CASE WHEN t.pasa_embudo_ventas = TRUE AND t.nombre_oportunidad IS NOT NULL THEN 1 END) as etapa2_embudo,
        COUNT(CASE WHEN t.etapa_oportunidad = 'Venta ganada' THEN 1 END) as ventas_ganadas,
        COALESCE(SUM(CASE WHEN t.etapa_oportunidad = 'Venta ganada' THEN t.monto_cierre_final ELSE 0 END), 0) as revenue_total
      `);

    if (empresaId) {
      query.andWhere('t.id_empresa_prov = :empresaId', { empresaId: parseInt(empresaId) });
    }

    if (fechaInicio && fechaFin) {
      query.andWhere('t.fecha_contacto BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin: `${fechaFin} 23:59:59`
      });
    }

    return await query.getRawOne();
  }
}