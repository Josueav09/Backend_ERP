import { Injectable } from '@nestjs/common';
import { sql } from '../../../../../shared/utils/database';

@Injectable()
export class TrazabilidadService {
  async getTrazabilidad(empresaId?: string, ejecutivaId?: string, clienteId?: string) {
    let query = `
      SELECT 
        t.*,
        u.nombre || ' ' || u.apellido as ejecutiva_nombre,
        u.activo as ejecutiva_activa,
        ep.nombre_empresa,
        ce.nombre_cliente
      FROM public.trazabilidad t
      JOIN public.usuarios u ON t.id_ejecutiva = u.id_usuario
      JOIN public.empresa_proveedora ep ON t.id_empresa = ep.id_empresa
      LEFT JOIN public.cliente_empresa ce ON t.id_cliente = ce.id_cliente
      WHERE 1=1
    `;

    const params: any[] = [];
    let idx = 1;

    if (empresaId) {
      query += ` AND t.id_empresa = $${idx}`;
      params.push(empresaId);
      idx++;
    }

    if (ejecutivaId) {
      query += ` AND t.id_ejecutiva = $${idx}`;
      params.push(ejecutivaId);
      idx++;
    }

    if (clienteId) {
      query += ` AND t.id_cliente = $${idx}`;
      params.push(clienteId);
      idx++;
    }

    query += ` ORDER BY t.fecha_actividad DESC`;

    const result = await sql.query(query, params);
    return result.rows;
  }
}