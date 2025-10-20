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
exports.JefeController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const jefe_service_1 = require("../../services/jefe/jefe.service");
const jwt_auth_guard_1 = require("../../../../../shared/guards/jwt-auth.guard");
let JefeController = class JefeController {
    constructor(jefeService) {
        this.jefeService = jefeService;
    }
    async getPerfil(req) {
        console.log('🔐 Headers:', req.headers);
        console.log('🔐 Authorization:', req.headers.authorization);
        console.log('🔐 User completo:', req.user);
        const userId = req.user.id_jefe;
        console.log('🔐 [JefeController] User ID:', userId);
        return await this.jefeService.getPerfil(userId);
    }
    async updatePerfil(req, body) {
        try {
            const userId = req.user.id_jefe;
            return await this.jefeService.updatePerfil(userId, body);
        }
        catch (error) {
            throw new common_1.HttpException('Error al actualizar perfil', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updatePassword(req, body) {
        try {
            const userId = req.user.id_jefe;
            const { password_actual, password_nueva } = body;
            return await this.jefeService.updatePassword(userId, password_actual, password_nueva);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al actualizar contraseña', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getStats(req) {
        console.log('🔐 [JefeController] Headers:', req.headers);
        console.log('🔐 [JefeController] User:', req.user);
        console.log('🔐 [JefeController] Authorization:', req.headers.authorization);
        console.log('🔐 User para stats:', req.user);
        try {
            return await this.jefeService.getStats();
        }
        catch (error) {
            const e = error;
            throw new common_1.HttpException('Error al obtener estadísticas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.JefeController = JefeController;
__decorate([
    (0, common_1.Get)('perfil'),
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JefeController.prototype, "getPerfil", null);
__decorate([
    (0, common_1.Put)('perfil'),
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], JefeController.prototype, "updatePerfil", null);
__decorate([
    (0, common_1.Put)('password'),
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], JefeController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JefeController.prototype, "getStats", null);
exports.JefeController = JefeController = __decorate([
    (0, common_1.Controller)('jefe'),
    __metadata("design:paramtypes", [jefe_service_1.JefeService])
], JefeController);
//# sourceMappingURL=jefe.controller.js.map