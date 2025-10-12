"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresasService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../shared/utils/database");
let EmpresasService = class EmpresasService {
    async getEmpresas() {
        const result = await database_1.sql.query(`
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
    async createEmpresa(data) {
        const { nombre_empresa, rut, direccion, telefono, email_contacto } = data;
        const result = await database_1.sql.query(`INSERT INTO public.empresa_proveedora 
       (nombre_empresa, rut, direccion, telefono, email_contacto)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`, [nombre_empresa, rut, direccion, telefono, email_contacto]);
        return result.rows[0];
    }
    async updateEmpresaEstado(empresaId, activo) {
        await database_1.sql.query("BEGIN");
        try {
            const empresaResult = await database_1.sql.query(`UPDATE public.empresa_proveedora
         SET activo = $1
         WHERE id_empresa = $2
         RETURNING *`, [activo, empresaId]);
            if (empresaResult.rows.length === 0) {
                await database_1.sql.query("ROLLBACK");
                throw new common_1.HttpException('Empresa no encontrada', common_1.HttpStatus.NOT_FOUND);
            }
            const clientesResult = await database_1.sql.query(`UPDATE public.cliente_empresa
         SET estado = $1
         WHERE id_empresa = $2
         RETURNING id_cliente`, [activo ? "activo" : "inactivo", empresaId]);
            await database_1.sql.query("COMMIT");
            return {
                empresa: empresaResult.rows[0],
                clientesActualizados: clientesResult.rows.length,
                message: `Empresa ${activo ? "activada" : "desactivada"} correctamente. ${clientesResult.rows.length} cliente(s) actualizado(s).`,
            };
        }
        catch (error) {
            await database_1.sql.query("ROLLBACK");
            throw error;
        }
    }
    async getEmpresaEjecutivas(empresaId) {
        if (!empresaId || isNaN(empresaId)) {
            throw new common_1.HttpException('ID de empresa inválido', common_1.HttpStatus.BAD_REQUEST);
        }
        const empresaResult = await database_1.sql.query(`SELECT * FROM empresa_proveedora WHERE id_empresa = $1`, [empresaId]);
        if (empresaResult.rows.length === 0) {
            throw new common_1.HttpException('Empresa no encontrada', common_1.HttpStatus.NOT_FOUND);
        }
        const ejecutivasResult = await database_1.sql.query(`SELECT 
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
       ORDER BY u.nombre`, [empresaId]);
        return {
            ...empresaResult.rows[0],
            ejecutivas: ejecutivasResult.rows || [],
        };
    }
    async addEjecutivaToEmpresa(empresaId, ejecutivaId) {
        if (!empresaId || !ejecutivaId) {
            throw new common_1.HttpException('ID de empresa o ejecutiva inválido', common_1.HttpStatus.BAD_REQUEST);
        }
        const existing = await database_1.sql.query(`SELECT * FROM empresa_ejecutiva WHERE id_empresa = $1 AND id_ejecutiva = $2`, [empresaId, ejecutivaId]);
        if (existing.rows.length > 0) {
            if (existing.rows[0].activo) {
                throw new common_1.HttpException('Esta ejecutiva ya está asignada', common_1.HttpStatus.BAD_REQUEST);
            }
            else {
                const result = await database_1.sql.query(`UPDATE empresa_ejecutiva
           SET activo = true, fecha_asignacion = NOW(), fecha_desasignacion = NULL
           WHERE id_empresa = $1 AND id_ejecutiva = $2
           RETURNING *`, [empresaId, ejecutivaId]);
                return result.rows[0];
            }
        }
        const result = await database_1.sql.query(`INSERT INTO empresa_ejecutiva (id_empresa, id_ejecutiva, fecha_asignacion, activo)
       VALUES ($1, $2, NOW(), true)
       RETURNING *`, [empresaId, ejecutivaId]);
        return result.rows[0] || {};
    }
    async removeEjecutivaFromEmpresa(empresaId, ejecutivaId) {
        if (!empresaId || !ejecutivaId) {
            throw new common_1.HttpException('ID de empresa o ejecutiva inválido', common_1.HttpStatus.BAD_REQUEST);
        }
        const client = await database_1.pool.connect();
        const result = await client.query(`UPDATE empresa_ejecutiva
       SET activo = false, fecha_desasignacion = NOW()
       WHERE id_empresa = $1 AND id_ejecutiva = $2 AND activo = true`, [empresaId, ejecutivaId]);
        client.release();
        if (result.rowCount === 0) {
            throw new common_1.HttpException('No se encontró la relación activa entre la empresa y la ejecutiva', common_1.HttpStatus.NOT_FOUND);
        }
        return { message: "Ejecutiva removida correctamente" };
    }
};
exports.EmpresasService = EmpresasService;
exports.EmpresasService = EmpresasService = __decorate([
    (0, common_1.Injectable)()
], EmpresasService);
//# sourceMappingURL=empresas.service.js.map