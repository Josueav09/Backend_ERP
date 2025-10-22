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
exports.JefeController = void 0;
const common_1 = require("@nestjs/common");
const jefe_service_1 = require("../../services/jefe/jefe.service");
const jwt_auth_guard_1 = require("../../../../../shared/guards/jwt-auth.guard");
let JefeController = class JefeController {
    constructor(jefeService) {
        this.jefeService = jefeService;
    }
    async getPerfil(req) {
        console.log('🔐 [JefeController] === OBTENER PERFIL ===');
        console.log('🔐 [JefeController] Headers:', req.headers);
        console.log('🔐 [JefeController] Authorization:', req.headers.authorization);
        console.log('🔐 [JefeController] User completo:', req.user);
        try {
            if (!req.user || !req.user.id_jefe) {
                console.error('❌ [JefeController] Usuario no autenticado o sin id_jefe');
                throw new common_1.HttpException('Usuario no autenticado', common_1.HttpStatus.UNAUTHORIZED);
            }
            const userId = req.user.id_jefe;
            console.log('🔐 [JefeController] User ID extraído:', userId);
            const perfil = await this.jefeService.getPerfil(userId);
            console.log('✅ [JefeController] Perfil obtenido exitosamente');
            return perfil;
        }
        catch (error) {
            console.error('❌ [JefeController] Error en getPerfil:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener perfil', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updatePerfil(req, body) {
        console.log('📝 [JefeController] === ACTUALIZAR PERFIL ===');
        console.log('📝 [JefeController] User:', req.user);
        console.log('📝 [JefeController] Body recibido:', body);
        try {
            if (!req.user || !req.user.id_jefe) {
                throw new common_1.HttpException('Usuario no autenticado', common_1.HttpStatus.UNAUTHORIZED);
            }
            const userId = req.user.id_jefe;
            const resultado = await this.jefeService.updatePerfil(userId, body);
            console.log('✅ [JefeController] Perfil actualizado exitosamente');
            return resultado;
        }
        catch (error) {
            console.error('❌ [JefeController] Error en updatePerfil:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al actualizar perfil', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updatePassword(req, body) {
        console.log('🔒 [JefeController] === ACTUALIZAR CONTRASEÑA ===');
        console.log('🔒 [JefeController] User:', req.user);
        try {
            if (!req.user || !req.user.id_jefe) {
                throw new common_1.HttpException('Usuario no autenticado', common_1.HttpStatus.UNAUTHORIZED);
            }
            const userId = req.user.id_jefe;
            const { password_actual, password_nueva } = body;
            if (!password_actual || !password_nueva) {
                throw new common_1.HttpException('Contraseña actual y nueva son requeridas', common_1.HttpStatus.BAD_REQUEST);
            }
            const resultado = await this.jefeService.updatePassword(userId, password_actual, password_nueva);
            console.log('✅ [JefeController] Contraseña actualizada exitosamente');
            return resultado;
        }
        catch (error) {
            console.error('❌ [JefeController] Error en updatePassword:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al actualizar contraseña', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getStats(req) {
        console.log('📊 [JefeController] === OBTENER ESTADÍSTICAS ===');
        try {
            const stats = await this.jefeService.getStats();
            console.log('✅ [JefeController] Estadísticas obtenidas:', stats);
            return stats;
        }
        catch (error) {
            console.error('❌ [JefeController] Error en getStats:', error.message);
            console.error(error.stack);
            throw new common_1.HttpException(`Error al obtener estadísticas: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getClientes(req) {
        console.log('📋 [JefeController] === OBTENER CLIENTES - INICIANDO ===');
        console.log('👤 Usuario autenticado:', req.user);
        try {
            console.log('🔄 Llamando a jefeService.getClientes()...');
            const clientes = await this.jefeService.getClientes();
            console.log(`✅ [JefeController] ${clientes.length} clientes obtenidos`);
            return clientes;
        }
        catch (error) {
            console.error('❌ [JefeController] Error en getClientes:', error);
            console.error('🔍 Stack trace:', error.stack);
            throw new common_1.HttpException('Error al obtener clientes', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getClienteById(id) {
        console.log(`🔍 [JefeController] === OBTENER CLIENTE ${id} ===`);
        try {
            return await this.jefeService.getClienteById(parseInt(id));
        }
        catch (error) {
            console.error('❌ [JefeController] Error en getClienteById:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createCliente(body) {
        console.log('➕ [JefeController] === CREAR CLIENTE ===');
        console.log('📝 [JefeController] Body:', body);
        try {
            return await this.jefeService.createCliente(body);
        }
        catch (error) {
            console.error('❌ [JefeController] Error en createCliente:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException(error.message || 'Error al crear cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateCliente(id, body) {
        console.log(`📝 [JefeController] === ACTUALIZAR CLIENTE ${id} ===`);
        console.log('📝 [JefeController] Body:', body);
        try {
            return await this.jefeService.updateCliente(parseInt(id), body);
        }
        catch (error) {
            console.error('❌ [JefeController] Error en updateCliente:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException(error.message || 'Error al actualizar cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteCliente(id) {
        console.log(`🗑️ [JefeController] === ELIMINAR CLIENTE ${id} ===`);
        try {
            return await this.jefeService.deleteCliente(parseInt(id));
        }
        catch (error) {
            console.error('❌ [JefeController] Error en deleteCliente:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al eliminar cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.JefeController = JefeController;
__decorate([
    (0, common_1.Get)('perfil'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JefeController.prototype, "getPerfil", null);
__decorate([
    (0, common_1.Put)('perfil'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], JefeController.prototype, "updatePerfil", null);
__decorate([
    (0, common_1.Put)('password'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], JefeController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JefeController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('cliente'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JefeController.prototype, "getClientes", null);
__decorate([
    (0, common_1.Get)('cliente/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JefeController.prototype, "getClienteById", null);
__decorate([
    (0, common_1.Post)('cliente'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JefeController.prototype, "createCliente", null);
__decorate([
    (0, common_1.Put)('cliente/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], JefeController.prototype, "updateCliente", null);
__decorate([
    (0, common_1.Delete)('cliente/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JefeController.prototype, "deleteCliente", null);
exports.JefeController = JefeController = __decorate([
    (0, common_1.Controller)('jefe'),
    __metadata("design:paramtypes", [jefe_service_1.JefeService])
], JefeController);
//# sourceMappingURL=jefe.controller.js.map