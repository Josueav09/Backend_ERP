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
exports.ClientesController = void 0;
const common_1 = require("@nestjs/common");
const clientes_service_1 = require("../../services/jefe/clientes.service");
const jwt_auth_guard_1 = require("../../../../../shared/guards/jwt-auth.guard");
let ClientesController = class ClientesController {
    constructor(clientesService) {
        this.clientesService = clientesService;
    }
    async findAll(req) {
        console.log('🚀 [ClientesController] === FINDALL INICIADO ===');
        console.log('📍 Ruta: /jefe/clientes');
        console.log('👤 Usuario:', req.user);
        try {
            console.log('🔄 Llamando a clientesService.findAll()...');
            const clientes = await this.clientesService.findAll();
            console.log(`✅ [ClientesController] ${clientes.length} clientes encontrados`);
            return clientes;
        }
        catch (error) {
            console.error('❌ [ClientesController] Error en findAll:', error);
            throw new common_1.HttpException('Error al obtener clientes', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        console.log('🔍 [ClientesController] GET /jefe/clientes/:id -', id);
        try {
            return await this.clientesService.findOne(parseInt(id));
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            console.error('❌ [ClientesController] Error en findOne:', error);
            throw new common_1.HttpException('Error al obtener cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(body) {
        console.log('➕ [ClientesController] POST /jefe/clientes -', body.razon_social);
        try {
            return await this.clientesService.create(body);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            console.error('❌ [ClientesController] Error en create:', error);
            throw new common_1.HttpException(error.message || 'Error al crear cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, body) {
        console.log('📝 [ClientesController] PUT /jefe/clientes/:id -', id);
        try {
            return await this.clientesService.update(parseInt(id), body);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            console.error('❌ [ClientesController] Error en update:', error);
            throw new common_1.HttpException('Error al actualizar cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async activate(id) {
        console.log('🔄 [ClientesController] PATCH /clientes/:id/activate -', id);
        try {
            return await this.clientesService.activate(parseInt(id));
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            console.error('❌ [ClientesController] Error en activate:', error);
            throw new common_1.HttpException('Error al activar cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deactivate(id) {
        console.log('🔄 [ClientesController] PATCH /clientes/:id/deactivate -', id);
        try {
            return await this.clientesService.deactivate(parseInt(id));
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            console.error('❌ [ClientesController] Error en deactivate:', error);
            throw new common_1.HttpException('Error al desactivar cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ClientesController = ClientesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "activate", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "deactivate", null);
exports.ClientesController = ClientesController = __decorate([
    (0, common_1.Controller)('clientes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [clientes_service_1.ClientesService])
], ClientesController);
//# sourceMappingURL=clienteFinal.controller.js.map