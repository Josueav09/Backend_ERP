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
exports.EmpresaDashboardController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../../../shared/guards/jwt-auth.guard");
const dashboard_service_1 = require("../../services/cliente/dashboard.service");
let EmpresaDashboardController = class EmpresaDashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getStats(clienteUsuarioId, req) {
        try {
            console.log('📊 [EmpresaDashboardController] === OBTENER STATS ===');
            const empresaId = this.getEmpresaId(req, clienteUsuarioId);
            console.log('📊 [EmpresaDashboardController] Empresa ID:', empresaId);
            const stats = await this.dashboardService.getStats(empresaId);
            console.log('✅ [EmpresaDashboardController] Stats obtenidas exitosamente');
            return stats;
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardController] Error en getStats:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener estadísticas del dashboard', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getTrazabilidad(clienteUsuarioId, req) {
        try {
            console.log('📋 [EmpresaDashboardController] === OBTENER TRAZABILIDAD ===');
            const empresaId = this.getEmpresaId(req, clienteUsuarioId);
            const trazabilidad = await this.dashboardService.getTrazabilidad(empresaId);
            console.log(`✅ [EmpresaDashboardController] ${trazabilidad.length} actividades obtenidas`);
            return trazabilidad;
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardController] Error en getTrazabilidad:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener trazabilidad', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEjecutivaInfo(clienteUsuarioId, req) {
        try {
            console.log('👩‍💼 [EmpresaDashboardController] === OBTENER INFO EJECUTIVA ===');
            const empresaId = this.getEmpresaId(req, clienteUsuarioId);
            const ejecutivaInfo = await this.dashboardService.getEjecutivaInfo(empresaId);
            console.log('✅ [EmpresaDashboardController] Información de ejecutiva obtenida');
            return ejecutivaInfo;
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardController] Error en getEjecutivaInfo:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener información de la ejecutiva', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getActividades(clienteUsuarioId, req) {
        try {
            console.log('📝 [EmpresaDashboardController] === OBTENER ACTIVIDADES ===');
            const empresaId = this.getEmpresaId(req, clienteUsuarioId);
            const actividades = await this.dashboardService.getTrazabilidad(empresaId);
            console.log(`✅ [EmpresaDashboardController] ${actividades.length} actividades obtenidas`);
            return actividades;
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardController] Error en getActividades:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener actividades', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    getEmpresaId(req, clienteUsuarioId) {
        if (req.user && req.user.id_empresa_prov) {
            const empresaId = req.user.id_empresa_prov;
            console.log('🔐 [EmpresaDashboardController] Usando empresaId del JWT:', empresaId);
            return empresaId;
        }
        else if (clienteUsuarioId) {
            const empresaId = parseInt(clienteUsuarioId);
            console.log('🔐 [EmpresaDashboardController] Usando empresaId del query:', empresaId);
            return empresaId;
        }
        else {
            console.error('❌ [EmpresaDashboardController] No se pudo obtener empresaId');
            throw new common_1.HttpException('Empresa no identificada', common_1.HttpStatus.UNAUTHORIZED);
        }
    }
};
exports.EmpresaDashboardController = EmpresaDashboardController;
__decorate([
    (0, common_1.Get)('dashboard/stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('clienteUsuarioId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmpresaDashboardController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('trazabilidad'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('clienteUsuarioId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmpresaDashboardController.prototype, "getTrazabilidad", null);
__decorate([
    (0, common_1.Get)('ejecutiva'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('clienteUsuarioId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmpresaDashboardController.prototype, "getEjecutivaInfo", null);
__decorate([
    (0, common_1.Get)('actividades'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('clienteUsuarioId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmpresaDashboardController.prototype, "getActividades", null);
exports.EmpresaDashboardController = EmpresaDashboardController = __decorate([
    (0, common_1.Controller)('empresa'),
    __metadata("design:paramtypes", [dashboard_service_1.EmpresaDashboardService])
], EmpresaDashboardController);
//# sourceMappingURL=dashboard.controller.js.map