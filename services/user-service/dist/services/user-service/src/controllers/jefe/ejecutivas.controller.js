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
exports.EjecutivasController = void 0;
const common_1 = require("@nestjs/common");
const ejecutivas_service_1 = require("../../services/jefe/ejecutivas.service");
const jwt_auth_guard_1 = require("../../../../../shared/guards/jwt-auth.guard");
const typeorm_1 = require("typeorm");
let EjecutivasController = class EjecutivasController {
    constructor(ejecutivasService) {
        this.ejecutivasService = ejecutivasService;
    }
    async getEjecutivas() {
        try {
            return await this.ejecutivasService.getEjecutivas();
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener ejecutivas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEjecutiva(id) {
        try {
            const result = await this.ejecutivasService.getEjecutivaById(parseInt(id));
            if (!result) {
                throw new common_1.HttpException('Ejecutiva no encontrada', common_1.HttpStatus.NOT_FOUND);
            }
            return result;
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener ejecutiva', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createEjecutiva(body) {
        try {
            const { dni, nombre_completo, correo, contraseña, telefono } = body;
            if (!dni || !nombre_completo || !correo || !contraseña) {
                throw new common_1.HttpException('DNI, nombre completo, correo y contraseña son requeridos', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.ejecutivasService.createEjecutiva(body);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al crear ejecutiva', error);
        }
    }
    async updateEjecutiva(id, data) {
        console.log('📥 Datos recibidos para actualizar ejecutiva:', data);
        try {
            const result = await this.ejecutivasService.updateEjecutiva(Number(id), data);
            if (!result) {
                throw new common_1.HttpException('Ejecutiva no encontrada', common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                message: 'Ejecutiva actualizada correctamente',
                data: result
            };
        }
        catch (error) {
            console.error('❌ Error actualizando ejecutiva:', error);
            throw new common_1.HttpException(error.message || 'Error al actualizar ejecutiva', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteEjecutiva(id) {
        try {
            const result = await this.ejecutivasService.deleteEjecutiva(parseInt(id));
            if (!result) {
                throw new common_1.HttpException('Ejecutiva no encontrada', common_1.HttpStatus.NOT_FOUND);
            }
            return { message: 'Ejecutiva desactivada correctamente' };
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al desactivar ejecutiva', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEjecutivasDisponiblesSimple() {
        try {
            console.log('🔍 [EjecutivasController] Endpoint simple para ejecutivas disponibles');
            const ejecutivas = await this.ejecutivaRepository.find({
                where: {
                    estado_ejecutiva: 'Activo',
                    id_empresa_prov: (0, typeorm_1.IsNull)()
                },
                select: [
                    'id_ejecutiva',
                    'dni',
                    'nombre_completo',
                    'correo',
                    'telefono',
                    'linkedin',
                    'estado_ejecutiva',
                    'fecha_creacion'
                ],
                order: { nombre_completo: 'ASC' }
            });
            const resultado = ejecutivas.map(ej => {
                const nombreParts = ej.nombre_completo?.split(' ') || ['Ejecutiva', ''];
                return {
                    id_ejecutiva: ej.id_ejecutiva,
                    id_usuario: ej.id_ejecutiva,
                    dni: ej.dni,
                    nombre_completo: ej.nombre_completo,
                    nombre: nombreParts[0] || 'Ejecutiva',
                    apellido: nombreParts.slice(1).join(' ') || '',
                    correo: ej.correo,
                    email: ej.correo,
                    telefono: ej.telefono,
                    linkedin: ej.linkedin,
                    estado_ejecutiva: ej.estado_ejecutiva,
                    activo: true,
                    total_empresas: 0,
                    total_clientes: 0,
                    total_actividades: 0,
                    fecha_creacion: ej.fecha_creacion
                };
            });
            console.log('✅ [EjecutivasController] Ejecutivas simples retornadas:', resultado.length);
            return resultado;
        }
        catch (error) {
            console.error('❌ [EjecutivasController] Error en endpoint simple:', error);
            return [];
        }
    }
};
exports.EjecutivasController = EjecutivasController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EjecutivasController.prototype, "getEjecutivas", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EjecutivasController.prototype, "getEjecutiva", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EjecutivasController.prototype, "createEjecutiva", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EjecutivasController.prototype, "updateEjecutiva", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EjecutivasController.prototype, "deleteEjecutiva", null);
__decorate([
    (0, common_1.Get)('disponibles-simple'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EjecutivasController.prototype, "getEjecutivasDisponiblesSimple", null);
exports.EjecutivasController = EjecutivasController = __decorate([
    (0, common_1.Controller)('ejecutivas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [ejecutivas_service_1.EjecutivasService])
], EjecutivasController);
//# sourceMappingURL=ejecutivas.controller.js.map