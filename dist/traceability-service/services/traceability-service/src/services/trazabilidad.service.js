"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrazabilidadService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../shared/utils/database");
let TrazabilidadService = class TrazabilidadService {
    async getTrazabilidad(empresaId, ejecutivaId, clienteId) {
        let query = `
      SELECT 
        t.*,
        u.nombre || ' ' || u.apellido as ejecutiva_nombre,
        u.activo as ejecutiva_activa,
        ep.nombre_empresa,
        ce.nombre_cliente
      FROM public.trazabilidad t
      JOIN public.usuarios u ON t.id_ejecutiva = u.id_usuario
      JOIN public.empresa_proveedora ep ON t.id_empresa = ep.id_empresa
      LEFT JOIN public.cliente_empresa ce ON t.id_cliente = ce.id_cliente
      WHERE 1=1
    `;
        const params = [];
        let idx = 1;
        if (empresaId) {
            query += ` AND t.id_empresa = $${idx}`;
            params.push(empresaId);
            idx++;
        }
        if (ejecutivaId) {
            query += ` AND t.id_ejecutiva = $${idx}`;
            params.push(ejecutivaId);
            idx++;
        }
        if (clienteId) {
            query += ` AND t.id_cliente = $${idx}`;
            params.push(clienteId);
            idx++;
        }
        query += ` ORDER BY t.fecha_actividad DESC`;
        const result = await database_1.sql.query(query, params);
        return result.rows;
    }
};
exports.TrazabilidadService = TrazabilidadService;
exports.TrazabilidadService = TrazabilidadService = __decorate([
    (0, common_1.Injectable)()
], TrazabilidadService);
//# sourceMappingURL=trazabilidad.service.js.map