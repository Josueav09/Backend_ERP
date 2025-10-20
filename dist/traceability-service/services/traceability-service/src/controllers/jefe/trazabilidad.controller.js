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
            console.log('🔍 Usuario autenticado:', req.user);
            if (req.user.userType === 'ejecutiva') {
                if (ejecutivaId && parseInt(ejecutivaId) !== req.user.id_ejecutiva) {
                    throw new common_1.HttpException('No autorizado para ver trazabilidades de otras ejecutivas', common_1.HttpStatus.FORBIDDEN);
                }
                ejecutivaId = req.user.id_ejecutiva.toString();
            }
            else if (req.user.userType !== 'jefe') {
                console.log('❌ Usuario no autorizado:', req.user);
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
            console.log('🔍 Ejecutando servicio con filters:', filters);
            const result = await this.trazabilidadService.getTrazabilidad(filters);
            console.log('✅ [TrazabilidadController] Resultado exitoso, registros:', result.length);
            return result;
        }
        catch (error) {
            console.error('❌ [TrazabilidadController] ERROR:', error);
            console.error('❌ Stack trace:', error.stack);
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
            console.log('👤 Usuario autenticado:', req.user);
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
            console.log('📝 Datos recibidos para crear trazabilidad:', body);
            if (req.user.userType !== 'ejecutiva') {
                throw new common_1.HttpException('Solo las ejecutivas pueden crear trazabilidad', common_1.HttpStatus.FORBIDDEN);
            }
            const { id_ejecutiva, id_empresa_prov, id_cliente_final, id_contacto, tipo_contacto, fecha_contacto, resultado_contacto, fecha_agregado_base, fecha_respuesta, informacion_importante, reunion_agendada, fecha_reunion, participantes, se_dio_reunion, resultados_reunion, pasa_embudo_ventas, fecha_inicio_etapa, nombre_oportunidad, tipo_oportunidad, etapa_oportunidad, producto_ofrecido, fecha_registro_oportunidad, fecha_cierre_esperado, monto_total_sin_imp, probabilidad_cierre, monto_cierre_final, observaciones } = body;
            if (req.user.id_ejecutiva !== id_ejecutiva) {
                throw new common_1.HttpException('No puedes crear trazabilidad para otra ejecutiva', common_1.HttpStatus.FORBIDDEN);
            }
            if (!id_ejecutiva || !id_empresa_prov || !id_cliente_final || !id_contacto ||
                !tipo_contacto || !fecha_contacto || !resultado_contacto) {
                throw new common_1.HttpException('Todos los campos requeridos deben ser proporcionados', common_1.HttpStatus.BAD_REQUEST);
            }
            if (pasa_embudo_ventas && !nombre_oportunidad) {
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
            console.log('📝 Actualizando trazabilidad ID:', id);
            console.log('📝 Datos de actualización:', body);
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
exports.TrazabilidadController = TrazabilidadController = __decorate([
    (0, common_1.Controller)('trazabilidad'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [trazabilidad_service_1.TrazabilidadService])
], TrazabilidadController);
//# sourceMappingURL=trazabilidad.controller.js.map