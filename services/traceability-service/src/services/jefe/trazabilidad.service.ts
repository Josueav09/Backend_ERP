// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, Between } from 'typeorm';
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
//   ) { }

//   async getTrazabilidad(filters?: any) {
//     const {
//       empresaId,
//       ejecutivaId,
//       clienteId,
//       fechaInicio,
//       fechaFin,
//       tipoContacto,
//       etapaOportunidad
//     } = filters || {};

//     const query = this.trazabilidadRepository
//       .createQueryBuilder('trazabilidad')
//       .leftJoinAndSelect('trazabilidad.ejecutiva', 'ejecutiva')
//       .leftJoinAndSelect('trazabilidad.empresa_proveedora', 'empresa')
//       .leftJoinAndSelect('trazabilidad.cliente_final', 'cliente')
//       .leftJoinAndSelect('trazabilidad.contacto', 'contacto') // ← CORREGIDO: 'contacto' no 'persona_contacto'
//       .orderBy('trazabilidad.fecha_contacto', 'DESC');

//     if (empresaId) {
//       query.andWhere('trazabilidad.id_empresa_prov = :empresaId', {
//         empresaId: parseInt(empresaId)
//       });
//     }

//     if (ejecutivaId) {
//       query.andWhere('trazabilidad.id_ejecutiva = :ejecutivaId', {
//         ejecutivaId: parseInt(ejecutivaId)
//       });
//     }

//     if (fechaInicio && fechaFin) {
//       query.andWhere('trazabilidad.fecha_contacto BETWEEN :fechaInicio AND :fechaFin', {
//         fechaInicio,
//         fechaFin: `${fechaFin} 23:59:59`
//       });
//     }

//     if (tipoContacto) {
//       query.andWhere('trazabilidad.tipo_contacto = :tipoContacto', { tipoContacto });
//     }

//     if (etapaOportunidad) {
//       query.andWhere('trazabilidad.etapa_oportunidad = :etapaOportunidad', { etapaOportunidad });
//     }

//     return await query.getMany();
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

//     // Cargar las entidades relacionadas
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

//     // Validar que existen
//     if (!ejecutiva || !empresa || !cliente || !contacto) {
//       throw new HttpException(
//         'Una o más entidades relacionadas no existen',
//         HttpStatus.BAD_REQUEST
//       );
//     }

//     const nuevaTrazabilidad = this.trazabilidadRepository.create({
//       ejecutiva,           // ← Objeto Ejecutiva completo
//       empresa_proveedora: empresa,  // ← Objeto EmpresaProveedora completo  
//       cliente_final: cliente,       // ← Objeto ClienteFinal completo
//       persona_contacto: contacto,   // ← Objeto PersonaContacto completo
//       tipo_contacto,
//       fecha_contacto: new Date(fecha_contacto),
//       resultado_contacto,
//       etapa_oportunidad,
//       nombre_oportunidad,
//       monto_total_sin_imp,
//       probabilidad_cierre,
//       observaciones
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

  // async getTrazabilidad(filters?: any) {
  //   const { 
  //     empresaId, 
  //     ejecutivaId, 
  //     clienteId, 
  //     fechaInicio, 
  //     fechaFin,
  //     tipoContacto,
  //     etapaOportunidad 
  //   } = filters || {};

  //   const query = this.trazabilidadRepository
  //     .createQueryBuilder('trazabilidad')
  //     .leftJoinAndSelect('trazabilidad.ejecutiva', 'ejecutiva')
  //     .leftJoinAndSelect('trazabilidad.empresa_proveedora', 'empresa')
  //     .leftJoinAndSelect('trazabilidad.cliente_final', 'cliente')
  //     .leftJoinAndSelect('trazabilidad.persona_contacto', 'contacto')
  //     .orderBy('trazabilidad.fecha_contacto', 'DESC');

  //   if (empresaId) {
  //     query.andWhere('trazabilidad.id_empresa_prov = :empresaId', { 
  //       empresaId: parseInt(empresaId) 
  //     });
  //   } 

  //   if (ejecutivaId) {
  //     query.andWhere('trazabilidad.id_ejecutiva = :ejecutivaId', { 
  //       ejecutivaId: parseInt(ejecutivaId) 
  //     });
  //   }

  //   if (clienteId) {
  //     query.andWhere('trazabilidad.id_cliente_final = :clienteId', { 
  //       clienteId: parseInt(clienteId) 
  //     });
  //   }

  //   if (fechaInicio && fechaFin) {
  //     query.andWhere('trazabilidad.fecha_contacto BETWEEN :fechaInicio AND :fechaFin', {
  //       fechaInicio,
  //       fechaFin: `${fechaFin} 23:59:59`
  //     });
  //   }

  //   if (tipoContacto) {
  //     query.andWhere('trazabilidad.tipo_contacto = :tipoContacto', { tipoContacto });
  //   }

  //   if (etapaOportunidad) {
  //     query.andWhere('trazabilidad.etapa_oportunidad = :etapaOportunidad', { etapaOportunidad });
  //   }

  //   return await query.getMany();
  // }
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
        etapaOportunidad
      } = filters || {};

      const query = this.trazabilidadRepository
        .createQueryBuilder('trazabilidad')
        .leftJoinAndSelect('trazabilidad.ejecutiva', 'ejecutiva')
        .leftJoinAndSelect('trazabilidad.empresa_proveedora', 'empresa')
        .leftJoinAndSelect('trazabilidad.cliente_final', 'cliente')
        .leftJoinAndSelect('trazabilidad.persona_contacto', 'contacto')
        .orderBy('trazabilidad.fecha_contacto', 'DESC');

      console.log('🔍 Query construido, aplicando filtros...');

      // ... resto del código de filtros ...

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
    // Usar vistas SQL existentes
    const [pipelineVentas, dashboardEjecutivas] = await Promise.all([
      this.trazabilidadRepository.query('SELECT * FROM vista_pipeline_ventas'),
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
      .groupBy('t.etapa_oportunidad')
      .getRawMany();

    const revenueTotal = pipelineVentas.reduce((sum: number, item: any) => {
      return sum + (Number(item.monto_total_sin_imp) || 0);
    }, 0);

    return {
      pipeline_ventas: pipelineVentas,
      dashboard_ejecutivas: dashboardEjecutivas,
      estadisticas: {
        total_gestiones: totalGestiones,
        revenue_total: revenueTotal,
        gestiones_por_tipo: gestionesPorTipo,
        oportunidades_por_etapa: oportunidadesPorEtapa
      }
    };
  }

  async createTrazabilidad(data: any) {
    const {
      id_ejecutiva,
      id_empresa_prov,
      id_cliente_final,
      id_contacto,
      tipo_contacto,
      fecha_contacto,
      resultado_contacto,
      etapa_oportunidad,
      nombre_oportunidad,
      monto_total_sin_imp,
      probabilidad_cierre,
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



    // ✅ CORRECTO - Crear con objetos de relación completos
    const nuevaTrazabilidad = this.trazabilidadRepository.create({
      ejecutiva,
      empresa_proveedora: empresa,
      cliente_final: cliente,
      persona_contacto: contacto,
      tipo_contacto,
      fecha_contacto: new Date(fecha_contacto),
      resultado_contacto,
      etapa_oportunidad,
      nombre_oportunidad: nombre_oportunidad || null,
      monto_total_sin_imp: monto_total_sin_imp || null,
      probabilidad_cierre: probabilidad_cierre || null,
      observaciones: observaciones || null
    });

    return await this.trazabilidadRepository.save(nuevaTrazabilidad);
  }
}