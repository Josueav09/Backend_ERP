// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { sql } from '../../../../../shared/utils/database';

// @Injectable()
// export class ClienteDashboardService {
//   async getStats(clienteUsuarioId: string) {
//     try {
//       // Obtener información del cliente - MANTENIENDO TU SQL ORIGINAL
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

//       if (clienteResult.rows.length === 0) {
//         throw new HttpException('Cliente no encontrado', HttpStatus.NOT_FOUND);
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

//       const totalActividades = Number(actividadesResult.rows[0].total);
//       const completadas = Number(completadasResult.rows[0].total);
//       const enProceso = Number(enProcesoResult.rows[0].total);

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
import { sql } from '../../../../../shared/utils/database';

@Injectable()
export class ClienteDashboardService {
  async getStats(clienteUsuarioId: string) {
    try {
      // Obtener información del cliente
      const clienteResult = await sql.query(
        `
        SELECT 
          ce.*,
          ep.nombre_empresa,
          u.nombre || ' ' || u.apellido as ejecutiva_nombre,
          u.email as ejecutiva_email
        FROM public.cliente_empresa ce
        JOIN public.empresa_proveedora ep ON ce.id_empresa = ep.id_empresa
        LEFT JOIN public.usuarios u ON ce.id_ejecutiva = u.id_usuario
        WHERE ce.id_usuario_cliente = $1
        LIMIT 1
        `,
        [clienteUsuarioId]
      );

      // ✅ MANEJAR CASO SIN DATOS
      if (clienteResult.rows.length === 0) {
        // Devolver estructura vacía en lugar de error
        return {
          cliente: {
            nombre_cliente: "Cliente no encontrado",
            nombre_empresa: "Sin empresa asignada",
            ejecutiva_nombre: "Sin ejecutiva asignada",
            ejecutiva_email: ""
          },
          totalActividades: 0,
          completadas: 0,
          enProceso: 0,
          rendimiento: 0
        };
      }

      const cliente = clienteResult.rows[0];

      // Total de actividades
      const actividadesResult = await sql.query(
        `SELECT COUNT(*) as total FROM public.trazabilidad t WHERE t.id_cliente = $1`,
        [cliente.id_cliente]
      );

      // Actividades completadas
      const completadasResult = await sql.query(
        `SELECT COUNT(*) as total FROM public.trazabilidad t WHERE t.id_cliente = $1 AND t.estado = 'completado'`,
        [cliente.id_cliente]
      );

      // Actividades en proceso
      const enProcesoResult = await sql.query(
        `SELECT COUNT(*) as total FROM public.trazabilidad t WHERE t.id_cliente = $1 AND t.estado = 'en_proceso'`,
        [cliente.id_cliente]
      );

      const totalActividades = Number(actividadesResult.rows[0]?.total || 0);
      const completadas = Number(completadasResult.rows[0]?.total || 0);
      const enProceso = Number(enProcesoResult.rows[0]?.total || 0);

      return {
        cliente,
        totalActividades,
        completadas,
        enProceso,
        rendimiento: totalActividades > 0 ? Math.round((completadas / totalActividades) * 100) : 0,
      };
    } catch (error) {
      console.error('[v0] Error fetching cliente stats:', error);
      throw new HttpException('Error al obtener estadísticas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}