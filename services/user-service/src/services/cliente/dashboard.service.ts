// // import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// // import { sql } from '../../../../../shared/utils/database';

// // @Injectable()
// // export class ClienteDashboardService {
// //   async getStats(clienteUsuarioId: string) {
// //     try {
// //       // Obtener información del cliente - MANTENIENDO TU SQL ORIGINAL
// //       const clienteResult = await sql.query(
// //         `
// //         SELECT 
// //           ce.*,
// //           ep.nombre_empresa,
// //           u.nombre || ' ' || u.apellido as ejecutiva_nombre,
// //           u.email as ejecutiva_email
// //         FROM public.cliente_empresa ce
// //         JOIN public.empresa_proveedora ep ON ce.id_empresa = ep.id_empresa
// //         LEFT JOIN public.usuarios u ON ce.id_ejecutiva = u.id_usuario
// //         WHERE ce.id_usuario_cliente = $1
// //         LIMIT 1
// //         `,
// //         [clienteUsuarioId]
// //       );

// //       if (clienteResult.rows.length === 0) {
// //         throw new HttpException('Cliente no encontrado', HttpStatus.NOT_FOUND);
// //       }

// //       const cliente = clienteResult.rows[0];

// //       // Total de actividades
// //       const actividadesResult = await sql.query(
// //         `SELECT COUNT(*) as total FROM public.trazabilidad t WHERE t.id_cliente = $1`,
// //         [cliente.id_cliente]
// //       );

// //       // Actividades completadas
// //       const completadasResult = await sql.query(
// //         `SELECT COUNT(*) as total FROM public.trazabilidad t WHERE t.id_cliente = $1 AND t.estado = 'completado'`,
// //         [cliente.id_cliente]
// //       );

// //       // Actividades en proceso
// //       const enProcesoResult = await sql.query(
// //         `SELECT COUNT(*) as total FROM public.trazabilidad t WHERE t.id_cliente = $1 AND t.estado = 'en_proceso'`,
// //         [cliente.id_cliente]
// //       );

// //       const totalActividades = Number(actividadesResult.rows[0].total);
// //       const completadas = Number(completadasResult.rows[0].total);
// //       const enProceso = Number(enProcesoResult.rows[0].total);

// //       return {
// //         cliente,
// //         totalActividades,
// //         completadas,
// //         enProceso,
// //         rendimiento: totalActividades > 0 ? Math.round((completadas / totalActividades) * 100) : 0,
// //       };
// //     } catch (error) {
// //       console.error('[v0] Error fetching cliente stats:', error);
// //       throw new HttpException('Error al obtener estadísticas', HttpStatus.INTERNAL_SERVER_ERROR);
// //     }
// //   }
// // }

// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { sql } from '../../../../../shared/utils/database';

// @Injectable()
// export class ClienteDashboardService {
//   async getStats(clienteUsuarioId: string) {
//     try {
//       // Obtener información del cliente
//       const clienteResult = await sql.query(
//         `
//         SELECT 
//           ce.*,
//           ep.nombre_empresa,
//           u.nombre || ' ' || u.apellido as ejecutiva_nombre,
//           u.email as ejecutiva_email
//         FROM public.cliente_empresa ce
//         JOIN public.empresa_proveedora ep ON ce.id_empresa = ep.id_empresa
//         LEFT JOIN public.usuarios u ON ce.id_ejecutiva = u.id_usuario
//         WHERE ce.id_usuario_cliente = $1
//         LIMIT 1
//         `,
//         [clienteUsuarioId]
//       );

//       // ✅ MANEJAR CASO SIN DATOS
//       if (clienteResult.rows.length === 0) {
//         // Devolver estructura vacía en lugar de error
//         return {
//           cliente: {
//             nombre_cliente: "Cliente no encontrado",
//             nombre_empresa: "Sin empresa asignada",
//             ejecutiva_nombre: "Sin ejecutiva asignada",
//             ejecutiva_email: ""
//           },
//           totalActividades: 0,
//           completadas: 0,
//           enProceso: 0,
//           rendimiento: 0
//         };
//       }

//       const cliente = clienteResult.rows[0];

//       // Total de actividades
//       const actividadesResult = await sql.query(
//         `SELECT COUNT(*) as total FROM public.trazabilidad t WHERE t.id_cliente = $1`,
//         [cliente.id_cliente]
//       );

//       // Actividades completadas
//       const completadasResult = await sql.query(
//         `SELECT COUNT(*) as total FROM public.trazabilidad t WHERE t.id_cliente = $1 AND t.estado = 'completado'`,
//         [cliente.id_cliente]
//       );

//       // Actividades en proceso
//       const enProcesoResult = await sql.query(
//         `SELECT COUNT(*) as total FROM public.trazabilidad t WHERE t.id_cliente = $1 AND t.estado = 'en_proceso'`,
//         [cliente.id_cliente]
//       );

//       const totalActividades = Number(actividadesResult.rows[0]?.total || 0);
//       const completadas = Number(completadasResult.rows[0]?.total || 0);
//       const enProceso = Number(enProcesoResult.rows[0]?.total || 0);

//       return {
//         cliente,
//         totalActividades,
//         completadas,
//         enProceso,
//         rendimiento: totalActividades > 0 ? Math.round((completadas / totalActividades) * 100) : 0,
//       };
//     } catch (error) {
//       console.error('[v0] Error fetching cliente stats:', error);
//       throw new HttpException('Error al obtener estadísticas', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }
// }

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmpresaProveedora } from '../../../../../shared/entities/EmpresaProveedora.entity';
import { Ejecutiva } from '../../../../../shared/entities/Ejecutiva.entity';
import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
import { Trazabilidad } from '../../../../../shared/entities/Trazabilidad.entity';

@Injectable()
export class EmpresaDashboardService {
  constructor(
    @InjectRepository(EmpresaProveedora)
    private empresaRepository: Repository<EmpresaProveedora>,

    @InjectRepository(Ejecutiva)
    private ejecutivaRepository: Repository<Ejecutiva>,

    @InjectRepository(ClienteFinal)
    private clienteRepository: Repository<ClienteFinal>,

    @InjectRepository(Trazabilidad)
    private trazabilidadRepository: Repository<Trazabilidad>,
  ) { }

  async getStats(empresaId: number) {
    try {
      console.log('📊 [EmpresaDashboardService] Obteniendo stats para empresa:', empresaId);

      // 1. Obtener información básica de la empresa
      const empresa = await this.empresaRepository.findOne({
        where: { id_empresa_prov: empresaId }
      });

      if (!empresa) {
        return this.getEmptyStats();
      }

      // 2. Obtener información de la ejecutiva asignada
      const ejecutivaInfo = await this.getEjecutivaInfo(empresaId);

      // 3. Obtener estadísticas en paralelo
      const [
        totalClientes,
        totalEjecutivas,
        totalActividades,
        actividadesEsteMes,
        clientesEsteMes,
        revenueTotal,
        pipelineOportunidades
      ] = await Promise.all([
        this.getTotalClientes(empresaId),
        this.getTotalEjecutivas(empresaId),
        this.getTotalActividades(empresaId),
        this.getActividadesEsteMes(empresaId),
        this.getClientesEsteMes(empresaId),
        this.getRevenueTotal(empresaId),
        this.getPipelineOportunidades(empresaId)
      ]);

      // 4. Calcular KPIs adicionales
      const ventasGanadas = await this.getVentasGanadas(empresaId);

      const tasaConversion = totalClientes > 0
        ? `${((ventasGanadas / totalClientes) * 100).toFixed(1)}%`
        : '0%';

      const rendimiento = totalActividades > 0
        ? Math.round((ventasGanadas / totalActividades) * 100)
        : 0;

      // 5. Construir respuesta
      const stats = {
        cliente: {
          nombre_cliente: empresa.razon_social,
          nombre_empresa: empresa.razon_social,
          ejecutiva_nombre: ejecutivaInfo.ejecutiva_nombre,
          ejecutiva_email: ejecutivaInfo.ejecutiva_email
        },
        totalActividades,
        completadas: ventasGanadas,
        enProceso: pipelineOportunidades,
        rendimiento,

        // Estadísticas adicionales para el dashboard
        totalClientes,
        totalEjecutivas,
        actividadesEsteMes,
        clientesEsteMes,
        revenueTotal,
        pipelineOportunidades,
        tasaConversion,
        ventasGanadas
      };

      console.log('✅ [EmpresaDashboardService] Stats obtenidas:', {
        empresa: empresa.razon_social,
        totalActividades,
        ventasGanadas,
        rendimiento
      });

      return stats;

    } catch (error) {
      console.error('❌ [EmpresaDashboardService] Error en getStats:', error);
      return this.getEmptyStats();
    }
  }

  // CORREGIR en services/cliente/dashboard.service.ts - método getTrazabilidad
  async getTrazabilidad(empresaId: number) {
    try {
      console.log('📋 [EmpresaDashboardService] Obteniendo trazabilidad para empresa:', empresaId);

      const trazabilidad = await this.trazabilidadRepository
        .createQueryBuilder('t')
        .leftJoin('t.ejecutiva', 'e')
        .leftJoin('t.empresa_proveedora', 'emp')
        .leftJoin('t.cliente_final', 'cf')
        .leftJoin('t.persona_contacto', 'pc')
        .select([
          't.id_trazabilidad',
          't.tipo_contacto as tipo_actividad',
          't.fecha_contacto as fecha_actividad',
          't.etapa_oportunidad',
          't.observaciones as descripcion', // ✅ COLUMNA CORRECTA
          't.informacion_importante as informacion_importante', // ✅ Datos adicionales
          't.resultados_reunion as resultados_reunion', // ✅ Datos adicionales
          'e.nombre_completo as ejecutiva_nombre',
          'emp.razon_social as nombre_empresa',
          'cf.razon_social as cliente_nombre',
          'pc.nombre_completo as contacto_nombre'
        ])
        .where('t.id_empresa_prov = :empresaId', { empresaId })
        .orderBy('t.fecha_contacto', 'DESC')
        .limit(50)
        .getRawMany();

      const trazabilidadFormateada = trazabilidad.map(item => ({
        id_trazabilidad: item.id_trazabilidad,
        tipo_actividad: item.tipo_actividad,
        descripcion: item.descripcion || `Contacto ${item.tipo_actividad} con ${item.contacto_nombre}`,
        fecha_actividad: item.fecha_actividad,
        resultado_contacto: this.mapEstadoTrazabilidad(item.etapa_oportunidad),
        notas: item.descripcion, // ✅ Usar observaciones como "notas"
        informacion_importante: item.informacion_importante,
        resultados_reunion: item.resultados_reunion,
        ejecutiva_nombre: item.ejecutiva_nombre,
        nombre_empresa: item.nombre_empresa,
        cliente_nombre: item.cliente_nombre,
        contacto_nombre: item.contacto_nombre
      }));

      console.log(`✅ [EmpresaDashboardService] ${trazabilidadFormateada.length} actividades obtenidas`);
      return trazabilidadFormateada;

    } catch (error) {
      console.error('❌ [EmpresaDashboardService] Error en getTrazabilidad:', error);
      return [];
    }
  }
  async getEjecutivaInfo(empresaId: number) {
    try {
      console.log('👩‍💼 [EmpresaDashboardService] Obteniendo información de ejecutiva para empresa:', empresaId);

      const ejecutivas = await this.ejecutivaRepository
        .createQueryBuilder('e')
        .select([
          'e.id_ejecutiva',
          'e.nombre_completo',
          'e.correo',
          'e.telefono',
          'e.linkedin'
        ])
        .where('e.id_empresa_prov = :empresaId', { empresaId })
        .andWhere('e.estado_ejecutiva = :estado', { estado: 'Activo' })
        .getMany();

      if (ejecutivas.length === 0) {
        return {
          ejecutiva_nombre: 'Sin ejecutiva asignada',
          ejecutiva_email: 'contacto@growvia.com',
          telefono: 'Por asignar'
        };
      }

      const ejecutivaPrincipal = ejecutivas[0];

      return {
        ejecutiva_nombre: ejecutivaPrincipal.nombre_completo,
        ejecutiva_email: ejecutivaPrincipal.correo,
        telefono: ejecutivaPrincipal.telefono || 'No disponible',
        linkedin: ejecutivaPrincipal.linkedin
      };

    } catch (error) {
      console.error('❌ [EmpresaDashboardService] Error en getEjecutivaInfo:', error);
      return {
        ejecutiva_nombre: 'Error al cargar información',
        ejecutiva_email: 'contacto@growvia.com',
        telefono: 'No disponible'
      };
    }
  }

  // ============================================
  // MÉTODOS AUXILIARES
  // ============================================

  private async getTotalClientes(empresaId: number): Promise<number> {
    try {
      const result = await this.clienteRepository
        .createQueryBuilder('cf')
        .where('cf.id_empresa_prov = :empresaId', { empresaId })
        .andWhere('cf.estado = :estado', { estado: 'Activo' })
        .getCount();

      return result;
    } catch (error) {
      console.error('❌ [EmpresaDashboardService] Error en getTotalClientes:', error);
      return 0;
    }
  }

  private async getTotalEjecutivas(empresaId: number): Promise<number> {
    try {
      const result = await this.ejecutivaRepository
        .createQueryBuilder('e')
        .where('e.id_empresa_prov = :empresaId', { empresaId })
        .andWhere('e.estado_ejecutiva = :estado', { estado: 'Activo' })
        .getCount();

      return result;
    } catch (error) {
      console.error('❌ [EmpresaDashboardService] Error en getTotalEjecutivas:', error);
      return 0;
    }
  }

  private async getTotalActividades(empresaId: number): Promise<number> {
    try {
      const result = await this.trazabilidadRepository
        .createQueryBuilder('t')
        .where('t.id_empresa_prov = :empresaId', { empresaId })
        .getCount();

      return result;
    } catch (error) {
      console.error('❌ [EmpresaDashboardService] Error en getTotalActividades:', error);
      return 0;
    }
  }

  private async getActividadesEsteMes(empresaId: number): Promise<number> {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const result = await this.trazabilidadRepository
        .createQueryBuilder('t')
        .where('t.id_empresa_prov = :empresaId', { empresaId })
        .andWhere('t.fecha_contacto >= :startOfMonth', { startOfMonth })
        .getCount();

      return result;
    } catch (error) {
      console.error('❌ [EmpresaDashboardService] Error en getActividadesEsteMes:', error);
      return 0;
    }
  }

  private async getClientesEsteMes(empresaId: number): Promise<number> {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const result = await this.clienteRepository
        .createQueryBuilder('cf')
        .where('cf.id_empresa_prov = :empresaId', { empresaId })
        .andWhere('cf.fecha_creacion >= :startOfMonth', { startOfMonth })
        .getCount();

      return result;
    } catch (error) {
      console.error('❌ [EmpresaDashboardService] Error en getClientesEsteMes:', error);
      return 0;
    }
  }

  private async getRevenueTotal(empresaId: number): Promise<number> {
    try {
      const result = await this.trazabilidadRepository
        .createQueryBuilder('t')
        .select('COALESCE(SUM(t.monto_cierre_final), 0)', 'revenue')
        .where('t.id_empresa_prov = :empresaId', { empresaId })
        .andWhere('t.etapa_oportunidad = :etapa', { etapa: 'Venta ganada' })
        .getRawOne();

      return parseFloat(result.revenue) || 0;
    } catch (error) {
      console.error('❌ [EmpresaDashboardService] Error en getRevenueTotal:', error);
      return 0;
    }
  }

  private async getPipelineOportunidades(empresaId: number): Promise<number> {
    try {
      const result = await this.trazabilidadRepository
        .createQueryBuilder('t')
        .where('t.id_empresa_prov = :empresaId', { empresaId })
        .andWhere('t.nombre_oportunidad IS NOT NULL')
        .andWhere('t.etapa_oportunidad NOT IN (:...etapas)', {
          etapas: ['Venta ganada', 'Venta perdida', 'Venta suspendida']
        })
        .getCount();

      return result;
    } catch (error) {
      console.error('❌ [EmpresaDashboardService] Error en getPipelineOportunidades:', error);
      return 0;
    }
  }

  private async getVentasGanadas(empresaId: number): Promise<number> {
    try {
      const result = await this.trazabilidadRepository
        .createQueryBuilder('t')
        .where('t.id_empresa_prov = :empresaId', { empresaId })
        .andWhere('t.etapa_oportunidad = :etapa', { etapa: 'Venta ganada' })
        .getCount();

      return result;
    } catch (error) {
      console.error('❌ [EmpresaDashboardService] Error en getVentasGanadas:', error);
      return 0;
    }
  }

  private mapEstadoTrazabilidad(estado: string): string {
    console.log("VIENDO", estado)
    if (!estado) return 'pendiente';

    const estadoMap: { [key: string]: string } = {
      'Venta ganada': 'completado',
      'Venta perdida': 'cancelado',
      'Venta suspendida': 'cancelado',
      'Prospección': 'en_proceso',
      'Calificación': 'en_proceso',
      'Detección de necesidades': 'en_proceso',
      'Presentación de solución': 'en_proceso',
      'Manejo de objeciones': 'en_proceso',
      'Presentación de propuesta': 'en_proceso',
      'Negociación': 'en_proceso',
      'Firma de contrato': 'en_proceso'
    };

    return estadoMap[estado] || 'en_proceso';
  }

  private getEmptyStats() {
    return {
      cliente: {
        nombre_cliente: "Empresa no encontrada",
        nombre_empresa: "Sin empresa asignada",
        ejecutiva_nombre: "Sin ejecutiva asignada",
        ejecutiva_email: "contacto@growvia.com"
      },
      totalActividades: 0,
      completadas: 0,
      enProceso: 0,
      rendimiento: 0,
      totalClientes: 0,
      totalEjecutivas: 0,
      actividadesEsteMes: 0,
      clientesEsteMes: 0,
      revenueTotal: 0,
      pipelineOportunidades: 0,
      tasaConversion: '0%',
      ventasGanadas: 0
    };
  }
}

