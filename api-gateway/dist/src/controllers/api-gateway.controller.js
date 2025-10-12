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
exports.ApiGatewayController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let ApiGatewayController = class ApiGatewayController {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async getCaptcha() {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('http://localhost:3001/auth/captcha'));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener captcha', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async login(body) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:3001/auth/login', body));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException('Error en login', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async verifyEmail(body) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:3001/auth/verify-email', body));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException('Error en verificación', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPerfil() {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('http://localhost:3002/jefe/perfil'));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener perfil', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updatePerfil(body) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.put('http://localhost:3002/jefe/perfil', body));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException('Error al actualizar perfil', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updatePassword(body) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.put('http://localhost:3002/jefe/password', body));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException('Error al cambiar contraseña', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefeStats() {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('http://localhost:3002/jefe/stats'));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener estadísticas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAuditoria() {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('http://localhost:3007/audit/contratos'));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener auditoría', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getClientes() {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('http://localhost:3003/clientes'));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener clientes', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEjecutivas() {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('http://localhost:3002/ejecutivas'));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener ejecutivas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmpresas() {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('http://localhost:3002/empresas'));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener empresas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getTrazabilidad() {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('http://localhost:3007/trazabilidad'));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener trazabilidad', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ApiGatewayController = ApiGatewayController;
__decorate([
    (0, common_1.Get)('auth/captcha'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getCaptcha", null);
__decorate([
    (0, common_1.Post)('auth/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('auth/verify-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Get)('jefe/perfil'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getPerfil", null);
__decorate([
    (0, common_1.Put)('jefe/perfil'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "updatePerfil", null);
__decorate([
    (0, common_1.Put)('jefe/password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Get)('jefe/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeStats", null);
__decorate([
    (0, common_1.Get)('jefe/auditoria'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getAuditoria", null);
__decorate([
    (0, common_1.Get)('jefe/clientes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getClientes", null);
__decorate([
    (0, common_1.Get)('jefe/ejecutivas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEjecutivas", null);
__decorate([
    (0, common_1.Get)('jefe/empresas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEmpresas", null);
__decorate([
    (0, common_1.Get)('jefe/trazabilidad'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getTrazabilidad", null);
exports.ApiGatewayController = ApiGatewayController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], ApiGatewayController);
//# sourceMappingURL=api-gateway.controller.js.map