import { Injectable } from '@nestjs/common';
import { sql } from '../../../../shared/utils/database';

@Injectable()
export class AuditService {
  async getAuditoriaContratos() {
    const result = await sql.query(`
      SELECT 
        a.id_auditoria,
        a.id_cliente,
        a.accion,
        a.detalles,
        a.fecha_accion,
        a.id_ejecutiva,
        a.usuario_responsable,
        c.nombre_cliente,
        c.rut_cliente,
        CONCAT(e.nombre, ' ', e.apellido) as ejecutiva_nombre,
        CONCAT(r.nombre, ' ', r.apellido) as responsable_nombre
      FROM auditoria_contratos a
      LEFT JOIN cliente_empresa c ON a.id_cliente = c.id_cliente
      LEFT JOIN usuarios e ON a.id_ejecutiva = e.id_usuario
      LEFT JOIN usuarios r ON a.usuario_responsable = r.id_usuario
      ORDER BY a.fecha_accion DESC
    `);
    return result.rows;
  }
}