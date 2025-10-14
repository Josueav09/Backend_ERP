"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteTrazabilidadService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../../shared/utils/database");
let ClienteTrazabilidadService = class ClienteTrazabilidadService {
    async getTrazabilidadByCliente(clienteUsuarioId) {
        try {
            const clienteInfoResult = await database_1.sql.query(`SELECT id_cliente FROM public.cliente_empresa WHERE id_usuario_cliente = $1 LIMIT 1`, [clienteUsuarioId]);
            if (clienteInfoResult.rows.length === 0) {
                return [];
            }
            const clienteId = clienteInfoResult.rows[0].id_cliente;
            const trazabilidadResult = await database_1.sql.query(`
        SELECT 
          t.*,
          u.nombre || ' ' || u.apellido as ejecutiva_nombre,
          ep.nombre_empresa
        FROM public.trazabilidad t
        JOIN public.usuarios u ON t.id_ejecutiva = u.id_usuario
        JOIN public.empresa_proveedora ep ON t.id_empresa = ep.id_empresa
        WHERE t.id_cliente = $1
        ORDER BY t.fecha_actividad DESC
        `, [clienteId]);
            return trazabilidadResult.rows;
        }
        catch (error) {
            console.error('[v0] Error fetching trazabilidad:', error);
            throw new common_1.HttpException('Error al obtener trazabilidad', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ClienteTrazabilidadService = ClienteTrazabilidadService;
exports.ClienteTrazabilidadService = ClienteTrazabilidadService = __decorate([
    (0, common_1.Injectable)()
], ClienteTrazabilidadService);
//# sourceMappingURL=traceability.service.js.map