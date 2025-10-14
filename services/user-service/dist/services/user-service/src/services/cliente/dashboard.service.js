"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteDashboardService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../../shared/utils/database");
let ClienteDashboardService = class ClienteDashboardService {
    async getStats(clienteUsuarioId) {
        try {
            const clienteResult = await database_1.sql.query(`
        SELECT 
          ce.*,
          ep.nombre_empresa,
          u.nombre || ' ' || u.apellido as ejecutiva_nombre,
          u.email as ejecutiva_email
        FROM public.cliente_empresa ce
        JOIN public.empresa_proveedora ep ON ce.id_empresa = ep.id_empresa
        LEFT JOIN public.usuarios u ON ce.id_ejecutiva = u.id_usuario
        WHERE ce.id_usuario_cliente = $1
        LIMIT 1
        `, [clienteUsuarioId]);
            if (clienteResult.rows.length === 0) {
                return {
                    cliente: {
                        nombre_cliente: "Cliente no encontrado",
                        nombre_empresa: "Sin empresa asignada",
                        ejecutiva_nombre: "Sin ejecutiva asignada",
                        ejecutiva_email: ""
                    },
                    totalActividades: 0,
                    completadas: 0,
                    enProceso: 0,
                    rendimiento: 0
                };
            }
            const cliente = clienteResult.rows[0];
            const actividadesResult = await database_1.sql.query(`SELECT COUNT(*) as total FROM public.trazabilidad t WHERE t.id_cliente = $1`, [cliente.id_cliente]);
            const completadasResult = await database_1.sql.query(`SELECT COUNT(*) as total FROM public.trazabilidad t WHERE t.id_cliente = $1 AND t.estado = 'completado'`, [cliente.id_cliente]);
            const enProcesoResult = await database_1.sql.query(`SELECT COUNT(*) as total FROM public.trazabilidad t WHERE t.id_cliente = $1 AND t.estado = 'en_proceso'`, [cliente.id_cliente]);
            const totalActividades = Number(actividadesResult.rows[0]?.total || 0);
            const completadas = Number(completadasResult.rows[0]?.total || 0);
            const enProceso = Number(enProcesoResult.rows[0]?.total || 0);
            return {
                cliente,
                totalActividades,
                completadas,
                enProceso,
                rendimiento: totalActividades > 0 ? Math.round((completadas / totalActividades) * 100) : 0,
            };
        }
        catch (error) {
            console.error('[v0] Error fetching cliente stats:', error);
            throw new common_1.HttpException('Error al obtener estadísticas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ClienteDashboardService = ClienteDashboardService;
exports.ClienteDashboardService = ClienteDashboardService = __decorate([
    (0, common_1.Injectable)()
], ClienteDashboardService);
//# sourceMappingURL=dashboard.service.js.map