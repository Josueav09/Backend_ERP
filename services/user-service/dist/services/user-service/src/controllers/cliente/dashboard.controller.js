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
    async getEjecutivaInfo(clienteUsuarioId) {
        try {
            if (!clienteUsuarioId) {
                throw new common_1.HttpException('clienteUsuarioId es requerido', common_1.HttpStatus.BAD_REQUEST);
            }
            const empresaId = parseInt(clienteUsuarioId);
            if (isNaN(empresaId)) {
                throw new common_1.HttpException('clienteUsuarioId debe ser un número válido', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.dashboardService.getEjecutivaInfoCompleta(empresaId);
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardController] Error en getEjecutivaInfo:', error);
            throw new common_1.HttpException('Error al obtener información de ejecutiva', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getClientesRecientes(clienteUsuarioId) {
        try {
            if (!clienteUsuarioId) {
                throw new common_1.HttpException('clienteUsuarioId es requerido', common_1.HttpStatus.BAD_REQUEST);
            }
            const empresaId = parseInt(clienteUsuarioId);
            if (isNaN(empresaId)) {
                throw new common_1.HttpException('clienteUsuarioId debe ser un número válido', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.dashboardService.getClientesRecientes(empresaId);
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardController] Error en getClientesRecientes:', error);
            throw new common_1.HttpException('Error al obtener clientes recientes', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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
    async getEjecutivasByEmpresa(empresaId, req) {
        try {
            console.log('👥 [EmpresaEquipoController] === OBTENER EJECUTIVAS ===');
            const idEmpresa = this.getEmpresaId(req, empresaId);
            const ejecutivas = await this.dashboardService.getEjecutivasByEmpresa(idEmpresa);
            console.log(`✅ [EmpresaEquipoController] ${ejecutivas.length} ejecutivas obtenidas`);
            return ejecutivas;
        }
        catch (error) {
            console.error('❌ [EmpresaEquipoController] Error en getEjecutivasByEmpresa:', error);
            throw new common_1.HttpException('Error al obtener ejecutivas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEquipoStats(empresaId, req) {
        try {
            console.log('📊 [EmpresaEquipoController] === OBTENER STATS DE EQUIPO ===');
            const idEmpresa = this.getEmpresaId(req, empresaId);
            const stats = await this.dashboardService.getEquipoStats(idEmpresa);
            console.log('✅ [EmpresaEquipoController] Stats de equipo obtenidas');
            return stats;
        }
        catch (error) {
            console.error('❌ [EmpresaEquipoController] Error en getEquipoStats:', error);
            throw new common_1.HttpException('Error al obtener estadísticas del equipo', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEjecutivaEmbudo(ejecutivaId, empresaId, req) {
        try {
            console.log('🎯 [EmpresaEquipoController] === OBTENER EMBUDO EJECUTIVA ===');
            const idEmpresa = this.getEmpresaId(req, empresaId);
            const idEjecutiva = parseInt(ejecutivaId);
            if (isNaN(idEjecutiva)) {
                throw new common_1.HttpException('ID de ejecutiva inválido', common_1.HttpStatus.BAD_REQUEST);
            }
            const embudo = await this.dashboardService.getEmbudoVentasEjecutiva(idEjecutiva, idEmpresa);
            console.log('✅ [EmpresaEquipoController] Embudo de ejecutiva obtenido');
            return embudo;
        }
        catch (error) {
            console.error('❌ [EmpresaEquipoController] Error en getEjecutivaEmbudo:', error);
            throw new common_1.HttpException('Error al obtener embudo de ejecutiva', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEjecutivaEstadisticas(ejecutivaId, empresaId, req) {
        try {
            console.log('📈 [EmpresaEquipoController] === OBTENER ESTADÍSTICAS EJECUTIVA ===');
            const idEmpresa = this.getEmpresaId(req, empresaId);
            const idEjecutiva = parseInt(ejecutivaId);
            if (isNaN(idEjecutiva)) {
                throw new common_1.HttpException('ID de ejecutiva inválido', common_1.HttpStatus.BAD_REQUEST);
            }
            const estadisticas = await this.dashboardService.getEstadisticasEjecutivaCompleta(idEjecutiva, idEmpresa);
            console.log('✅ [EmpresaEquipoController] Estadísticas de ejecutiva obtenidas');
            return estadisticas;
        }
        catch (error) {
            console.error('❌ [EmpresaEquipoController] Error en getEjecutivaEstadisticas:', error);
            throw new common_1.HttpException('Error al obtener estadísticas de ejecutiva', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmpresaEjecutivaClientes(ejecutivaId, empresaId, req) {
        try {
            console.log('👥 [EmpresaEquipoController] === OBTENER CLIENTES EJECUTIVA ===');
            const idEmpresa = this.getEmpresaId(req, empresaId);
            const idEjecutiva = parseInt(ejecutivaId);
            if (isNaN(idEjecutiva)) {
                throw new common_1.HttpException('ID de ejecutiva inválido', common_1.HttpStatus.BAD_REQUEST);
            }
            const clientes = await this.dashboardService.getClientesPorEjecutiva(idEjecutiva, idEmpresa);
            console.log(`✅ [EmpresaEquipoController] ${clientes.length} clientes de ejecutiva obtenidos`);
            return clientes;
        }
        catch (error) {
            console.error('❌ [EmpresaEquipoController] Error en getEjecutivaClientes:', error);
            throw new common_1.HttpException('Error al obtener clientes de ejecutiva', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresaDashboardController.prototype, "getEjecutivaInfo", null);
__decorate([
    (0, common_1.Get)('clientes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('clienteUsuarioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresaDashboardController.prototype, "getClientesRecientes", null);
__decorate([
    (0, common_1.Get)('actividades'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('clienteUsuarioId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmpresaDashboardController.prototype, "getActividades", null);
__decorate([
    (0, common_1.Get)('ejecutivas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('empresaId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmpresaDashboardController.prototype, "getEjecutivasByEmpresa", null);
__decorate([
    (0, common_1.Get)('equipo/stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('empresaId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmpresaDashboardController.prototype, "getEquipoStats", null);
__decorate([
    (0, common_1.Get)('ejecutiva/:id/embudo'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('empresaId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], EmpresaDashboardController.prototype, "getEjecutivaEmbudo", null);
__decorate([
    (0, common_1.Get)('ejecutiva/:id/estadisticas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('empresaId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], EmpresaDashboardController.prototype, "getEjecutivaEstadisticas", null);
__decorate([
    (0, common_1.Get)('ejecutiva/:id/clientes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('empresaId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], EmpresaDashboardController.prototype, "getEmpresaEjecutivaClientes", null);
exports.EmpresaDashboardController = EmpresaDashboardController = __decorate([
    (0, common_1.Controller)('empresa'),
    __metadata("design:paramtypes", [dashboard_service_1.EmpresaDashboardService])
], EmpresaDashboardController);
//# sourceMappingURL=dashboard.controller.js.map