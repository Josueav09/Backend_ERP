// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { AuditoriaCambios } from '../../../../../shared/entities/AuditoriaCambios.entity';

// // @Injectable()
// // export class AuditService {
// //   constructor(
// //     @InjectRepository(AuditoriaCambios)
// //     private auditoriaRepository: Repository<AuditoriaCambios>,
// //   ) {}

// //   async getAuditoriaContratos(filters?: any) {
// //     const { fechaInicio, fechaFin, accion, usuario } = filters || {};

// //     let query = this.auditoriaRepository
// //       .createQueryBuilder('a')
// //       .leftJoinAndSelect('a.empresa_proveedora', 'empresa')
// //       .leftJoinAndSelect('a.cliente_final', 'cliente')
// //       .leftJoinAndSelect('a.ejecutiva', 'ejecutiva')
// //       .leftJoinAndSelect('a.ejecutiva_anterior', 'ejecutiva_anterior')
// //       .leftJoinAndSelect('a.ejecutiva_nueva', 'ejecutiva_nueva')
// //       .orderBy('a.fecha_accion', 'DESC');

// //     if (fechaInicio && fechaFin) {
// //       query.andWhere('a.fecha_accion BETWEEN :fechaInicio AND :fechaFin', {
// //         fechaInicio: new Date(fechaInicio),
// //         fechaFin: new Date(fechaFin)
// //       });
// //     }

// //     if (accion) {
// //       query.andWhere('a.accion = :accion', { accion });
// //     }

// //     if (usuario) {
// //       query.andWhere('a.usuario_responsable LIKE :usuario', { usuario: `%${usuario}%` });
// //     }

// //     const auditorias = await query.getMany();

// //     // Formatear respuesta
// //     return auditorias.map(audit => ({
// //       id_auditoria: audit.id_auditoria,
// //       accion: audit.accion,
// //       detalles: audit.detalles,
// //       fecha_accion: audit.fecha_accion,
// //       usuario_responsable: audit.usuario_responsable,
// //       empresa: audit.empresa_proveedora?.razon_social || 'N/A',
// //       cliente: audit.cliente_final?.razon_social || 'N/A',
// //       ejecutiva: audit.ejecutiva?.nombre_completo || 'N/A',
// //       ejecutiva_anterior: audit.ejecutiva_anterior?.nombre_completo || 'N/A',
// //       ejecutiva_nueva: audit.ejecutiva_nueva?.nombre_completo || 'N/A',
// //       estado_anterior: audit.estado_anterior,
// //       estado_nuevo: audit.estado_nuevo,
// //       motivo_desvinculacion: audit.motivo_desvinculacion
// //     }));
// //   }

// //   async getEstadisticasAuditoria() {
// //     const totalRegistros = await this.auditoriaRepository.count();
    
// //     const accionesPorTipo = await this.auditoriaRepository
// //       .createQueryBuilder('a')
// //       .select('a.accion, COUNT(*) as total')
// //       .groupBy('a.accion')
// //       .getRawMany();

// //     const auditoriasPorUsuario = await this.auditoriaRepository
// //       .createQueryBuilder('a')
// //       .select('a.usuario_responsable, COUNT(*) as total')
// //       .groupBy('a.usuario_responsable')
// //       .orderBy('total', 'DESC')
// //       .limit(10)
// //       .getRawMany();

// //     const auditoriasRecientes = await this.auditoriaRepository.find({
// //       order: { fecha_accion: 'DESC' },
// //       take: 10,
// //       relations: ['empresa_proveedora', 'cliente_final']
// //     });

// //     return {
// //       total_registros: totalRegistros,
// //       acciones_por_tipo: accionesPorTipo,
// //       top_usuarios: auditoriasPorUsuario,
// //       auditorias_recientes: auditoriasRecientes
// //     };
// //   }
// // }

// @Injectable()
// export class AuditService {
//   constructor(
//     @InjectRepository(AuditoriaCambios)
//     private auditoriaRepository: Repository<AuditoriaCambios>,
//   ) {} 

//   async getAuditoriaContratos(filters?: any) {
//     const { fechaInicio, fechaFin, accion, usuario } = filters || {};

//     const query = this.auditoriaRepository
//       .createQueryBuilder('auditoria')
//       .leftJoinAndSelect('auditoria.empresa_proveedora', 'empresa')
//       .leftJoinAndSelect('auditoria.cliente_final', 'cliente')
//       .leftJoinAndSelect('auditoria.ejecutiva', 'ejecutiva')
//       .leftJoinAndSelect('auditoria.ejecutiva_anterior', 'ejecutiva_anterior')
//       .leftJoinAndSelect('auditoria.ejecutiva_nueva', 'ejecutiva_nueva')
//       .orderBy('auditoria.fecha_accion', 'DESC');

//     if (fechaInicio && fechaFin) {
//       query.andWhere('auditoria.fecha_accion BETWEEN :fechaInicio AND :fechaFin', {
//         fechaInicio,
//         fechaFin: `${fechaFin} 23:59:59`
//       });
//     }

//     if (accion) {
//       query.andWhere('auditoria.accion = :accion', { accion });
//     }

//     if (usuario) {
//       query.andWhere('auditoria.usuario_responsable ILIKE :usuario', { 
//         usuario: `%${usuario}%` 
//       });
//     }

//     return await query.getMany();
//   }
// }

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditoriaCambios } from '../../../../../shared/entities/AuditoriaCambios.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditoriaCambios)
    private auditoriaRepository: Repository<AuditoriaCambios>,
  ) {}

  async getAuditoriaContratos(filters?: any) {
    const { fechaInicio, fechaFin, accion, usuario } = filters || {};

    const query = this.auditoriaRepository
      .createQueryBuilder('auditoria')
      .leftJoinAndSelect('auditoria.empresa_proveedora', 'empresa')
      .leftJoinAndSelect('auditoria.cliente_final', 'cliente')
      .leftJoinAndSelect('auditoria.ejecutiva', 'ejecutiva')
      .leftJoinAndSelect('auditoria.ejecutiva_anterior', 'ejecutiva_anterior')
      .leftJoinAndSelect('auditoria.ejecutiva_nueva', 'ejecutiva_nueva')
      .orderBy('auditoria.fecha_accion', 'DESC');

    if (fechaInicio && fechaFin) {
      query.andWhere('auditoria.fecha_accion BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin: `${fechaFin} 23:59:59`
      });
    }

    if (accion) {
      query.andWhere('auditoria.accion = :accion', { accion });
    }

    if (usuario) {
      query.andWhere('auditoria.usuario_responsable ILIKE :usuario', { 
        usuario: `%${usuario}%` 
      });
    }

    const auditorias = await query.getMany();

    // Formatear respuesta para mejor legibilidad
    return auditorias.map(audit => ({
      id_auditoria: audit.id_auditoria,
      accion: audit.accion,
      detalles: audit.detalles,
      fecha_accion: audit.fecha_accion,
      usuario_responsable: audit.usuario_responsable,
      empresa: audit.empresa_proveedora?.razon_social || 'N/A',
      cliente: audit.cliente_final?.razon_social || 'N/A',
      ejecutiva: audit.ejecutiva?.nombre_completo || 'N/A',
      ejecutiva_anterior: audit.ejecutiva_anterior?.nombre_completo || 'N/A',
      ejecutiva_nueva: audit.ejecutiva_nueva?.nombre_completo || 'N/A',
      estado_anterior: audit.estado_anterior,
      estado_nuevo: audit.estado_nuevo,
      motivo_desvinculacion: audit.motivo_desvinculacion,
      observaciones_adicionales: audit.observaciones_adicionales
    }));
  }

  async getEstadisticasAuditoria() {
    try {
      // Total de registros
      const totalRegistros = await this.auditoriaRepository.count();
      
      // Acciones por tipo
      const accionesPorTipo = await this.auditoriaRepository
        .createQueryBuilder('auditoria')
        .select('auditoria.accion, COUNT(*) as total')
        .groupBy('auditoria.accion')
        .getRawMany();

      // Top usuarios con más acciones
      const auditoriasPorUsuario = await this.auditoriaRepository
        .createQueryBuilder('auditoria')
        .select('auditoria.usuario_responsable, COUNT(*) as total')
        .groupBy('auditoria.usuario_responsable')
        .orderBy('total', 'DESC')
        .limit(10)
        .getRawMany();

      // Auditorías recientes (últimas 10)
      const auditoriasRecientes = await this.auditoriaRepository.find({
        order: { fecha_accion: 'DESC' },
        take: 10,
        relations: ['empresa_proveedora', 'cliente_final', 'ejecutiva']
      });

      // Estadísticas por tipo de entidad afectada
      const estadisticasPorEntidad = await this.auditoriaRepository
        .createQueryBuilder('auditoria')
        .select(`
          CASE 
            WHEN auditoria.id_empresa_proveedora IS NOT NULL THEN 'Empresa'
            WHEN auditoria.id_cliente_final IS NOT NULL THEN 'Cliente' 
            WHEN auditoria.id_ejecutiva IS NOT NULL THEN 'Ejecutiva'
            ELSE 'Otro'
          END as entidad,
          COUNT(*) as total
        `)
        .groupBy('entidad')
        .getRawMany();

      return {
        total_registros: totalRegistros,
        acciones_por_tipo: accionesPorTipo,
        top_usuarios: auditoriasPorUsuario,
        auditorias_recientes: auditoriasRecientes.map(audit => ({
          id_auditoria: audit.id_auditoria,
          accion: audit.accion,
          fecha_accion: audit.fecha_accion,
          usuario_responsable: audit.usuario_responsable,
          empresa: audit.empresa_proveedora?.razon_social,
          cliente: audit.cliente_final?.razon_social,
          ejecutiva: audit.ejecutiva?.nombre_completo
        })),
        estadisticas_por_entidad: estadisticasPorEntidad,
        resumen: {
          total_acciones: totalRegistros,
          accion_mas_comun: accionesPorTipo.length > 0 ? accionesPorTipo[0].accion : 'N/A',
          usuario_mas_activo: auditoriasPorUsuario.length > 0 ? auditoriasPorUsuario[0].usuario_responsable : 'N/A'
        }
      };
    } catch (error) {
      console.error('Error en getEstadisticasAuditoria:', error);
      throw error;
    }
  }

  // Método adicional útil para dashboard
  async getAuditoriaResumenMensual() {
    const result = await this.auditoriaRepository
      .createQueryBuilder('auditoria')
      .select(`
        EXTRACT(YEAR FROM auditoria.fecha_accion) as year,
        EXTRACT(MONTH FROM auditoria.fecha_accion) as month,
        COUNT(*) as total
      `)
      .groupBy('year, month')
      .orderBy('year, month', 'DESC')
      .limit(12)
      .getRawMany();

    return result;
  }
}