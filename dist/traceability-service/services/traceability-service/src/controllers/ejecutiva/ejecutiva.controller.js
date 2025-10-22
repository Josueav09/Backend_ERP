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
        const { id_ejecutiva, id_empresa_prov, id_cliente_final, id_contacto, tipo_contacto, fecha_contacto, resultado_contacto } = body;
        if (!id_ejecutiva || !id_empresa_prov || !id_cliente_final || !id_contacto) {
            throw new common_1.HttpException('Ejecutiva, empresa, cliente y contacto requeridos', common_1.HttpStatus.BAD_REQUEST);
        }
        const tiposValidos = ['Llamada telefónica', 'Chat de Whatsapp', 'Correo electrónico', 'Contacto por linkedin', 'Reunión presencial', 'Otro'];
        if (!tiposValidos.includes(tipo_contacto)) {
            throw new common_1.HttpException('Tipo de contacto no válido', common_1.HttpStatus.BAD_REQUEST);
        }
        const resultadosValidos = ['Positivo', 'Negativo', 'Pendiente', 'Neutro'];
        if (!resultadosValidos.includes(resultado_contacto)) {
            throw new common_1.HttpException('Resultado de contacto no válido', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.ejecutivaTraceabilityService.createTrazabilidad({
                id_ejecutiva,
                id_empresa_prov,
                id_cliente_final,
                id_contacto,
                tipo_contacto,
                fecha_contacto: fecha_contacto ? new Date(fecha_contacto) : new Date(),
                resultado_contacto,
                informacion_importante: body.informacion_importante,
                reunion_agendada: body.reunion_agendada,
                fecha_reunion: body.fecha_reunion ? new Date(body.fecha_reunion) : undefined,
                participantes: body.participantes,
                se_dio_reunion: body.se_dio_reunion,
                resultados_reunion: body.resultados_reunion,
                pasa_embudo_ventas: body.pasa_embudo_ventas,
                nombre_oportunidad: body.nombre_oportunidad,
                etapa_oportunidad: body.etapa_oportunidad,
                producto_ofrecido: body.producto_ofrecido,
                monto_total_sin_imp: body.monto_total_sin_imp,
                probabilidad_cierre: body.probabilidad_cierre,
                observaciones: body.observaciones
            });
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al crear trazabilidad', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPipeline(ejecutivaId) {
        if (!ejecutivaId) {
            throw new common_1.HttpException('ID de ejecutiva requerido', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.ejecutivaTraceabilityService.getPipeline(ejecutivaId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener pipeline', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getActividadesRecientes(ejecutivaId, limit = '10') {
        if (!ejecutivaId) {
            throw new common_1.HttpException('ID de ejecutiva requerido', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.ejecutivaTraceabilityService.getActividadesRecientes(ejecutivaId, parseInt(limit));
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener actividades', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateEtapaOportunidad(body) {
        const { trazabilidadId, nuevaEtapa, ejecutivaId } = body;
        if (!trazabilidadId || !nuevaEtapa || !ejecutivaId) {
            throw new common_1.HttpException('ID de trazabilidad, nueva etapa y ejecutiva requeridos', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.ejecutivaTraceabilityService.updateEtapaOportunidad(trazabilidadId, nuevaEtapa, ejecutivaId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al actualizar etapa', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.EjecutivaTraceabilityController = EjecutivaTraceabilityController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EjecutivaTraceabilityController.prototype, "getTrazabilidad", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EjecutivaTraceabilityController.prototype, "createTrazabilidad", null);
__decorate([
    (0, common_1.Get)('pipeline'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EjecutivaTraceabilityController.prototype, "getPipeline", null);
__decorate([
    (0, common_1.Get)('actividades'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EjecutivaTraceabilityController.prototype, "getActividadesRecientes", null);
__decorate([
    (0, common_1.Put)('etapa'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EjecutivaTraceabilityController.prototype, "updateEtapaOportunidad", null);
exports.EjecutivaTraceabilityController = EjecutivaTraceabilityController = __decorate([
    (0, common_1.Controller)('ejecutiva/trazabilidad'),
    __metadata("design:paramtypes", [ejecutiva_service_1.EjecutivaTraceabilityService])
], EjecutivaTraceabilityController);
//# sourceMappingURL=ejecutiva.controller.js.map