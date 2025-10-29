import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { sql } from '../../../../../shared/utils/database';

@Injectable()
export class ClienteTrazabilidadService {
  async getTrazabilidadByCliente(clienteUsuarioId: string) {
    try {
      // Obtener ID del cliente empresa
      const clienteInfoResult = await sql.query(
        `SELECT id_cliente FROM public.cliente_empresa WHERE id_usuario_cliente = $1 LIMIT 1`,
        [clienteUsuarioId]
      );

      // ✅ MANEJAR CASO SIN DATOS
      if (clienteInfoResult.rows.length === 0) {
        return []; // Devolver array vacío
      }

      const clienteId = clienteInfoResult.rows[0].id_cliente;

      // Obtener trazabilidad del cliente
      const trazabilidadResult = await sql.query(
        `
        SELECT 
          t.*,
          u.nombre || ' ' || u.apellido as ejecutiva_nombre,
          ep.nombre_empresa
        FROM public.trazabilidad t
        JOIN public.usuarios u ON t.id_ejecutiva = u.id_usuario
        JOIN public.empresa_proveedora ep ON t.id_empresa = ep.id_empresa
        WHERE t.id_cliente = $1
        ORDER BY t.fecha_actividad DESC
        `,
        [clienteId]
      );

      return trazabilidadResult.rows;
    } catch (error) {
      console.error('[v0] Error fetching trazabilidad:', error);
      throw new HttpException('Error al obtener trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}