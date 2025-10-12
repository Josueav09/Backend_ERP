"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../shared/utils/database");
let AuditService = class AuditService {
    async getAuditoriaContratos() {
        const result = await database_1.sql.query(`
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
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)()
], AuditService);
//# sourceMappingURL=audit.service.js.map