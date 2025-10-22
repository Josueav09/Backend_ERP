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
exports.TrazabilidadController = void 0;
const common_1 = require("@nestjs/common");
const trazabilidad_service_1 = require("../../services/jefe/trazabilidad.service");
let TrazabilidadController = class TrazabilidadController {
    constructor(trazabilidadService) {
        this.trazabilidadService = trazabilidadService;
        console.log('✅ [TrazabilidadController] Controller inicializado - Rutas disponibles:');
        console.log('   GET /jefe/trazabilidad/kpis');
        console.log('   GET /jefe/trazabilidad/etapa1');
        console.log('   GET /jefe/trazabilidad/etapa2');
        console.log('   GET /jefe/trazabilidad/kpis/nuevos-clientes');
        console.log('   GET /jefe/trazabilidad/kpis/contactos-por-tipo');
        console.log('   GET /jefe/trazabilidad/kpis/montos-por-etapa');
        console.log('   GET /jefe/trazabilidad/kpis/tasa-conversion');
    }
    async getKPIs(ejecutivaId, empresaId, clienteId, fechaDesde, fechaHasta) {
        console.log('📊 [TrazabilidadController.getKPIs] Llamado con parámetros:', {
            ejecutivaId,
            empresaId,
            clienteId,
            fechaDesde,
            fechaHasta
        });
        try {
            const result = await this.trazabilidadService.getKPIs({
                ejecutivaId: ejecutivaId ? parseInt(ejecutivaId) : undefined,
                empresaId: empresaId ? parseInt(empresaId) : undefined,
                clienteId: clienteId ? parseInt(clienteId) : undefined,
                fechaDesde,
                fechaHasta,
            });
            console.log('📊 [TrazabilidadController.getKPIs] Resultado:', result);
            return result;
        }
        catch (error) {
            console.error('❌ [TrazabilidadController.getKPIs] Error:', error);
            throw error;
        }
    }
    async getEtapa1(ejecutivaId, empresaId, clienteId, resultadoContacto, tipoContacto, fechaDesde, fechaHasta, page, limit) {
        return this.trazabilidadService.getEtapa1({
            ejecutivaId: ejecutivaId ? parseInt(ejecutivaId) : undefined,
            empresaId: empresaId ? parseInt(empresaId) : undefined,
            clienteId: clienteId ? parseInt(clienteId) : undefined,
            resultadoContacto,
            tipoContacto,
            fechaDesde,
            fechaHasta,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
        });
    }
    async getEtapa2(ejecutivaId, empresaId, clienteId, etapaOportunidad, fechaDesde, fechaHasta, page, limit) {
        return this.trazabilidadService.getEtapa2({
            ejecutivaId: ejecutivaId ? parseInt(ejecutivaId) : undefined,
            empresaId: empresaId ? parseInt(empresaId) : undefined,
            clienteId: clienteId ? parseInt(clienteId) : undefined,
            etapaOportunidad,
            fechaDesde,
            fechaHasta,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
        });
    }
    async getNuevosClientes(meses, ejecutivaId) {
        return this.trazabilidadService.getNuevosClientes(meses ? parseInt(meses) : 3, ejecutivaId ? parseInt(ejecutivaId) : undefined);
    }
    async getContactosPorTipo(ejecutivaId, fechaDesde, fechaHasta) {
        return this.trazabilidadService.getContactosPorTipo({
            ejecutivaId: ejecutivaId ? parseInt(ejecutivaId) : undefined,
            fechaDesde,
            fechaHasta,
        });
    }
    async getMontosPorEtapa(ejecutivaId, fechaDesde, fechaHasta) {
        return this.trazabilidadService.getMontosPorEtapa({
            ejecutivaId: ejecutivaId ? parseInt(ejecutivaId) : undefined,
            fechaDesde,
            fechaHasta,
        });
    }
    async getTasaConversion(fechaDesde, fechaHasta) {
        return this.trazabilidadService.getTasaConversion({
            fechaDesde,
            fechaHasta,
        });
    }
    async getTrazabilidadDetail(id) {
        return this.trazabilidadService.getTrazabilidadDetail(id);
    }
    async testEndpoint() {
        console.log('✅ [TrazabilidadController] Test endpoint llamado');
        return {
            message: "Trazabilidad endpoint funcionando correctamente",
            timestamp: new Date().toISOString(),
            endpoints: [
                '/jefe/trazabilidad/kpis',
                '/jefe/trazabilidad/etapa1',
                '/jefe/trazabilidad/etapa2',
                '/jefe/trazabilidad/kpis/nuevos-clientes',
                '/jefe/trazabilidad/kpis/contactos-por-tipo',
                '/jefe/trazabilidad/kpis/montos-por-etapa',
                '/jefe/trazabilidad/kpis/tasa-conversion'
            ]
        };
    }
    async getFilterOptions() {
        console.log('🔍 [TrazabilidadController] Obteniendo opciones de filtro...');
        try {
            const options = await this.trazabilidadService.getFilterOptions();
            console.log('✅ [TrazabilidadController] Opciones generadas:', options);
            return options;
        }
        catch (error) {
            console.error('❌ [TrazabilidadController] Error:', error);
            throw error;
        }
    }
};
exports.TrazabilidadController = TrazabilidadController;
__decorate([
    (0, common_1.Get)("kpis"),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Query)('empresaId')),
    __param(2, (0, common_1.Query)('clienteId')),
    __param(3, (0, common_1.Query)('fechaDesde')),
    __param(4, (0, common_1.Query)('fechaHasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getKPIs", null);
__decorate([
    (0, common_1.Get)("etapa1"),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Query)('empresaId')),
    __param(2, (0, common_1.Query)('clienteId')),
    __param(3, (0, common_1.Query)('resultadoContacto')),
    __param(4, (0, common_1.Query)('tipoContacto')),
    __param(5, (0, common_1.Query)('fechaDesde')),
    __param(6, (0, common_1.Query)('fechaHasta')),
    __param(7, (0, common_1.Query)('page')),
    __param(8, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getEtapa1", null);
__decorate([
    (0, common_1.Get)("etapa2"),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Query)('empresaId')),
    __param(2, (0, common_1.Query)('clienteId')),
    __param(3, (0, common_1.Query)('etapaOportunidad')),
    __param(4, (0, common_1.Query)('fechaDesde')),
    __param(5, (0, common_1.Query)('fechaHasta')),
    __param(6, (0, common_1.Query)('page')),
    __param(7, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getEtapa2", null);
__decorate([
    (0, common_1.Get)("kpis/nuevos-clientes"),
    __param(0, (0, common_1.Query)('meses')),
    __param(1, (0, common_1.Query)('ejecutivaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getNuevosClientes", null);
__decorate([
    (0, common_1.Get)("kpis/contactos-por-tipo"),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Query)('fechaDesde')),
    __param(2, (0, common_1.Query)('fechaHasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getContactosPorTipo", null);
__decorate([
    (0, common_1.Get)("kpis/montos-por-etapa"),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Query)('fechaDesde')),
    __param(2, (0, common_1.Query)('fechaHasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getMontosPorEtapa", null);
__decorate([
    (0, common_1.Get)("kpis/tasa-conversion"),
    __param(0, (0, common_1.Query)('fechaDesde')),
    __param(1, (0, common_1.Query)('fechaHasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getTasaConversion", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getTrazabilidadDetail", null);
__decorate([
    (0, common_1.Get)("test"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "testEndpoint", null);
__decorate([
    (0, common_1.Get)('filter-options'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getFilterOptions", null);
exports.TrazabilidadController = TrazabilidadController = __decorate([
    (0, common_1.Controller)("jefe/trazabilidad"),
    __metadata("design:paramtypes", [trazabilidad_service_1.TrazabilidadService])
], TrazabilidadController);
//# sourceMappingURL=trazabilidad.controller.js.map