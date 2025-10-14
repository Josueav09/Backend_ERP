import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { sql } from '../../../../../shared/utils/database';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class EjecutivasService {
  async getEjecutivas() {
    const result = await sql.query(`
      SELECT 
        u.*,
        COUNT(DISTINCT ee.id_empresa) as total_empresas,
        COUNT(DISTINCT ce.id_cliente) as total_clientes,
        COUNT(DISTINCT t.id_trazabilidad) as total_actividades
      FROM public.usuarios u
      LEFT JOIN public.empresa_ejecutiva ee ON u.id_usuario = ee.id_ejecutiva AND ee.activo = true
      LEFT JOIN public.cliente_empresa ce ON u.id_usuario = ce.id_ejecutiva
      LEFT JOIN public.trazabilidad t ON u.id_usuario = t.id_ejecutiva
      WHERE u.rol = 'ejecutiva'
      GROUP BY u.id_usuario
      ORDER BY u.activo DESC, u.nombre
    `);
    return result.rows;
  }

  async getEjecutivaById(id: number) {
    const result = await sql.query(
      `SELECT 
        id_usuario, nombre, apellido, email, telefono, rol, activo
      FROM public.usuarios 
      WHERE id_usuario = $1 AND rol = 'ejecutiva'`,
      [id]
    );

    if (result.rows.length === 0) return null;

    const ejecutiva = result.rows[0];

    const empresasResult = await sql.query(
      `SELECT 
        ep.id_empresa,
        ep.nombre_empresa,
        ep.rut,
        ee.fecha_asignacion,
        ee.activo as asignacion_activa
      FROM public.empresa_ejecutiva ee
      JOIN public.empresa_proveedora ep ON ee.id_empresa = ep.id_empresa
      WHERE ee.id_ejecutiva = $1
      ORDER BY ee.fecha_asignacion DESC`,
      [id]
    );

    const clientesResult = await sql.query(
      `SELECT 
        ce.id_cliente,
        ce.nombre_cliente,
        ce.rut_cliente,
        ce.email,
        ce.telefono,
        ce.estado,
        ep.nombre_empresa,
        ce.fecha_registro
      FROM public.cliente_empresa ce
      JOIN public.empresa_proveedora ep ON ce.id_empresa = ep.id_empresa
      WHERE ce.id_ejecutiva = $1
      ORDER BY ce.fecha_registro DESC`,
      [id]
    );

    return {
      ejecutiva,
      empresas: empresasResult.rows,
      clientes: clientesResult.rows,
    };
  }

  async createEjecutiva(data: any) {
    const { nombre, apellido, email, telefono, password } = data;

    const existingUser = await sql.query(
      `SELECT id_usuario FROM public.usuarios WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new HttpException('El email ya está registrado', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await sql.query(
      `INSERT INTO public.usuarios 
        (nombre, apellido, email, telefono, password_hash, rol, activo)
      VALUES ($1, $2, $3, $4, $5, 'ejecutiva', true)
      RETURNING *`,
      [nombre, apellido, email, telefono || null, hashedPassword]
    );

    return result.rows[0];
  }

  async updateEjecutiva(id: number, data: any) {
    const { nombre, apellido, email, telefono, activo } = data;

    const result = await sql.query(
      `UPDATE public.usuarios 
       SET nombre = $1, apellido = $2, email = $3, telefono = $4, activo = $5
       WHERE id_usuario = $6 AND rol = 'ejecutiva'
       RETURNING *`,
      [nombre, apellido, email, telefono, activo, id]
    );

    return result.rows[0] || null;
  }

  async deleteEjecutiva(id: number) {
    const result = await sql.query(
      `UPDATE public.usuarios 
       SET activo = false
       WHERE id_usuario = $1 AND rol = 'ejecutiva'
       RETURNING *`,
      [id]
    );

    return result.rows[0] || null;
  }
}