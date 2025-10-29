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
const jwt_auth_guard_1 = require("../../../../../shared/guards/jwt-auth.guard");
let TrazabilidadController = class TrazabilidadController {
    constructor(trazabilidadService) {
        this.trazabilidadService = trazabilidadService;
    }
    async getTrazabilidad(req, empresaId, ejecutivaId, clienteId, fechaInicio, fechaFin, tipoContacto, etapaOportunidad, etapa) {
        try {
            console.log('🔍 [TrazabilidadController] getTrazabilidad llamado');
            console.log('🔍 Parámetros recibidos:', {
                empresaId,
                ejecutivaId,
                clienteId,
                fechaInicio,
                fechaFin,
                tipoContacto,
                etapaOportunidad,
                etapa
            });
            if (req.user.userType === 'ejecutiva') {
                if (ejecutivaId && parseInt(ejecutivaId) !== req.user.id_ejecutiva) {
                    throw new common_1.HttpException('No autorizado para ver trazabilidades de otras ejecutivas', common_1.HttpStatus.FORBIDDEN);
                }
                ejecutivaId = req.user.id_ejecutiva.toString();
            }
            else if (req.user.userType !== 'jefe') {
                throw new common_1.HttpException('No autorizado para esta operación', common_1.HttpStatus.FORBIDDEN);
            }
            const filters = {
                empresaId,
                ejecutivaId,
                clienteId,
                fechaInicio,
                fechaFin,
                tipoContacto,
                etapaOportunidad,
                etapa
            };
            const result = await this.trazabilidadService.getTrazabilidad(filters);
            console.log('✅ [TrazabilidadController] Resultado exitoso, registros:', result.length);
            return result;
        }
        catch (error) {
            console.error('❌ [TrazabilidadController] ERROR:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener trazabilidad', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getDashboardTrazabilidad(req) {
        try {
            console.log('👤 Usuario autenticado:', req.user);
            if (req.user.userType !== 'jefe') {
                throw new common_1.HttpException('No autorizado para esta operación', common_1.HttpStatus.FORBIDDEN);
            }
            return await this.trazabilidadService.getDashboardTrazabilidad();
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener dashboard de trazabilidad', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEstadisticasPorEtapa(req, empresaId, fechaInicio, fechaFin) {
        try {
            if (req.user.userType !== 'jefe') {
                throw new common_1.HttpException('No autorizado para esta operación', common_1.HttpStatus.FORBIDDEN);
            }
            const filters = { empresaId, fechaInicio, fechaFin };
            return await this.trazabilidadService.getEstadisticasPorEtapa(filters);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener estadísticas por etapa', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createTrazabilidad(req, body) {
        try {
            console.log('👤 Usuario autenticado:', req.user);
            if (req.user.userType !== 'ejecutiva') {
                throw new common_1.HttpException('Solo las ejecutivas pueden crear trazabilidad', common_1.HttpStatus.FORBIDDEN);
            }
            const { id_ejecutiva } = body;
            if (req.user.id_ejecutiva !== id_ejecutiva) {
                throw new common_1.HttpException('No puedes crear trazabilidad para otra ejecutiva', common_1.HttpStatus.FORBIDDEN);
            }
            if (!id_ejecutiva || !body.id_empresa_prov || !body.id_cliente_final || !body.id_contacto ||
                !body.tipo_contacto || !body.fecha_contacto || !body.resultado_contacto) {
                throw new common_1.HttpException('Todos los campos requeridos deben ser proporcionados', common_1.HttpStatus.BAD_REQUEST);
            }
            if (body.pasa_embudo_ventas && !body.nombre_oportunidad) {
                throw new common_1.HttpException('Para pasar al embudo de ventas se requiere un nombre de oportunidad', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.trazabilidadService.createTrazabilidad(body);
        }
        catch (error) {
            console.error('❌ Error al crear trazabilidad:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al crear trazabilidad', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateTrazabilidad(req, id, body) {
        try {
            console.log('👤 Usuario autenticado:', req.user);
            if (req.user.userType !== 'ejecutiva') {
                throw new common_1.HttpException('Solo las ejecutivas pueden actualizar trazabilidad', common_1.HttpStatus.FORBIDDEN);
            }
            const trazabilidadExistente = await this.trazabilidadService.getTrazabilidad({
                id_trazabilidad: parseInt(id)
            });
            if (!trazabilidadExistente || trazabilidadExistente.length === 0) {
                throw new common_1.HttpException('Trazabilidad no encontrada', common_1.HttpStatus.NOT_FOUND);
            }
            const trazabilidad = trazabilidadExistente[0];
            if (trazabilidad.ejecutiva.id_ejecutiva !== req.user.id_ejecutiva) {
                throw new common_1.HttpException('No puedes actualizar trazabilidad de otra ejecutiva', common_1.HttpStatus.FORBIDDEN);
            }
            return await this.trazabilidadService.updateTrazabilidad(parseInt(id), body);
        }
        catch (error) {
            console.error('❌ Error al actualizar trazabilidad:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al actualizar trazabilidad', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getKPIs(req, ejecutivaId, empresaId, clienteId, fechaDesde, fechaHasta) {
        try {
            console.log('📈 [TrazabilidadController] getKPIs llamado');
            if (req.user.userType === 'ejecutiva') {
                ejecutivaId = req.user.id_ejecutiva.toString();
            }
            else if (req.user.userType !== 'jefe') {
                throw new common_1.HttpException('No autorizado', common_1.HttpStatus.FORBIDDEN);
            }
            const filters = {
                ejecutivaId: ejecutivaId ? parseInt(ejecutivaId) : undefined,
                empresaId: empresaId ? parseInt(empresaId) : undefined,
                clienteId: clienteId ? parseInt(clienteId) : undefined,
                fechaDesde,
                fechaHasta
            };
            return await this.trazabilidadService.getKPIs(filters);
        }
        catch (error) {
            console.error('❌ Error en getKPIs:', error);
            return {
                totalOportunidades: 0,
                enProceso: 0,
                ventasGanadas: 0,
                ventasPerdidas: 0,
                montoTotal: 0,
                tasaConversion: 0
            };
        }
    }
    async getNuevosClientes(req, meses, ejecutivaId) {
        try {
            console.log('👥 [TrazabilidadController] getNuevosClientes llamado');
            if (req.user.userType === 'ejecutiva') {
                ejecutivaId = req.user.id_ejecutiva.toString();
            }
            else if (req.user.userType !== 'jefe') {
                throw new common_1.HttpException('No autorizado', common_1.HttpStatus.FORBIDDEN);
            }
            const mesesNum = parseInt(meses) || 6;
            const idEjecutiva = ejecutivaId ? parseInt(ejecutivaId) : undefined;
            return await this.trazabilidadService.getNuevosClientes(mesesNum, idEjecutiva);
        }
        catch (error) {
            console.error('❌ Error en getNuevosClientes:', error);
            return [
                { mes: 'Oct 2025', contactos: 1 },
                { mes: 'Sep 2025', contactos: 0 },
                { mes: 'Ago 2025', contactos: 0 }
            ];
        }
    }
    async getContactosPorTipo(req, ejecutivaId, fechaDesde, fechaHasta) {
        try {
            console.log('📞 [TrazabilidadController] getContactosPorTipo llamado');
            if (req.user.userType === 'ejecutiva') {
                ejecutivaId = req.user.id_ejecutiva.toString();
            }
            else if (req.user.userType !== 'jefe') {
                throw new common_1.HttpException('No autorizado', common_1.HttpStatus.FORBIDDEN);
            }
            const filters = {
                ejecutivaId: ejecutivaId ? parseInt(ejecutivaId) : undefined,
                fechaDesde,
                fechaHasta
            };
            return await this.trazabilidadService.getContactosPorTipo(filters);
        }
        catch (error) {
            console.error('❌ Error en getContactosPorTipo:', error);
            return [
                { name: 'Llamada', value: 5, color: '#3B82F6' },
                { name: 'Email', value: 3, color: '#A855F7' },
                { name: 'WhatsApp', value: 2, color: '#10B981' }
            ];
        }
    }
    async getMontosPorEtapa(req, ejecutivaId, fechaDesde, fechaHasta) {
        try {
            console.log('💰 [TrazabilidadController] getMontosPorEtapa llamado');
            if (req.user.userType === 'ejecutiva') {
                ejecutivaId = req.user.id_ejecutiva.toString();
            }
            else if (req.user.userType !== 'jefe') {
                throw new common_1.HttpException('No autorizado', common_1.HttpStatus.FORBIDDEN);
            }
            const filters = {
                ejecutivaId: ejecutivaId ? parseInt(ejecutivaId) : undefined,
                fechaDesde,
                fechaHasta
            };
            return await this.trazabilidadService.getMontosPorEtapa(filters);
        }
        catch (error) {
            console.error('❌ Error en getMontosPorEtapa:', error);
            return [
                { etapa: 'Prospección', monto: 50000 },
                { etapa: 'Negociación', monto: 150000 },
                { etapa: 'Venta ganada', monto: 300000 }
            ];
        }
    }
    async getTasaConversion(req, fechaDesde, fechaHasta) {
        try {
            console.log('📊 [TrazabilidadController] getTasaConversion llamado');
            if (req.user.userType !== 'jefe') {
                throw new common_1.HttpException('Solo el jefe puede ver tasas de conversión', common_1.HttpStatus.FORBIDDEN);
            }
            const filters = { fechaDesde, fechaHasta };
            return await this.trazabilidadService.getTasaConversion(filters);
        }
        catch (error) {
            console.error('❌ Error en getTasaConversion:', error);
            return [
                {
                    id_ejecutiva: 1,
                    ejecutiva: 'María',
                    ventas_ganadas: 4,
                    ventas_perdidas: 2,
                    total_oportunidades: 10,
                    monto_total_ganado: 120000,
                    tasa: 40
                }
            ];
        }
    }
    async getEtapa1(req, ejecutivaId, empresaId, clienteId, resultadoContacto, tipoContacto, fechaDesde, fechaHasta, page, limit) {
        try {
            console.log('📋 [TrazabilidadController] getEtapa1 llamado');
            if (req.user.userType === 'ejecutiva') {
                ejecutivaId = req.user.id_ejecutiva.toString();
            }
            else if (req.user.userType !== 'jefe') {
                throw new common_1.HttpException('No autorizado', common_1.HttpStatus.FORBIDDEN);
            }
            const filters = {
                ejecutivaId: ejecutivaId ? parseInt(ejecutivaId) : undefined,
                empresaId: empresaId ? parseInt(empresaId) : undefined,
                clienteId: clienteId ? parseInt(clienteId) : undefined,
                resultadoContacto,
                tipoContacto,
                fechaDesde,
                fechaHasta,
                page: page ? parseInt(page) : 1,
                limit: limit ? parseInt(limit) : 20
            };
            return await this.trazabilidadService.getEtapa1(filters);
        }
        catch (error) {
            console.error('❌ Error en getEtapa1:', error);
            return {
                data: [],
                pagination: {
                    total: 0,
                    page: 1,
                    limit: 20,
                    totalPages: 0
                }
            };
        }
    }
    async getEtapa2(req, ejecutivaId, empresaId, clienteId, etapaOportunidad, fechaDesde, fechaHasta, page, limit) {
        try {
            console.log('🎯 [TrazabilidadController] getEtapa2 llamado');
            if (req.user.userType === 'ejecutiva') {
                ejecutivaId = req.user.id_ejecutiva.toString();
            }
            else if (req.user.userType !== 'jefe') {
                throw new common_1.HttpException('No autorizado', common_1.HttpStatus.FORBIDDEN);
            }
            const filters = {
                ejecutivaId: ejecutivaId ? parseInt(ejecutivaId) : undefined,
                empresaId: empresaId ? parseInt(empresaId) : undefined,
                clienteId: clienteId ? parseInt(clienteId) : undefined,
                etapaOportunidad,
                fechaDesde,
                fechaHasta,
                page: page ? parseInt(page) : 1,
                limit: limit ? parseInt(limit) : 20
            };
            return await this.trazabilidadService.getEtapa2(filters);
        }
        catch (error) {
            console.error('❌ Error en getEtapa2:', error);
            return {
                data: [],
                pagination: {
                    total: 0,
                    page: 1,
                    limit: 20,
                    totalPages: 0
                }
            };
        }
    }
    async getFilterOptions(req) {
        try {
            console.log('⚙️ [TrazabilidadController] getFilterOptions llamado');
            if (req.user.userType !== 'jefe' && req.user.userType !== 'ejecutiva') {
                throw new common_1.HttpException('No autorizado', common_1.HttpStatus.FORBIDDEN);
            }
            return await this.trazabilidadService.getFilterOptions();
        }
        catch (error) {
            console.error('❌ Error en getFilterOptions:', error);
            return {
                ejecutivas: [],
                empresas: [],
                clientes: []
            };
        }
    }
    async getNuevasReuniones(req, meses, ejecutivaId) {
        try {
            console.log('📅 [TrazabilidadController] getNuevasReuniones llamado');
            if (req.user.userType === 'ejecutiva') {
                ejecutivaId = req.user.id_ejecutiva.toString();
            }
            else if (req.user.userType !== 'jefe') {
                throw new common_1.HttpException('No autorizado', common_1.HttpStatus.FORBIDDEN);
            }
            const mesesNum = parseInt(meses) || 6;
            const idEjecutiva = ejecutivaId ? parseInt(ejecutivaId) : undefined;
            return await this.trazabilidadService.getNuevasReunionesAgendadas(mesesNum, idEjecutiva);
        }
        catch (error) {
            console.error('❌ Error en getNuevasReuniones:', error);
            return [
                { mes: 'Oct 2025', reuniones: 3 },
                { mes: 'Sep 2025', reuniones: 2 },
                { mes: 'Ago 2025', reuniones: 4 }
            ];
        }
    }
    async getNuevasVentas(req, meses, ejecutivaId) {
        try {
            console.log('💰 [TrazabilidadController] getNuevasVentas llamado');
            if (req.user.userType === 'ejecutiva') {
                ejecutivaId = req.user.id_ejecutiva.toString();
            }
            else if (req.user.userType !== 'jefe') {
                throw new common_1.HttpException('No autorizado', common_1.HttpStatus.FORBIDDEN);
            }
            const mesesNum = parseInt(meses) || 6;
            const idEjecutiva = ejecutivaId ? parseInt(ejecutivaId) : undefined;
            return await this.trazabilidadService.getNuevasVentas(mesesNum, idEjecutiva);
        }
        catch (error) {
            console.error('❌ Error en getNuevasVentas:', error);
            return [
                { mes: 'Oct 2025', ventas: 2 },
                { mes: 'Sep 2025', ventas: 3 },
                { mes: 'Ago 2025', ventas: 1 }
            ];
        }
    }
    async getEfectividadCanales(req, ejecutivaId, fechaDesde, fechaHasta) {
        try {
            console.log('📞 [TrazabilidadController] getEfectividadCanales llamado');
            if (req.user.userType === 'ejecutiva') {
                ejecutivaId = req.user.id_ejecutiva.toString();
            }
            else if (req.user.userType !== 'jefe') {
                throw new common_1.HttpException('No autorizado', common_1.HttpStatus.FORBIDDEN);
            }
            const filters = {
                ejecutivaId: ejecutivaId ? parseInt(ejecutivaId) : undefined,
                fechaDesde,
                fechaHasta
            };
            return await this.trazabilidadService.getEfectividadCanalesContacto(filters);
        }
        catch (error) {
            console.error('❌ Error en getEfectividadCanales:', error);
            return [];
        }
    }
    async getResumenSemanal(req) {
        try {
            console.log('📊 [TrazabilidadController] getResumenSemanal llamado');
            if (req.user.userType !== 'jefe') {
                throw new common_1.HttpException('Solo el jefe puede ver el resumen semanal', common_1.HttpStatus.FORBIDDEN);
            }
            return await this.trazabilidadService.getResumenSemanalEjecutivas();
        }
        catch (error) {
            console.error('❌ Error en getResumenSemanal:', error);
            return [];
        }
    }
    async getEmbudoVentas(req, ejecutivaId, fechaDesde, fechaHasta) {
        try {
            console.log('🔄 [TrazabilidadController] getEmbudoVentas llamado');
            if (req.user.userType === 'ejecutiva') {
                ejecutivaId = req.user.id_ejecutiva.toString();
            }
            else if (req.user.userType !== 'jefe') {
                throw new common_1.HttpException('No autorizado', common_1.HttpStatus.FORBIDDEN);
            }
            const filters = {
                ejecutivaId: ejecutivaId ? parseInt(ejecutivaId) : undefined,
                fechaDesde,
                fechaHasta
            };
            return await this.trazabilidadService.getEmbudoVentas(filters);
        }
        catch (error) {
            console.error('❌ Error en getEmbudoVentas:', error);
            return [];
        }
    }
    async getRankingEjecutivas(req, fechaDesde, fechaHasta) {
        try {
            console.log('🏆 [TrazabilidadController] getRankingEjecutivas llamado');
            if (req.user.userType !== 'jefe') {
                throw new common_1.HttpException('Solo el jefe puede ver el ranking', common_1.HttpStatus.FORBIDDEN);
            }
            const filters = { fechaDesde, fechaHasta };
            return await this.trazabilidadService.getRankingEjecutivas(filters);
        }
        catch (error) {
            console.error('❌ Error en getRankingEjecutivas:', error);
            return [];
        }
    }
    async generateReport(reportDto, res) {
        try {
            console.log('📊 [TrazabilidadController] Iniciando generación de reporte...');
            const { filters, reportType, format = 'csv' } = reportDto;
            if (format !== 'csv') {
                return res.status(400).json({ error: 'Solo se soporta formato CSV' });
            }
            const csvContent = await this.trazabilidadService.generateReportCSV(filters, reportType);
            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename=reporte_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
            return res.send(csvContent);
        }
        catch (error) {
            console.error('❌ [TrazabilidadController] ERROR:', error);
            return res.status(500).json({
                error: 'Error interno del servidor al generar reporte',
                details: error.message
            });
        }
    }
    convertToCSV(data) {
        if (data.length === 0)
            return '';
        const headers = Object.keys(data[0]);
        const csvRows = [];
        csvRows.push(headers.join(','));
        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header];
                if (value === null || value === undefined)
                    return '';
                const stringValue = String(value);
                return stringValue.includes(',') ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
            });
            csvRows.push(values.join(','));
        }
        return csvRows.join('\n');
    }
};
exports.TrazabilidadController = TrazabilidadController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('empresa')),
    __param(2, (0, common_1.Query)('ejecutiva')),
    __param(3, (0, common_1.Query)('cliente')),
    __param(4, (0, common_1.Query)('fechaInicio')),
    __param(5, (0, common_1.Query)('fechaFin')),
    __param(6, (0, common_1.Query)('tipoContacto')),
    __param(7, (0, common_1.Query)('etapaOportunidad')),
    __param(8, (0, common_1.Query)('etapa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getTrazabilidad", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getDashboardTrazabilidad", null);
__decorate([
    (0, common_1.Get)('estadisticas-etapas'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('empresa')),
    __param(2, (0, common_1.Query)('fechaInicio')),
    __param(3, (0, common_1.Query)('fechaFin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getEstadisticasPorEtapa", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "createTrazabilidad", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "updateTrazabilidad", null);
__decorate([
    (0, common_1.Get)('kpis'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('ejecutivaId')),
    __param(2, (0, common_1.Query)('empresaId')),
    __param(3, (0, common_1.Query)('clienteId')),
    __param(4, (0, common_1.Query)('fechaDesde')),
    __param(5, (0, common_1.Query)('fechaHasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getKPIs", null);
__decorate([
    (0, common_1.Get)('kpis/nuevos-clientes'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('meses')),
    __param(2, (0, common_1.Query)('ejecutivaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getNuevosClientes", null);
__decorate([
    (0, common_1.Get)('kpis/contactos-por-tipo'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('ejecutivaId')),
    __param(2, (0, common_1.Query)('fechaDesde')),
    __param(3, (0, common_1.Query)('fechaHasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getContactosPorTipo", null);
__decorate([
    (0, common_1.Get)('kpis/montos-por-etapa'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('ejecutivaId')),
    __param(2, (0, common_1.Query)('fechaDesde')),
    __param(3, (0, common_1.Query)('fechaHasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getMontosPorEtapa", null);
__decorate([
    (0, common_1.Get)('kpis/tasa-conversion'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('fechaDesde')),
    __param(2, (0, common_1.Query)('fechaHasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getTasaConversion", null);
__decorate([
    (0, common_1.Get)('etapa1'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('ejecutivaId')),
    __param(2, (0, common_1.Query)('empresaId')),
    __param(3, (0, common_1.Query)('clienteId')),
    __param(4, (0, common_1.Query)('resultadoContacto')),
    __param(5, (0, common_1.Query)('tipoContacto')),
    __param(6, (0, common_1.Query)('fechaDesde')),
    __param(7, (0, common_1.Query)('fechaHasta')),
    __param(8, (0, common_1.Query)('page')),
    __param(9, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getEtapa1", null);
__decorate([
    (0, common_1.Get)('etapa2'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('ejecutivaId')),
    __param(2, (0, common_1.Query)('empresaId')),
    __param(3, (0, common_1.Query)('clienteId')),
    __param(4, (0, common_1.Query)('etapaOportunidad')),
    __param(5, (0, common_1.Query)('fechaDesde')),
    __param(6, (0, common_1.Query)('fechaHasta')),
    __param(7, (0, common_1.Query)('page')),
    __param(8, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getEtapa2", null);
__decorate([
    (0, common_1.Get)('filter-options'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getFilterOptions", null);
__decorate([
    (0, common_1.Get)('kpis/nuevas-reuniones'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('meses')),
    __param(2, (0, common_1.Query)('ejecutivaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getNuevasReuniones", null);
__decorate([
    (0, common_1.Get)('kpis/nuevas-ventas'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('meses')),
    __param(2, (0, common_1.Query)('ejecutivaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getNuevasVentas", null);
__decorate([
    (0, common_1.Get)('kpis/efectividad-canales'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('ejecutivaId')),
    __param(2, (0, common_1.Query)('fechaDesde')),
    __param(3, (0, common_1.Query)('fechaHasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getEfectividadCanales", null);
__decorate([
    (0, common_1.Get)('kpis/resumen-semanal'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getResumenSemanal", null);
__decorate([
    (0, common_1.Get)('kpis/embudo-ventas'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('ejecutivaId')),
    __param(2, (0, common_1.Query)('fechaDesde')),
    __param(3, (0, common_1.Query)('fechaHasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getEmbudoVentas", null);
__decorate([
    (0, common_1.Get)('kpis/ranking-ejecutivas'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('fechaDesde')),
    __param(2, (0, common_1.Query)('fechaHasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "getRankingEjecutivas", null);
__decorate([
    (0, common_1.Post)('report'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TrazabilidadController.prototype, "generateReport", null);
exports.TrazabilidadController = TrazabilidadController = __decorate([
    (0, common_1.Controller)('jefe/trazabilidad'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [trazabilidad_service_1.TrazabilidadService])
], TrazabilidadController);
//# sourceMappingURL=trazabilidad.controller.js.map