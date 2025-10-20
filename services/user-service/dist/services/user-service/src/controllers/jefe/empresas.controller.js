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
exports.EmpresasController = void 0;
const common_1 = require("@nestjs/common");
const empresas_service_1 = require("../../services/jefe/empresas.service");
let EmpresasController = class EmpresasController {
    constructor(empresasService) {
        this.empresasService = empresasService;
    }
    async getEmpresas() {
        try {
            return await this.empresasService.getEmpresas();
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener empresas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createEmpresa(body) {
        try {
            return await this.empresasService.createEmpresa(body);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al crear empresa', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateEmpresaEstado(id, body) {
        try {
            const { activo } = body;
            if (typeof activo !== 'boolean') {
                throw new common_1.HttpException('El campo activo debe ser un booleano', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.empresasService.updateEmpresaEstado(parseInt(id), activo);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al actualizar estado de empresa', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateEmpresa(id, data) {
        return this.empresasService.updateEmpresa(Number.parseInt(id), data);
    }
    async getEmpresaEjecutivas(id) {
        try {
            return await this.empresasService.getEmpresaEjecutivas(parseInt(id));
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener ejecutivas de la empresa', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addEjecutivaToEmpresa(id, body) {
        try {
            const { id_ejecutiva } = body;
            if (!id_ejecutiva) {
                throw new common_1.HttpException('ID de ejecutiva es requerido', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.empresasService.addEjecutivaToEmpresa(parseInt(id), parseInt(id_ejecutiva));
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al agregar ejecutiva', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async removeEjecutivaFromEmpresa(id, ejecutivaId) {
        try {
            return await this.empresasService.removeEjecutivaFromEmpresa(parseInt(id), parseInt(ejecutivaId));
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al remover ejecutiva', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.EmpresasController = EmpresasController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmpresasController.prototype, "getEmpresas", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmpresasController.prototype, "createEmpresa", null);
__decorate([
    (0, common_1.Patch)(':id/estado'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmpresasController.prototype, "updateEmpresaEstado", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmpresasController.prototype, "updateEmpresa", null);
__decorate([
    (0, common_1.Get)(':id/ejecutivas'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresasController.prototype, "getEmpresaEjecutivas", null);
__decorate([
    (0, common_1.Post)(':id/ejecutivas'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmpresasController.prototype, "addEjecutivaToEmpresa", null);
__decorate([
    (0, common_1.Post)(':id/ejecutivas/:ejecutivaId/remove'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('ejecutivaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmpresasController.prototype, "removeEjecutivaFromEmpresa", null);
exports.EmpresasController = EmpresasController = __decorate([
    (0, common_1.Controller)('empresas'),
    __metadata("design:paramtypes", [empresas_service_1.EmpresasService])
], EmpresasController);
//# sourceMappingURL=empresas.controller.js.map