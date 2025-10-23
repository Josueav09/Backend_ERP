"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditController = void 0;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("../../services/jefe/audit.service");
const jwt_auth_guard_1 = require("../../../../../shared/guards/jwt-auth.guard");
let AuditController = class AuditController {
    constructor(auditService) {
        this.auditService = auditService;
    }
    async getAuditoriaContratos(req, fechaInicio, fechaFin, accion, usuario) {
        try {
            console.log('👤 Usuario autenticado:', req.user);
            if (req.user.userType !== 'jefe') {
                throw new common_1.HttpException('No autorizado para ver auditoría', common_1.HttpStatus.FORBIDDEN);
            }
            const filters = { fechaInicio, fechaFin, accion, usuario };
            return await this.auditService.getAuditoriaContratos(filters);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener auditoría', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEstadisticasAuditoria(req) {
        try {
            console.log('👤 Usuario autenticado:', req.user);
            if (req.user.userType !== 'jefe') {
                throw new common_1.HttpException('No autorizado para ver estadísticas de auditoría', common_1.HttpStatus.FORBIDDEN);
            }
            return await this.auditService.getEstadisticasAuditoria();
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener estadísticas de auditoría', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAuditoriaResumenMensual(req) {
        try {
            console.log('👤 Usuario autenticado:', req.user);
            if (req.user.userType !== 'jefe') {
                throw new common_1.HttpException('No autorizado para ver resumen mensual', common_1.HttpStatus.FORBIDDEN);
            }
            return await this.auditService.getAuditoriaResumenMensual();
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener resumen mensual', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AuditController = AuditController;
__decorate([
    (0, common_1.Get)('contratos'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('fechaInicio')),
    __param(2, (0, common_1.Query)('fechaFin')),
    __param(3, (0, common_1.Query)('accion')),
    __param(4, (0, common_1.Query)('usuario')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getAuditoriaContratos", null);
__decorate([
    (0, common_1.Get)('estadisticas'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getEstadisticasAuditoria", null);
__decorate([
    (0, common_1.Get)('resumen-mensual'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getAuditoriaResumenMensual", null);
exports.AuditController = AuditController = __decorate([
    (0, common_1.Controller)('auditoria'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditController);
//# sourceMappingURL=audit.controller.js.map