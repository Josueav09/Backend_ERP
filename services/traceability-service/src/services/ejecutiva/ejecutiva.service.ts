// backend/services/traceability-service/src/services/ejecutiva/ejecutiva.service.ts - CORREGIDO
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { sql, pool } from '../../../../../shared/utils/database';

@Injectable()
export class EjecutivaTraceabilityService {
  
  async getTrazabilidad(ejecutivaId: string) {
    try {
      const result = await sql.query(
        `
        SELECT 
          t.*,
          ep.nombre_empresa,
          ce.nombre_cliente
        FROM public.trazabilidad t
        JOIN public.empresa_proveedora ep ON t.id_empresa = ep.id_empresa
        LEFT JOIN public.cliente_empresa ce ON t.id_cliente = ce.id_cliente
        WHERE t.id_ejecutiva = $1
        ORDER BY t.fecha_actividad DESC
        LIMIT 50
        `,
        [ejecutivaId]
      );

      return result.rows;
    } catch (error) {
      throw new HttpException('Error al obtener trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createTrazabilidad(data: {
    id_ejecutiva: string;
    id_empresa: string;
    id_cliente?: string;
    tipo_actividad: string;
    descripcion: string;
    estado: string;
    notas?: string;
  }) {
    await sql.query("BEGIN");

    try {
      // Verificar que la empresa está asignada a esta ejecutiva
      const empresaCheckResult = await sql.query(
        `
        SELECT ee.* FROM public.empresa_ejecutiva ee
        WHERE ee.id_empresa = $1 AND ee.id_ejecutiva = $2 AND ee.activo = true
        `,
        [data.id_empresa, data.id_ejecutiva]
      );

      if (empresaCheckResult.rows.length === 0) {
        throw new HttpException('Empresa no asignada a esta ejecutiva', HttpStatus.FORBIDDEN);
      }

      // Crear trazabilidad
      const result = await sql.query(
        `
        INSERT INTO public.trazabilidad (
          id_ejecutiva, id_empresa, id_cliente, tipo_actividad, 
          descripcion, estado, notas, fecha_actividad
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING *
        `,
        [
          data.id_ejecutiva,
          data.id_empresa,
          data.id_cliente || null,
          data.tipo_actividad,
          data.descripcion,
          data.estado || 'en_proceso',
          data.notas || null,
        ]
      );

      await sql.query("COMMIT");
      return result.rows[0];
    } catch (error) {
      await sql.query("ROLLBACK");
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al crear trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}