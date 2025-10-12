import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { sql, pool } from '../../../../shared/utils/database';

@Injectable()
export class EmpresasService {
  async getEmpresas() {
    const result = await sql.query(`
      SELECT 
        ep.*,
        COUNT(DISTINCT ee.id_ejecutiva)::int as total_ejecutivas,
        COUNT(DISTINCT ce.id_cliente)::int as total_clientes
      FROM public.empresa_proveedora ep
      LEFT JOIN public.empresa_ejecutiva ee ON ep.id_empresa = ee.id_empresa AND ee.activo = true
      LEFT JOIN public.cliente_empresa ce ON ep.id_empresa = ce.id_empresa
      GROUP BY ep.id_empresa
      ORDER BY ep.activo DESC, ep.nombre_empresa
    `);
    return result.rows;
  }

  async createEmpresa(data: any) {
    const { nombre_empresa, rut, direccion, telefono, email_contacto } = data;

    const result = await sql.query(
      `INSERT INTO public.empresa_proveedora 
       (nombre_empresa, rut, direccion, telefono, email_contacto)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nombre_empresa, rut, direccion, telefono, email_contacto]
    );

    return result.rows[0];
  }

  async updateEmpresaEstado(empresaId: number, activo: boolean) {
    await sql.query("BEGIN");

    try {
      const empresaResult = await sql.query(
        `UPDATE public.empresa_proveedora
         SET activo = $1
         WHERE id_empresa = $2
         RETURNING *`,
        [activo, empresaId]
      );

      if (empresaResult.rows.length === 0) {
        await sql.query("ROLLBACK");
        throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
      }

      const clientesResult = await sql.query(
        `UPDATE public.cliente_empresa
         SET estado = $1
         WHERE id_empresa = $2
         RETURNING id_cliente`,
        [activo ? "activo" : "inactivo", empresaId]
      );

      await sql.query("COMMIT");

      return {
        empresa: empresaResult.rows[0],
        clientesActualizados: clientesResult.rows.length,
        message: `Empresa ${activo ? "activada" : "desactivada"} correctamente. ${clientesResult.rows.length} cliente(s) actualizado(s).`,
      };
    } catch (error) {
      await sql.query("ROLLBACK");
      throw error;
    }
  }

  async getEmpresaEjecutivas(empresaId: number) {
    if (!empresaId || isNaN(empresaId)) {
      throw new HttpException('ID de empresa inválido', HttpStatus.BAD_REQUEST);
    }

    const empresaResult = await sql.query(
      `SELECT * FROM empresa_proveedora WHERE id_empresa = $1`,
      [empresaId]
    );

    if (empresaResult.rows.length === 0) {
      throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
    }

    const ejecutivasResult = await sql.query(
      `SELECT 
         ee.id_relacion,
         ee.id_empresa,
         ee.id_ejecutiva AS id_usuario,
         u.nombre,
         u.apellido,
         u.email,
         ee.fecha_asignacion,
         ee.fecha_desasignacion,
         ee.activo
       FROM empresa_ejecutiva ee
       LEFT JOIN usuarios u ON ee.id_ejecutiva = u.id_usuario
       WHERE ee.id_empresa = $1 AND ee.activo = true
       ORDER BY u.nombre`,
      [empresaId]
    );

    return {
      ...empresaResult.rows[0],
      ejecutivas: ejecutivasResult.rows || [],
    };
  }

  async addEjecutivaToEmpresa(empresaId: number, ejecutivaId: number) {
    if (!empresaId || !ejecutivaId) {
      throw new HttpException('ID de empresa o ejecutiva inválido', HttpStatus.BAD_REQUEST);
    }

    const existing = await sql.query(
      `SELECT * FROM empresa_ejecutiva WHERE id_empresa = $1 AND id_ejecutiva = $2`,
      [empresaId, ejecutivaId]
    );

    if (existing.rows.length > 0) {
      if (existing.rows[0].activo) {
        throw new HttpException('Esta ejecutiva ya está asignada', HttpStatus.BAD_REQUEST);
      } else {
        const result = await sql.query(
          `UPDATE empresa_ejecutiva
           SET activo = true, fecha_asignacion = NOW(), fecha_desasignacion = NULL
           WHERE id_empresa = $1 AND id_ejecutiva = $2
           RETURNING *`,
          [empresaId, ejecutivaId]
        );
        return result.rows[0];
      }
    }

    const result = await sql.query(
      `INSERT INTO empresa_ejecutiva (id_empresa, id_ejecutiva, fecha_asignacion, activo)
       VALUES ($1, $2, NOW(), true)
       RETURNING *`,
      [empresaId, ejecutivaId]
    );

    return result.rows[0] || {};
  }

  async removeEjecutivaFromEmpresa(empresaId: number, ejecutivaId: number) {
    if (!empresaId || !ejecutivaId) {
      throw new HttpException('ID de empresa o ejecutiva inválido', HttpStatus.BAD_REQUEST);
    }

    const client = await pool.connect();

    const result = await client.query(
      `UPDATE empresa_ejecutiva
       SET activo = false, fecha_desasignacion = NOW()
       WHERE id_empresa = $1 AND id_ejecutiva = $2 AND activo = true`,
      [empresaId, ejecutivaId]
    );

    client.release();

    if (result.rowCount === 0) {
      throw new HttpException('No se encontró la relación activa entre la empresa y la ejecutiva', HttpStatus.NOT_FOUND);
    }

    return { message: "Ejecutiva removida correctamente" };
  }
}