// backend_ERP/shared/migrations/1700000000000-CreateTriggersAndViews.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTriggersAndViews1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Función para actualizar timestamp (CREATE OR REPLACE es idempotente)
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // 2. Función para fecha_cierre automática
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION set_fecha_cierre()
      RETURNS TRIGGER AS $$
      BEGIN
          IF NEW.etapa_oportunidad = 'Venta ganada' AND OLD.etapa_oportunidad != 'Venta ganada' THEN
              NEW.fecha_cierre = CURRENT_DATE;
          END IF;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // 3. Triggers con DROP IF EXISTS
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_jefe_updated_at ON JEFE`);
    await queryRunner.query(`CREATE TRIGGER update_jefe_updated_at BEFORE UPDATE ON JEFE FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`);

    await queryRunner.query(`DROP TRIGGER IF EXISTS update_empresa_updated_at ON EMPRESA_PROVEEDORA`);
    await queryRunner.query(`CREATE TRIGGER update_empresa_updated_at BEFORE UPDATE ON EMPRESA_PROVEEDORA FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`);

    await queryRunner.query(`DROP TRIGGER IF EXISTS update_ejecutiva_updated_at ON EJECUTIVA`);
    await queryRunner.query(`CREATE TRIGGER update_ejecutiva_updated_at BEFORE UPDATE ON EJECUTIVA FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`);

    await queryRunner.query(`DROP TRIGGER IF EXISTS update_cliente_updated_at ON CLIENTE_FINAL`);
    await queryRunner.query(`CREATE TRIGGER update_cliente_updated_at BEFORE UPDATE ON CLIENTE_FINAL FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`);

    await queryRunner.query(`DROP TRIGGER IF EXISTS update_contacto_updated_at ON PERSONA_CONTACTO`);
    await queryRunner.query(`CREATE TRIGGER update_contacto_updated_at BEFORE UPDATE ON PERSONA_CONTACTO FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`);

    // 4. Trigger para fecha_cierre
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_fecha_cierre ON TRAZABILIDAD`);
    await queryRunner.query(`CREATE TRIGGER trigger_fecha_cierre BEFORE UPDATE ON TRAZABILIDAD FOR EACH ROW EXECUTE FUNCTION set_fecha_cierre();`);

    // 5. Vistas (CREATE OR REPLACE ya es idempotente)
     await queryRunner.query(`
      CREATE OR REPLACE VIEW vista_dashboard_ejecutiva AS
      SELECT 
          e.id_ejecutiva,
          e.nombre_completo AS nombre_ejecutiva,
          emp.razon_social AS empresa_proveedora,
          COUNT(DISTINCT cf.id_cliente_final) AS total_clientes,
          COUNT(DISTINCT t.id_trazabilidad) AS total_gestiones,
          COUNT(DISTINCT CASE WHEN t.etapa_oportunidad = 'Venta ganada' THEN t.id_trazabilidad END) AS ventas_ganadas,
          COALESCE(SUM(CASE WHEN t.etapa_oportunidad = 'Venta ganada' THEN t.monto_cierre ELSE 0 END), 0) AS revenue_generado
      FROM EJECUTIVA e
      LEFT JOIN EMPRESA_PROVEEDORA emp ON e.id_empresa_prov = emp.id_empresa_prov
      LEFT JOIN CLIENTE_FINAL cf ON e.id_ejecutiva = cf.id_ejecutiva
      LEFT JOIN TRAZABILIDAD t ON e.id_ejecutiva = t.id_ejecutiva
      GROUP BY e.id_ejecutiva, e.nombre_completo, emp.razon_social;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE VIEW vista_pipeline_ventas AS
      SELECT 
          t.id_trazabilidad,
          t.nombre_oportunidad,
          e.nombre_completo AS ejecutiva,
          emp.razon_social AS empresa_proveedora,
          cf.razon_social AS cliente_final,
          pc.nombre_completo AS contacto_principal,
          t.etapa_oportunidad,
          t.monto_total_sin_imp,
          t.probabilidad_cierre,
          t.fecha_contacto,
          t.fecha_cierre
      FROM TRAZABILIDAD t
      JOIN EJECUTIVA e ON t.id_ejecutiva = e.id_ejecutiva
      JOIN EMPRESA_PROVEEDORA emp ON t.id_empresa_prov = emp.id_empresa_prov
      JOIN CLIENTE_FINAL cf ON t.id_cliente_final = cf.id_cliente_final
      JOIN PERSONA_CONTACTO pc ON t.id_contacto = pc.id_contacto
      WHERE t.etapa_oportunidad NOT IN ('Venta ganada', 'Venta perdida', 'Venta suspendida');
    `);

    await queryRunner.query(`
      CREATE OR REPLACE VIEW vista_ejecutivas_disponibles AS
      SELECT 
          e.id_ejecutiva,
          e.nombre_completo,
          e.correo,
          e.estado_ejecutiva,
          j.nombre_completo AS jefe_supervisor
      FROM EJECUTIVA e
      JOIN JEFE j ON e.id_jefe = j.id_jefe
      WHERE e.id_empresa_prov IS NULL 
      AND e.estado_ejecutiva = 'Activo';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar triggers
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_jefe_updated_at ON JEFE`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_empresa_updated_at ON EMPRESA_PROVEEDORA`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_ejecutiva_updated_at ON EJECUTIVA`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_cliente_updated_at ON CLIENTE_FINAL`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_contacto_updated_at ON PERSONA_CONTACTO`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_fecha_cierre ON TRAZABILIDAD`);

    // Eliminar funciones
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS set_fecha_cierre`);

    // Eliminar vistas
    await queryRunner.query(`DROP VIEW IF EXISTS vista_dashboard_ejecutiva`);
    await queryRunner.query(`DROP VIEW IF EXISTS vista_pipeline_ventas`);
    await queryRunner.query(`DROP VIEW IF EXISTS vista_ejecutivas_disponibles`);
  }
}