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
exports.ApiGatewayController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let ApiGatewayController = class ApiGatewayController {
    constructor(httpService) {
        this.httpService = httpService;
    }
    getHeadersWithAuth(req) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        if (req?.headers?.authorization) {
            headers['Authorization'] = req.headers.authorization;
            console.log('🔐 [API Gateway] Propagando Authorization header');
        }
        if (req?.headers && req.headers['user-agent']) {
            headers['User-Agent'] = req.headers['user-agent'];
        }
        console.log('🔐 [API Gateway] Headers a enviar:', Object.keys(headers));
        return headers;
    }
    async getCaptcha(req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('http://localhost:3001/auth/captcha', { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener captcha', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async login(body, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:3001/auth/login', body, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error en login', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async verifyEmail(body, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:3001/auth/verify-email', body, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error en verificación', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefePerfil(req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            console.log('🔐 [API Gateway /jefe/perfil] Headers:', headers);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('http://localhost:3002/jefe/perfil', { headers }));
            return response.data;
        }
        catch (error) {
            console.error('❌ [API Gateway /jefe/perfil] Error:', error.response?.data);
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener perfil', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateJefePerfil(body, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.put('http://localhost:3002/jefe/perfil', body, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al actualizar perfil', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateJefePassword(body, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.put('http://localhost:3002/jefe/password', body, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al cambiar contraseña', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefeStats(req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('http://localhost:3002/jefe/stats', { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener estadísticas', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefeEjecutivas(req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('http://localhost:3002/ejecutivas', { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener ejecutivas', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefeEjecutiva(id, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3002/ejecutivas/${id}`, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener ejecutiva', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createJefeEjecutiva(body, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:3002/ejecutivas', body, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al crear ejecutiva', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateJefeEjecutiva(id, body, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.put(`http://localhost:3002/ejecutivas/${id}`, body, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al actualizar ejecutiva', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteJefeEjecutiva(id, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.delete(`http://localhost:3002/ejecutivas/${id}`, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al eliminar ejecutiva', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefeEmpresas(req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('http://localhost:3002/empresas', { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener empresas', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefeEmpresa(id, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3002/empresas/${id}`, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener empresa', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createJefeEmpresa(body, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:3002/empresas', body, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al crear empresa', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateJefeEmpresa(id, body, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.put(`http://localhost:3002/empresas/${id}`, body, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al actualizar empresa', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateJefeEmpresaEstado(id, body, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.patch(`http://localhost:3002/empresas/${id}/estado`, body, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al actualizar estado', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefeEmpresaEjecutivas(id, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3002/empresas/${id}/ejecutivas`, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener ejecutivas de empresa', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addJefeEmpresaEjecutiva(id, body, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`http://localhost:3002/empresas/${id}/ejecutivas`, body, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al asignar ejecutiva', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async removeJefeEmpresaEjecutiva(id, ejecutivaId, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`http://localhost:3002/empresas/${id}/ejecutivas/${ejecutivaId}/remove`, {}, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al remover ejecutiva', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefeClientes(req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('http://localhost:3003/clientes', { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener clientes', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefeCliente(id, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3003/clientes/${id}`, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener cliente', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createJefeCliente(body, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:3003/clientes', body, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al crear cliente', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateJefeCliente(id, body, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.put(`http://localhost:3003/clientes/${id}`, body, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al actualizar cliente', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteJefeCliente(id, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.delete(`http://localhost:3003/clientes/${id}`, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al eliminar cliente', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefeTrazabilidad(empresaId, ejecutivaId, clienteId, fechaInicio, fechaFin, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            let url = 'http://localhost:3007/trazabilidad?';
            if (empresaId)
                url += `empresa=${empresaId}&`;
            if (ejecutivaId)
                url += `ejecutiva=${ejecutivaId}&`;
            if (clienteId)
                url += `cliente=${clienteId}&`;
            if (fechaInicio)
                url += `fechaInicio=${fechaInicio}&`;
            if (fechaFin)
                url += `fechaFin=${fechaFin}&`;
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener trazabilidad', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefeTrazabilidadDashboard(req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('http://localhost:3007/trazabilidad/dashboard', { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener dashboard de trazabilidad', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createJefeTrazabilidad(body, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:3007/trazabilidad', body, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al crear trazabilidad', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefeAuditoria(fechaInicio, fechaFin, accion, usuario, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            let url = 'http://localhost:3007/audit/contratos?';
            if (fechaInicio)
                url += `fechaInicio=${fechaInicio}&`;
            if (fechaFin)
                url += `fechaFin=${fechaFin}&`;
            if (accion)
                url += `accion=${accion}&`;
            if (usuario)
                url += `usuario=${usuario}&`;
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener auditoría', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefeAuditoriaEstadisticas(req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('http://localhost:3007/audit/estadisticas', { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener estadísticas de auditoría', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getClienteDashboardStats(empresaId, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3002/cliente/dashboard/stats?empresaId=${empresaId}`, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener estadísticas del cliente', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getClienteTrazabilidad(empresaId, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3007/cliente/trazabilidad?empresaId=${empresaId}`, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener trazabilidad del cliente', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEjecutivaStats(ejecutivaId, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3002/ejecutiva/stats?ejecutivaId=${ejecutivaId}`, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener estadísticas de ejecutiva', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEjecutivaEmpresas(ejecutivaId, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3002/ejecutiva/empresas?ejecutivaId=${ejecutivaId}`, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener empresas de ejecutiva', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createEjecutivaEmpresa(body, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:3002/ejecutiva/empresas', body, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al crear empresa', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEjecutivaClientes(ejecutivaId, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3002/ejecutiva/clientes?ejecutivaId=${ejecutivaId}`, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener clientes de ejecutiva', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createEjecutivaCliente(body, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:3002/ejecutiva/clientes', body, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al crear cliente', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEjecutivaTrazabilidad(ejecutivaId, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3007/ejecutiva/trazabilidad?ejecutivaId=${ejecutivaId}`, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener trazabilidad de ejecutiva', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createEjecutivaTrazabilidad(body, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:3007/ejecutiva/trazabilidad', body, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al crear trazabilidad', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ApiGatewayController = ApiGatewayController;
__decorate([
    (0, common_1.Get)('auth/captcha'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getCaptcha", null);
__decorate([
    (0, common_1.Post)('auth/login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('auth/verify-email'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Get)('jefe/perfil'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefePerfil", null);
__decorate([
    (0, common_1.Put)('jefe/perfil'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "updateJefePerfil", null);
__decorate([
    (0, common_1.Put)('jefe/password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "updateJefePassword", null);
__decorate([
    (0, common_1.Get)('jefe/stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeStats", null);
__decorate([
    (0, common_1.Get)('jefe/ejecutivas'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeEjecutivas", null);
__decorate([
    (0, common_1.Get)('jefe/ejecutivas/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeEjecutiva", null);
__decorate([
    (0, common_1.Post)('jefe/ejecutivas'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "createJefeEjecutiva", null);
__decorate([
    (0, common_1.Put)('jefe/ejecutivas/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "updateJefeEjecutiva", null);
__decorate([
    (0, common_1.Delete)('jefe/ejecutivas/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "deleteJefeEjecutiva", null);
__decorate([
    (0, common_1.Get)('jefe/empresas'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeEmpresas", null);
__decorate([
    (0, common_1.Get)('jefe/empresas/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeEmpresa", null);
__decorate([
    (0, common_1.Post)('jefe/empresas'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "createJefeEmpresa", null);
__decorate([
    (0, common_1.Put)('jefe/empresas/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "updateJefeEmpresa", null);
__decorate([
    (0, common_1.Patch)('jefe/empresas/:id/estado'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "updateJefeEmpresaEstado", null);
__decorate([
    (0, common_1.Get)('jefe/empresas/:id/ejecutivas'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeEmpresaEjecutivas", null);
__decorate([
    (0, common_1.Post)('jefe/empresas/:id/ejecutivas'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "addJefeEmpresaEjecutiva", null);
__decorate([
    (0, common_1.Post)('jefe/empresas/:id/ejecutivas/:ejecutivaId/remove'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('ejecutivaId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "removeJefeEmpresaEjecutiva", null);
__decorate([
    (0, common_1.Get)('jefe/clientes'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeClientes", null);
__decorate([
    (0, common_1.Get)('jefe/clientes/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeCliente", null);
__decorate([
    (0, common_1.Post)('jefe/clientes'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "createJefeCliente", null);
__decorate([
    (0, common_1.Put)('jefe/clientes/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "updateJefeCliente", null);
__decorate([
    (0, common_1.Delete)('jefe/clientes/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "deleteJefeCliente", null);
__decorate([
    (0, common_1.Get)('jefe/trazabilidad'),
    __param(0, (0, common_1.Query)('empresa')),
    __param(1, (0, common_1.Query)('ejecutiva')),
    __param(2, (0, common_1.Query)('cliente')),
    __param(3, (0, common_1.Query)('fechaInicio')),
    __param(4, (0, common_1.Query)('fechaFin')),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeTrazabilidad", null);
__decorate([
    (0, common_1.Get)('jefe/trazabilidad/dashboard'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeTrazabilidadDashboard", null);
__decorate([
    (0, common_1.Post)('jefe/trazabilidad'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "createJefeTrazabilidad", null);
__decorate([
    (0, common_1.Get)('jefe/auditoria'),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __param(2, (0, common_1.Query)('accion')),
    __param(3, (0, common_1.Query)('usuario')),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeAuditoria", null);
__decorate([
    (0, common_1.Get)('jefe/auditoria/estadisticas'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeAuditoriaEstadisticas", null);
__decorate([
    (0, common_1.Get)('cliente/dashboard/stats'),
    __param(0, (0, common_1.Query)('empresaId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getClienteDashboardStats", null);
__decorate([
    (0, common_1.Get)('cliente/trazabilidad'),
    __param(0, (0, common_1.Query)('empresaId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getClienteTrazabilidad", null);
__decorate([
    (0, common_1.Get)('ejecutiva/stats'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEjecutivaStats", null);
__decorate([
    (0, common_1.Get)('ejecutiva/empresas'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEjecutivaEmpresas", null);
__decorate([
    (0, common_1.Post)('ejecutiva/empresas'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "createEjecutivaEmpresa", null);
__decorate([
    (0, common_1.Get)('ejecutiva/clientes'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEjecutivaClientes", null);
__decorate([
    (0, common_1.Post)('ejecutiva/clientes'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "createEjecutivaCliente", null);
__decorate([
    (0, common_1.Get)('ejecutiva/trazabilidad'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEjecutivaTrazabilidad", null);
__decorate([
    (0, common_1.Post)('ejecutiva/trazabilidad'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "createEjecutivaTrazabilidad", null);
exports.ApiGatewayController = ApiGatewayController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], ApiGatewayController);
//# sourceMappingURL=api-gateway.controller.js.map