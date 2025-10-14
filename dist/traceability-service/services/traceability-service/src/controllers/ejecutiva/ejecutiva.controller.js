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
exports.EjecutivaTraceabilityController = void 0;
const common_1 = require("@nestjs/common");
const ejecutiva_service_1 = require("../../services/ejecutiva/ejecutiva.service");
let EjecutivaTraceabilityController = class EjecutivaTraceabilityController {
    constructor(ejecutivaTraceabilityService) {
        this.ejecutivaTraceabilityService = ejecutivaTraceabilityService;
    }
    async getTrazabilidad(ejecutivaId) {
        if (!ejecutivaId) {
            throw new common_1.HttpException('ID de ejecutiva requerido', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.ejecutivaTraceabilityService.getTrazabilidad(ejecutivaId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener trazabilidad', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createTrazabilidad(body) {
        const { id_ejecutiva, id_empresa, id_cliente, tipo_actividad, descripcion, estado, notas } = body;
        if (!id_ejecutiva || !id_empresa) {
            throw new common_1.HttpException('Ejecutiva y empresa requeridos', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.ejecutivaTraceabilityService.createTrazabilidad({
                id_ejecutiva,
                id_empresa,
                id_cliente,
                tipo_actividad,
                descripcion,
                estado,
                notas,
            });
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al crear trazabilidad', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.EjecutivaTraceabilityController = EjecutivaTraceabilityController;
__decorate([
    (0, common_1.Get)('trazabilidad'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EjecutivaTraceabilityController.prototype, "getTrazabilidad", null);
__decorate([
    (0, common_1.Post)('trazabilidad'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EjecutivaTraceabilityController.prototype, "createTrazabilidad", null);
exports.EjecutivaTraceabilityController = EjecutivaTraceabilityController = __decorate([
    (0, common_1.Controller)('ejecutiva'),
    __metadata("design:paramtypes", [ejecutiva_service_1.EjecutivaTraceabilityService])
], EjecutivaTraceabilityController);
//# sourceMappingURL=ejecutiva.controller.js.map