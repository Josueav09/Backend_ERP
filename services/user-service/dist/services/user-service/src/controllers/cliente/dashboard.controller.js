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
exports.ClienteDashboardController = void 0;
const common_1 = require("@nestjs/common");
const dashboard_service_1 = require("../../services/cliente/dashboard.service");
let ClienteDashboardController = class ClienteDashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getStats(clienteUsuarioId) {
        try {
            if (!clienteUsuarioId) {
                throw new common_1.HttpException('ID de cliente requerido', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.dashboardService.getStats(clienteUsuarioId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener estadísticas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ClienteDashboardController = ClienteDashboardController;
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Query)('clienteUsuarioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClienteDashboardController.prototype, "getStats", null);
exports.ClienteDashboardController = ClienteDashboardController = __decorate([
    (0, common_1.Controller)('cliente/dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.ClienteDashboardService])
], ClienteDashboardController);
//# sourceMappingURL=dashboard.controller.js.map