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
exports.EjecutivaController = void 0;
const common_1 = require("@nestjs/common");
const ejecutiva_service_1 = require("../../services/ejecutiva/ejecutiva.service");
let EjecutivaController = class EjecutivaController {
    constructor(ejecutivaService) {
        this.ejecutivaService = ejecutivaService;
    }
    async getStats(ejecutivaId) {
        if (!ejecutivaId) {
            throw new common_1.HttpException('ID de ejecutiva requerido', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.ejecutivaService.getStats(ejecutivaId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener estadísticas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmpresas(ejecutivaId) {
        if (!ejecutivaId) {
            throw new common_1.HttpException('ID de ejecutiva requerido', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.ejecutivaService.getEmpresas(ejecutivaId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener empresas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createEmpresa(body) {
        const { nombre_empresa, rut, direccion, telefono, email_contacto, ejecutivaId } = body;
        if (!ejecutivaId) {
            throw new common_1.HttpException('ID de ejecutiva requerido', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.ejecutivaService.createEmpresa({
                nombre_empresa,
                rut,
                direccion,
                telefono,
                email_contacto,
                ejecutivaId
            });
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al crear empresa', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getClientes(ejecutivaId) {
        if (!ejecutivaId) {
            throw new common_1.HttpException('ID de ejecutiva requerido', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.ejecutivaService.getClientes(ejecutivaId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener clientes', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createCliente(body) {
        const { id_empresa, id_ejecutiva, nombre_cliente, rut_cliente, direccion, telefono, email } = body;
        if (!id_empresa || !id_ejecutiva) {
            throw new common_1.HttpException('Empresa y ejecutiva requeridos', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.ejecutivaService.createCliente({
                id_empresa,
                id_ejecutiva,
                nombre_cliente,
                rut_cliente,
                direccion,
                telefono,
                email
            });
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al crear cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.EjecutivaController = EjecutivaController;
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EjecutivaController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('empresas'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EjecutivaController.prototype, "getEmpresas", null);
__decorate([
    (0, common_1.Post)('empresas'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EjecutivaController.prototype, "createEmpresa", null);
__decorate([
    (0, common_1.Get)('clientes'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EjecutivaController.prototype, "getClientes", null);
__decorate([
    (0, common_1.Post)('clientes'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EjecutivaController.prototype, "createCliente", null);
exports.EjecutivaController = EjecutivaController = __decorate([
    (0, common_1.Controller)('ejecutiva'),
    __metadata("design:paramtypes", [ejecutiva_service_1.EjecutivaService])
], EjecutivaController);
//# sourceMappingURL=ejecutiva.controller.js.map