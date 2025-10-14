"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EjecutivaService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../../shared/utils/database");
let EjecutivaService = class EjecutivaService {
    async getStats(ejecutivaId) {
        try {
            const empresasResult = await database_1.sql.query(`SELECT COUNT(*) as total 
         FROM public.empresa_ejecutiva ee
         WHERE ee.id_ejecutiva = $1 AND ee.activo = true`, [ejecutivaId]);
            const clientesResult = await database_1.sql.query(`SELECT COUNT(*) as total 
         FROM public.cliente_empresa ce
         WHERE ce.id_ejecutiva = $1 AND ce.estado = 'activo'`, [ejecutivaId]);
            const actividadesResult = await database_1.sql.query(`SELECT COUNT(*) as total 
         FROM public.trazabilidad t
         WHERE t.id_ejecutiva = $1
           AND t.fecha_actividad >= DATE_TRUNC('month', CURRENT_DATE)`, [ejecutivaId]);
            return {
                totalEmpresas: Number(empresasResult.rows[0].total),
                totalClientes: Number(clientesResult.rows[0].total),
                actividadesMes: Number(actividadesResult.rows[0].total),
            };
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener estadísticas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmpresas(ejecutivaId) {
        try {
            const result = await database_1.sql.query(`
        SELECT 
          ep.*,
          COUNT(DISTINCT ce.id_cliente) as total_clientes
        FROM public.empresa_proveedora ep
        INNER JOIN public.empresa_ejecutiva ee ON ep.id_empresa = ee.id_empresa
        LEFT JOIN public.cliente_empresa ce ON ep.id_empresa = ce.id_empresa
        WHERE ee.id_ejecutiva = $1 AND ee.activo = true AND ep.activo = true
        GROUP BY ep.id_empresa
        ORDER BY ep.nombre_empresa
        `, [ejecutivaId]);
            return result.rows;
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener empresas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createEmpresa(data) {
        await database_1.sql.query("BEGIN");
        try {
            const empresaResult = await database_1.sql.query(`
        INSERT INTO public.empresa_proveedora 
          (nombre_empresa, rut, direccion, telefono, email_contacto, activo)
        VALUES ($1, $2, $3, $4, $5, true)
        RETURNING *
        `, [data.nombre_empresa, data.rut, data.direccion, data.telefono, data.email_contacto]);
            const empresa = empresaResult.rows[0];
            await database_1.sql.query(`
        INSERT INTO public.empresa_ejecutiva (id_empresa, id_ejecutiva, activo)
        VALUES ($1, $2, true)
        `, [empresa.id_empresa, data.ejecutivaId]);
            await database_1.sql.query("COMMIT");
            return empresa;
        }
        catch (error) {
            await database_1.sql.query("ROLLBACK");
            throw new common_1.HttpException('Error al crear empresa', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getClientes(ejecutivaId) {
        try {
            const result = await database_1.sql.query(`
        SELECT 
          ce.*,
          ep.nombre_empresa,
          COUNT(t.id_trazabilidad) as total_actividades
        FROM public.cliente_empresa ce
        JOIN public.empresa_proveedora ep ON ce.id_empresa = ep.id_empresa
        LEFT JOIN public.trazabilidad t ON ce.id_cliente = t.id_cliente
        WHERE ce.id_ejecutiva = $1 AND ce.estado = 'activo'
        GROUP BY ce.id_cliente, ep.nombre_empresa
        ORDER BY ce.nombre_cliente
        `, [ejecutivaId]);
            return result.rows;
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener clientes', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createCliente(data) {
        await database_1.sql.query("BEGIN");
        try {
            const empresaCheckResult = await database_1.sql.query(`
        SELECT ee.* FROM public.empresa_ejecutiva ee
        WHERE ee.id_empresa = $1 AND ee.id_ejecutiva = $2 AND ee.activo = true
        `, [data.id_empresa, data.id_ejecutiva]);
            if (empresaCheckResult.rows.length === 0) {
                throw new common_1.HttpException('Empresa no asignada a esta ejecutiva', common_1.HttpStatus.FORBIDDEN);
            }
            const nombres = data.nombre_cliente.split(' ');
            const usuarioResult = await database_1.sql.query(`
        INSERT INTO public.usuarios (nombre, apellido, email, password_hash, rol, activo)
        VALUES ($1, $2, $3, $4, 'cliente', true)
        RETURNING id_usuario
        `, [
                nombres[0],
                nombres.slice(1).join(' ') || 'Cliente',
                data.email,
                '$2a$10$rZ8qNqZ7YxEZQXW5vXqZ7eK5vXqZ7eK5vXqZ7eK5vXqZ7eK5vXqZ7',
            ]);
            const idUsuarioCliente = usuarioResult.rows[0].id_usuario;
            const clienteResult = await database_1.sql.query(`
        INSERT INTO public.cliente_empresa (
          id_empresa, id_ejecutiva, id_usuario_cliente,
          nombre_cliente, rut_cliente, direccion, telefono, email, estado
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'activo')
        RETURNING *
        `, [
                data.id_empresa,
                data.id_ejecutiva,
                idUsuarioCliente,
                data.nombre_cliente,
                data.rut_cliente,
                data.direccion,
                data.telefono,
                data.email,
            ]);
            await database_1.sql.query("COMMIT");
            return clienteResult.rows[0];
        }
        catch (error) {
            await database_1.sql.query("ROLLBACK");
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al crear cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.EjecutivaService = EjecutivaService;
exports.EjecutivaService = EjecutivaService = __decorate([
    (0, common_1.Injectable)()
], EjecutivaService);
//# sourceMappingURL=ejecutiva.service.js.map