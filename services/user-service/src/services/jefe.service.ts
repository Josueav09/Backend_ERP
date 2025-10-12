import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { sql } from '../../../../shared/utils/database';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class JefeService {
  private readonly userId = 12; // TODO: Reemplazar con ID real desde sesión

  async getPerfil() {
    const result = await sql.query(
      `SELECT 
         id_usuario,
         nombre,
         apellido,
         email,
         telefono,
         activo,
         fecha_creacion,
         ultima_conexion,
         intentos_fallidos,
         bloqueado_hasta,
         ip_bloqueada
       FROM usuarios
       WHERE id_usuario = $1 AND rol = 'jefe'`,
      [this.userId]
    );

    if (result.rows.length === 0) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    return result.rows[0];
  }

  async updatePerfil(data: any) {
    const { nombre, apellido, email, telefono, activo, bloqueado_hasta, ip_bloqueada } = data;

    if (!nombre || !apellido || !email) {
      throw new HttpException('Nombre, apellido y email son requeridos', HttpStatus.BAD_REQUEST);
    }

    const result = await sql.query(
      `UPDATE usuarios
       SET 
         nombre = $1,
         apellido = $2,
         email = $3,
         telefono = $4,
         activo = $5,
         bloqueado_hasta = $6,
         ip_bloqueada = $7
       WHERE id_usuario = $8 AND rol = 'jefe'
       RETURNING *`,
      [nombre, apellido, email, telefono || null, activo ?? true, bloqueado_hasta || null, ip_bloqueada || null, this.userId]
    );

    if (result.rows.length === 0) {
      throw new HttpException('No se pudo actualizar el perfil', HttpStatus.BAD_REQUEST);
    }

    return { message: "Perfil actualizado exitosamente", usuario: result.rows[0] };
  }

  async updatePassword(password_actual: string, password_nueva: string) {
    if (!password_actual || !password_nueva) {
      throw new HttpException('Contraseña actual y nueva son requeridas', HttpStatus.BAD_REQUEST);
    }

    if (password_nueva.length < 6) {
      throw new HttpException('La contraseña debe tener al menos 6 caracteres', HttpStatus.BAD_REQUEST);
    }

    const userResult = await sql.query(
      `SELECT password_hash
       FROM usuarios
       WHERE id_usuario = $1 AND rol = 'jefe'`,
      [this.userId]
    );

    if (userResult.rows.length === 0) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    const currentHash = userResult.rows[0].password_hash;

    const isValidPassword = await bcrypt.compare(password_actual, currentHash);
    if (!isValidPassword) {
      throw new HttpException('Contraseña actual incorrecta', HttpStatus.UNAUTHORIZED);
    }

    const hashedPassword = await bcrypt.hash(password_nueva, 10);

    await sql.query(
      `UPDATE usuarios
       SET password_hash = $1
       WHERE id_usuario = $2 AND rol = 'jefe'`,
      [hashedPassword, this.userId]
    );

    return { message: "Contraseña actualizada exitosamente" };
  }

  async getStats() {
    const empresasResult = await sql.query(
      'SELECT COUNT(*) as total FROM public.empresa_proveedora WHERE activo = true'
    );

    const ejecutivasResult = await sql.query(
      "SELECT COUNT(*) as total FROM public.usuarios WHERE rol = 'ejecutiva' AND activo = true"
    );

    const clientesResult = await sql.query(
      "SELECT COUNT(*) as total FROM public.cliente_empresa WHERE estado = 'activo'"
    );

    const actividadesResult = await sql.query(
      "SELECT COUNT(*) as total FROM public.trazabilidad WHERE fecha_actividad >= DATE_TRUNC('month', CURRENT_DATE)"
    );

    const trazabilidadEstadoResult = await sql.query(
      "SELECT estado, COUNT(*) as total FROM public.trazabilidad GROUP BY estado"
    );

    const actividadesPorEjecutivaResult = await sql.query(
      `SELECT 
        u.nombre || ' ' || u.apellido as ejecutiva,
        COUNT(t.id_trazabilidad) as total_actividades
      FROM public.usuarios u
      LEFT JOIN public.trazabilidad t ON u.id_usuario = t.id_ejecutiva
      WHERE u.rol = 'ejecutiva' AND u.activo = true
      GROUP BY u.id_usuario, u.nombre, u.apellido
      ORDER BY total_actividades DESC
      LIMIT 5`
    );

    const clientesPorEmpresaResult = await sql.query(
      `SELECT 
        ep.nombre_empresa,
        COUNT(ce.id_cliente) as total_clientes
      FROM public.empresa_proveedora ep
      LEFT JOIN public.cliente_empresa ce ON ep.id_empresa = ce.id_empresa
      WHERE ep.activo = true
      GROUP BY ep.id_empresa, ep.nombre_empresa
      ORDER BY total_clientes DESC`
    );

    return {
      totalEmpresas: Number(empresasResult.rows[0].total),
      totalEjecutivas: Number(ejecutivasResult.rows[0].total),
      totalClientes: Number(clientesResult.rows[0].total),
      actividadesMes: Number(actividadesResult.rows[0].total),
      trazabilidadPorEstado: trazabilidadEstadoResult.rows,
      actividadesPorEjecutiva: actividadesPorEjecutivaResult.rows,
      clientesPorEmpresa: clientesPorEmpresaResult.rows,
    };
  }
}