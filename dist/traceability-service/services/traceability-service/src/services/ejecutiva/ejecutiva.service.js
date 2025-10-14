"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EjecutivaTraceabilityService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../../shared/utils/database");
let EjecutivaTraceabilityService = class EjecutivaTraceabilityService {
    async getTrazabilidad(ejecutivaId) {
        try {
            const result = await database_1.sql.query(`
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
        `, [ejecutivaId]);
            return result.rows;
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener trazabilidad', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createTrazabilidad(data) {
        await database_1.sql.query("BEGIN");
        try {
            const empresaCheckResult = await database_1.sql.query(`
        SELECT ee.* FROM public.empresa_ejecutiva ee
        WHERE ee.id_empresa = $1 AND ee.id_ejecutiva = $2 AND ee.activo = true
        `, [data.id_empresa, data.id_ejecutiva]);
            if (empresaCheckResult.rows.length === 0) {
                throw new common_1.HttpException('Empresa no asignada a esta ejecutiva', common_1.HttpStatus.FORBIDDEN);
            }
            const result = await database_1.sql.query(`
        INSERT INTO public.trazabilidad (
          id_ejecutiva, id_empresa, id_cliente, tipo_actividad, 
          descripcion, estado, notas, fecha_actividad
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING *
        `, [
                data.id_ejecutiva,
                data.id_empresa,
                data.id_cliente || null,
                data.tipo_actividad,
                data.descripcion,
                data.estado || 'en_proceso',
                data.notas || null,
            ]);
            await database_1.sql.query("COMMIT");
            return result.rows[0];
        }
        catch (error) {
            await database_1.sql.query("ROLLBACK");
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al crear trazabilidad', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.EjecutivaTraceabilityService = EjecutivaTraceabilityService;
exports.EjecutivaTraceabilityService = EjecutivaTraceabilityService = __decorate([
    (0, common_1.Injectable)()
], EjecutivaTraceabilityService);
//# sourceMappingURL=ejecutiva.service.js.map