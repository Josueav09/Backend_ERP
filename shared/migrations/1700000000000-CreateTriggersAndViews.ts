// // backend_ERP/shared/migrations/1700000000000-CreateTriggersAndViews.ts
// import { MigrationInterface, QueryRunner } from 'typeorm';

// export class CreateTriggersAndViews1700000000000 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     // 1. Función para actualizar timestamp (CREATE OR REPLACE es idempotente)
//     await queryRunner.query(`
//       CREATE OR REPLACE FUNCTION update_updated_at_column()
//       RETURNS TRIGGER AS $$
//       BEGIN
//           NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
//           RETURN NEW;
//       END;
//       $$ language 'plpgsql';
//     `);

//     // 2. Función para fecha_cierre automática
//     await queryRunner.query(`
//       CREATE OR REPLACE FUNCTION set_fecha_cierre()
//       RETURNS TRIGGER AS $$
//       BEGIN
//           IF NEW.etapa_oportunidad = 'Venta ganada' AND OLD.etapa_oportunidad != 'Venta ganada' THEN
//               NEW.fecha_cierre = CURRENT_DATE;
//           END IF;
//           RETURN NEW;
//       END;
//       $$ language 'plpgsql';
//     `);

//     // 3. Triggers con DROP IF EXISTS
//     await queryRunner.query(`DROP TRIGGER IF EXISTS update_jefe_updated_at ON JEFE`);
//     await queryRunner.query(`CREATE TRIGGER update_jefe_updated_at BEFORE UPDATE ON JEFE FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`);

//     await queryRunner.query(`DROP TRIGGER IF EXISTS update_empresa_updated_at ON EMPRESA_PROVEEDORA`);
//     await queryRunner.query(`CREATE TRIGGER update_empresa_updated_at BEFORE UPDATE ON EMPRESA_PROVEEDORA FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`);

//     await queryRunner.query(`DROP TRIGGER IF EXISTS update_ejecutiva_updated_at ON EJECUTIVA`);
//     await queryRunner.query(`CREATE TRIGGER update_ejecutiva_updated_at BEFORE UPDATE ON EJECUTIVA FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`);

//     await queryRunner.query(`DROP TRIGGER IF EXISTS update_cliente_updated_at ON CLIENTE_FINAL`);
//     await queryRunner.query(`CREATE TRIGGER update_cliente_updated_at BEFORE UPDATE ON CLIENTE_FINAL FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`);

//     await queryRunner.query(`DROP TRIGGER IF EXISTS update_contacto_updated_at ON PERSONA_CONTACTO`);
//     await queryRunner.query(`CREATE TRIGGER update_contacto_updated_at BEFORE UPDATE ON PERSONA_CONTACTO FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`);

//     // 4. Trigger para fecha_cierre
//     await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_fecha_cierre ON TRAZABILIDAD`);
//     await queryRunner.query(`CREATE TRIGGER trigger_fecha_cierre BEFORE UPDATE ON TRAZABILIDAD FOR EACH ROW EXECUTE FUNCTION set_fecha_cierre();`);

//     // 5. Vistas (CREATE OR REPLACE ya es idempotente)
//      await queryRunner.query(`
//       CREATE OR REPLACE VIEW vista_dashboard_ejecutiva AS
//       SELECT 
//           e.id_ejecutiva,
//           e.nombre_completo AS nombre_ejecutiva,
//           emp.razon_social AS empresa_proveedora,
//           COUNT(DISTINCT cf.id_cliente_final) AS total_clientes,
//           COUNT(DISTINCT t.id_trazabilidad) AS total_gestiones,
//           COUNT(DISTINCT CASE WHEN t.etapa_oportunidad = 'Venta ganada' THEN t.id_trazabilidad END) AS ventas_ganadas,
//           COALESCE(SUM(CASE WHEN t.etapa_oportunidad = 'Venta ganada' THEN t.monto_cierre ELSE 0 END), 0) AS revenue_generado
//       FROM EJECUTIVA e
//       LEFT JOIN EMPRESA_PROVEEDORA emp ON e.id_empresa_prov = emp.id_empresa_prov
//       LEFT JOIN CLIENTE_FINAL cf ON e.id_ejecutiva = cf.id_ejecutiva
//       LEFT JOIN TRAZABILIDAD t ON e.id_ejecutiva = t.id_ejecutiva
//       GROUP BY e.id_ejecutiva, e.nombre_completo, emp.razon_social;
//     `);

//     await queryRunner.query(`
//       CREATE OR REPLACE VIEW vista_pipeline_ventas AS
//       SELECT 
//           t.id_trazabilidad,
//           t.nombre_oportunidad,
//           e.nombre_completo AS ejecutiva,
//           emp.razon_social AS empresa_proveedora,
//           cf.razon_social AS cliente_final,
//           pc.nombre_completo AS contacto_principal,
//           t.etapa_oportunidad,
//           t.monto_total_sin_imp,
//           t.probabilidad_cierre,
//           t.fecha_contacto,
//           t.fecha_cierre
//       FROM TRAZABILIDAD t
//       JOIN EJECUTIVA e ON t.id_ejecutiva = e.id_ejecutiva
//       JOIN EMPRESA_PROVEEDORA emp ON t.id_empresa_prov = emp.id_empresa_prov
//       JOIN CLIENTE_FINAL cf ON t.id_cliente_final = cf.id_cliente_final
//       JOIN PERSONA_CONTACTO pc ON t.id_contacto = pc.id_contacto
//       WHERE t.etapa_oportunidad NOT IN ('Venta ganada', 'Venta perdida', 'Venta suspendida');
//     `);

//     await queryRunner.query(`
//       CREATE OR REPLACE VIEW vista_ejecutivas_disponibles AS
//       SELECT 
//           e.id_ejecutiva,
//           e.nombre_completo,
//           e.correo,
//           e.estado_ejecutiva,
//           j.nombre_completo AS jefe_supervisor
//       FROM EJECUTIVA e
//       JOIN JEFE j ON e.id_jefe = j.id_jefe
//       WHERE e.id_empresa_prov IS NULL 
//       AND e.estado_ejecutiva = 'Activo';
//     `);
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     // Eliminar triggers
//     await queryRunner.query(`DROP TRIGGER IF EXISTS update_jefe_updated_at ON JEFE`);
//     await queryRunner.query(`DROP TRIGGER IF EXISTS update_empresa_updated_at ON EMPRESA_PROVEEDORA`);
//     await queryRunner.query(`DROP TRIGGER IF EXISTS update_ejecutiva_updated_at ON EJECUTIVA`);
//     await queryRunner.query(`DROP TRIGGER IF EXISTS update_cliente_updated_at ON CLIENTE_FINAL`);
//     await queryRunner.query(`DROP TRIGGER IF EXISTS update_contacto_updated_at ON PERSONA_CONTACTO`);
//     await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_fecha_cierre ON TRAZABILIDAD`);

//     // Eliminar funciones
//     await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column`);
//     await queryRunner.query(`DROP FUNCTION IF EXISTS set_fecha_cierre`);

//     // Eliminar vistas
//     await queryRunner.query(`DROP VIEW IF EXISTS vista_dashboard_ejecutiva`);
//     await queryRunner.query(`DROP VIEW IF EXISTS vista_pipeline_ventas`);
//     await queryRunner.query(`DROP VIEW IF EXISTS vista_ejecutivas_disponibles`);
//   }
// }


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

    // 2. Función para monto_cierre_final automático (NUEVA)
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION set_monto_cierre_final()
      RETURNS TRIGGER AS $$
      BEGIN
          IF NEW.etapa_oportunidad = 'Venta ganada' AND (OLD.etapa_oportunidad IS NULL OR OLD.etapa_oportunidad != 'Venta ganada') THEN
              -- Si no se especificó monto_cierre_final, usar el monto esperado
              IF NEW.monto_cierre_final IS NULL THEN
                  NEW.monto_cierre_final = NEW.monto_total_sin_imp;
              END IF;
          END IF;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // 3. Función para validar embudo de ventas (NUEVA)
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION validar_embudo_ventas()
      RETURNS TRIGGER AS $$
      BEGIN
          -- Si se crea/actualiza una oportunidad (Etapa 2), debe haber pasado al embudo
          IF NEW.nombre_oportunidad IS NOT NULL AND NEW.pasa_embudo_ventas = FALSE THEN
              RAISE EXCEPTION 'Para crear una oportunidad, pasa_embudo_ventas debe ser TRUE';
          END IF;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // 4. Triggers con DROP IF EXISTS
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

    // 5. Triggers nuevos para TRAZABILIDAD
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_monto_cierre_final ON TRAZABILIDAD`);
    await queryRunner.query(`CREATE TRIGGER trigger_monto_cierre_final BEFORE INSERT OR UPDATE ON TRAZABILIDAD FOR EACH ROW EXECUTE FUNCTION set_monto_cierre_final();`);

    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_validar_embudo ON TRAZABILIDAD`);
    await queryRunner.query(`CREATE TRIGGER trigger_validar_embudo BEFORE INSERT OR UPDATE ON TRAZABILIDAD FOR EACH ROW EXECUTE FUNCTION validar_embudo_ventas();`);

    // 6. Vistas actualizadas (CREATE OR REPLACE ya es idempotente)
    
    // Vista: ETAPA 1 - Generación de Oportunidades (NUEVA)
    await queryRunner.query(`
      CREATE OR REPLACE VIEW vista_etapa1_generacion AS
      SELECT 
          t.id_trazabilidad,
          cf.ruc,
          cf.razon_social AS cliente_final,
          cf.pais,
          t.fecha_agregado_base,
          pc.nombre_completo AS nombre_contacto,
          pc.cargo,
          pc.correo AS contacto_correo,
          pc.telefono AS contacto_telefono,
          pc.linkedin AS contacto_linkedin,
          t.tipo_contacto,
          t.fecha_contacto,
          t.fecha_respuesta,
          t.resultado_contacto,
          t.informacion_importante,
          t.reunion_agendada,
          t.fecha_reunion,
          t.participantes,
          t.se_dio_reunion,
          t.resultados_reunion,
          t.pasa_embudo_ventas,
          e.nombre_completo AS ejecutiva,
          emp.razon_social AS empresa_proveedora,
          -- Cálculo de semana para agrupación
          DATE_TRUNC('week', t.fecha_contacto) AS semana_contacto
      FROM TRAZABILIDAD t
      JOIN CLIENTE_FINAL cf ON t.id_cliente_final = cf.id_cliente_final
      JOIN PERSONA_CONTACTO pc ON t.id_contacto = pc.id_contacto
      JOIN EJECUTIVA e ON t.id_ejecutiva = e.id_ejecutiva
      JOIN EMPRESA_PROVEEDORA emp ON t.id_empresa_prov = emp.id_empresa_prov
      WHERE t.pasa_embudo_ventas = FALSE OR t.nombre_oportunidad IS NULL
      ORDER BY t.fecha_contacto DESC;
    `);

    // Vista: ETAPA 2 - Gestión de Oportunidades (NUEVA)
    await queryRunner.query(`
      CREATE OR REPLACE VIEW vista_etapa2_embudo AS
      SELECT 
          t.id_trazabilidad,
          cf.ruc,
          cf.razon_social AS cliente_final,
          pc.nombre_completo AS contacto,
          pc.cargo,
          t.nombre_oportunidad,
          t.tipo_oportunidad,
          t.etapa_oportunidad,
          t.fecha_inicio_etapa,
          t.producto_ofrecido,
          t.fecha_registro_oportunidad,
          t.fecha_cierre_esperado,
          t.monto_total_sin_imp AS monto_esperado,
          t.probabilidad_cierre,
          t.monto_cierre_final,
          t.observaciones,
          e.nombre_completo AS ejecutiva,
          emp.razon_social AS empresa_proveedora,
          -- Cálculos para reportes
          DATE_TRUNC('day', t.fecha_registro_oportunidad) AS dia_registro,
          DATE_TRUNC('week', t.fecha_registro_oportunidad) AS semana_registro,
          DATE_TRUNC('month', t.fecha_registro_oportunidad) AS mes_registro,
          DATE_TRUNC('year', t.fecha_registro_oportunidad) AS anio_registro,
          -- Días en etapa actual
          CURRENT_DATE - t.fecha_inicio_etapa AS dias_en_etapa
      FROM TRAZABILIDAD t
      JOIN CLIENTE_FINAL cf ON t.id_cliente_final = cf.id_cliente_final
      JOIN PERSONA_CONTACTO pc ON t.id_contacto = pc.id_contacto
      JOIN EJECUTIVA e ON t.id_ejecutiva = e.id_ejecutiva
      JOIN EMPRESA_PROVEEDORA emp ON t.id_empresa_prov = emp.id_empresa_prov
      WHERE t.pasa_embudo_ventas = TRUE 
        AND t.nombre_oportunidad IS NOT NULL
        AND t.etapa_oportunidad NOT IN ('Venta perdida', 'Venta suspendida')
      ORDER BY t.fecha_inicio_etapa DESC;
    `);

    // Vista: KPIs Semanales para Cliente TIER 1 (NUEVA)
    await queryRunner.query(`
      CREATE OR REPLACE VIEW vista_kpis_semanales AS
      SELECT 
          emp.id_empresa_prov,
          emp.razon_social AS empresa_proveedora,
          DATE_TRUNC('week', t.fecha_contacto) AS semana,
          
          -- ETAPA 1: Contactos
          COUNT(DISTINCT CASE WHEN t.pasa_embudo_ventas = FALSE THEN t.id_trazabilidad END) AS total_contactos_etapa1,
          COUNT(DISTINCT CASE WHEN t.resultado_contacto = 'Positivo' AND t.pasa_embudo_ventas = FALSE THEN t.id_trazabilidad END) AS contactos_positivos,
          COUNT(DISTINCT CASE WHEN t.pasa_embudo_ventas = TRUE THEN t.id_trazabilidad END) AS oportunidades_generadas,
          
          -- ETAPA 2: Oportunidades
          COUNT(DISTINCT CASE WHEN t.nombre_oportunidad IS NOT NULL THEN t.id_trazabilidad END) AS total_oportunidades,
          SUM(CASE WHEN t.nombre_oportunidad IS NOT NULL THEN t.monto_total_sin_imp ELSE 0 END) AS monto_total_pipeline,
          
          -- Conversión
          ROUND(
              (COUNT(DISTINCT CASE WHEN t.pasa_embudo_ventas = TRUE THEN t.id_trazabilidad END)::DECIMAL / 
               NULLIF(COUNT(DISTINCT CASE WHEN t.pasa_embudo_ventas = FALSE THEN t.id_trazabilidad END), 0)) * 100, 
              2
          ) AS tasa_conversion_embudo,
          
          -- Ventas ganadas
          COUNT(DISTINCT CASE WHEN t.etapa_oportunidad = 'Venta ganada' THEN t.id_trazabilidad END) AS ventas_ganadas,
          SUM(CASE WHEN t.etapa_oportunidad = 'Venta ganada' THEN t.monto_cierre_final ELSE 0 END) AS revenue_semanal
          
      FROM TRAZABILIDAD t
      JOIN EMPRESA_PROVEEDORA emp ON t.id_empresa_prov = emp.id_empresa_prov
      GROUP BY emp.id_empresa_prov, emp.razon_social, DATE_TRUNC('week', t.fecha_contacto)
      ORDER BY semana DESC, emp.razon_social;
    `);

    // Vista: Dashboard Ejecutiva (ACTUALIZADA)
    await queryRunner.query(`
      CREATE OR REPLACE VIEW vista_dashboard_ejecutiva AS
      SELECT 
          e.id_ejecutiva,
          e.nombre_completo AS nombre_ejecutiva,
          emp.razon_social AS empresa_proveedora,
          COUNT(DISTINCT cf.id_cliente_final) AS total_clientes,
          COUNT(DISTINCT t.id_trazabilidad) AS total_gestiones,
          COUNT(DISTINCT CASE WHEN t.etapa_oportunidad = 'Venta ganada' THEN t.id_trazabilidad END) AS ventas_ganadas,
          COALESCE(SUM(CASE WHEN t.etapa_oportunidad = 'Venta ganada' THEN t.monto_cierre_final ELSE 0 END), 0) AS revenue_generado
      FROM EJECUTIVA e
      LEFT JOIN EMPRESA_PROVEEDORA emp ON e.id_empresa_prov = emp.id_empresa_prov
      LEFT JOIN CLIENTE_FINAL cf ON e.id_ejecutiva = cf.id_ejecutiva
      LEFT JOIN TRAZABILIDAD t ON e.id_ejecutiva = t.id_ejecutiva
      GROUP BY e.id_ejecutiva, e.nombre_completo, emp.razon_social;
    `);

    // Vista: Pipeline de Ventas (ACTUALIZADA)
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
          t.fecha_cierre_esperado,
          t.monto_cierre_final
      FROM TRAZABILIDAD t
      JOIN EJECUTIVA e ON t.id_ejecutiva = e.id_ejecutiva
      JOIN EMPRESA_PROVEEDORA emp ON t.id_empresa_prov = emp.id_empresa_prov
      JOIN CLIENTE_FINAL cf ON t.id_cliente_final = cf.id_cliente_final
      JOIN PERSONA_CONTACTO pc ON t.id_contacto = pc.id_contacto
      WHERE t.etapa_oportunidad NOT IN ('Venta ganada', 'Venta perdida', 'Venta suspendida');
    `);

    // Vista: Ejecutivas disponibles para reasignación (ACTUALIZADA)
    await queryRunner.query(`
      CREATE OR REPLACE VIEW vista_ejecutivas_disponibles AS
      SELECT 
          e.id_ejecutiva,
          e.nombre_completo,
          e.correo,
          e.estado_ejecutiva,
          j.nombre_completo AS jefe_supervisor,
          j.rol AS rol_supervisor
      FROM EJECUTIVA e
      JOIN JEFE j ON e.id_jefe = j.id_jefe
      WHERE e.id_empresa_prov IS NULL 
      AND e.estado_ejecutiva = 'Activo';
    `);

    // Vista: Usuarios con permisos administrativos (NUEVA)
    await queryRunner.query(`
      CREATE OR REPLACE VIEW vista_usuarios_admin AS
      SELECT 
          id_jefe,
          dni,
          nombre_completo,
          correo,
          telefono,
          linkedin,
          rol,
          fecha_creacion,
          fecha_actualizacion
      FROM JEFE
      WHERE rol IN ('Jefe', 'Administrador')
      ORDER BY rol, nombre_completo;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar triggers
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_jefe_updated_at ON JEFE`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_empresa_updated_at ON EMPRESA_PROVEEDORA`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_ejecutiva_updated_at ON EJECUTIVA`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_cliente_updated_at ON CLIENTE_FINAL`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_contacto_updated_at ON PERSONA_CONTACTO`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_monto_cierre_final ON TRAZABILIDAD`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_validar_embudo ON TRAZABILIDAD`);

    // Eliminar funciones
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS set_monto_cierre_final`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS validar_embudo_ventas`);

    // Eliminar vistas
    await queryRunner.query(`DROP VIEW IF EXISTS vista_etapa1_generacion`);
    await queryRunner.query(`DROP VIEW IF EXISTS vista_etapa2_embudo`);
    await queryRunner.query(`DROP VIEW IF EXISTS vista_kpis_semanales`);
    await queryRunner.query(`DROP VIEW IF EXISTS vista_dashboard_ejecutiva`);
    await queryRunner.query(`DROP VIEW IF EXISTS vista_pipeline_ventas`);
    await queryRunner.query(`DROP VIEW IF EXISTS vista_ejecutivas_disponibles`);
    await queryRunner.query(`DROP VIEW IF EXISTS vista_usuarios_admin`);
  }
}