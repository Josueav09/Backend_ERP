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
let ClientesController = class ClientesController {
    constructor(clientesService) {
        this.clientesService = clientesService;
    }
    async getClientes() {
        try {
            return await this.clientesService.getClientes();
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener clientes', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCliente(id) {
        try {
            const result = await this.clientesService.getClienteById(parseInt(id));
            if (!result) {
                throw new common_1.HttpException('Cliente no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            return result;
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createCliente(body) {
        try {
            const { razon_social, id_ejecutiva } = body;
            if (!razon_social) {
                throw new common_1.HttpException('Razón social es requerida', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.clientesService.create(body);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al crear cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateCliente(id, body) {
        try {
            const result = await this.clientesService.updateCliente(parseInt(id), body);
            if (!result) {
                throw new common_1.HttpException('Cliente no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            return result;
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al actualizar cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ClientesController = ClientesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "getClientes", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "getCliente", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "createCliente", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "updateCliente", null);
exports.ClientesController = ClientesController = __decorate([
    (0, common_1.Controller)('clientes'),
    __metadata("design:paramtypes", [clientes_service_1.ClientesService])
], ClientesController);
//# sourceMappingURL=clientes.controller.js.map