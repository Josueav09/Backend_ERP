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
const platform_express_1 = require("@nestjs/platform-express");
let ApiGatewayController = class ApiGatewayController {
    constructor(httpService) {
        this.httpService = httpService;
    }
    getHeadersWithAuth(req) {
        console.log('🛣️ [ApiGateway] Rutas configuradas:');
        console.log('🛣️ [ApiGateway] PATCH /jefe/clientes/:id/activate');
        console.log('🛣️ [ApiGateway] PATCH /jefe/clientes/:id/deactivate');
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
    async logout(body, req, headers) {
        try {
            console.log('🔐 Procesando logout en API Gateway');
            const authHeaders = {
                ...this.getHeadersWithAuth(req),
                'Content-Type': 'application/json'
            };
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:3001/auth/logout', body, {
                headers: authHeaders
            }));
            return response.data;
        }
        catch (error) {
            console.error('❌ Error en logout (gateway):', error);
            return {
                success: true,
                message: 'Sesión cerrada exitosamente'
            };
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
    async getJefeEjecutivasDisponibles(req) {
        try {
            console.log('🔍 [API Gateway] Solicitando ejecutivas disponibles...');
            const headers = this.getHeadersWithAuth(req);
            const url = 'http://localhost:3002/ejecutivas/disponibles';
            console.log('🔍 [API Gateway] URL destino:', url);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, {
                headers,
                timeout: 10000
            }));
            console.log('✅ [API Gateway] Respuesta recibida:', {
                status: response.status,
                cantidad: response.data?.length || 0
            });
            return response.data;
        }
        catch (error) {
            console.error('❌ [API Gateway] Error:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            if (error.response?.status === 404 || error.response?.status === 500) {
                console.log('ℹ️ [API Gateway] No hay ejecutivas disponibles');
                return [];
            }
            throw new common_1.HttpException(error.response?.data || 'Error interno del servidor', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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
    async removeJefeEmpresaEjecutiva(empresaId, ejecutivaId, req) {
        try {
            console.log('➖ [API Gateway] Removiendo ejecutiva de empresa:', { empresaId, ejecutivaId });
            const headers = this.getHeadersWithAuth(req);
            const url = `http://localhost:3002/empresas/${empresaId}/ejecutivas/${ejecutivaId}`;
            console.log('🔍 [API Gateway] URL destino:', url);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.delete(url, { headers }));
            console.log('✅ [API Gateway] Ejecutiva removida exitosamente');
            return response.data;
        }
        catch (error) {
            console.error('❌ [API Gateway] Error removiendo ejecutiva:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            throw new common_1.HttpException(error.response?.data?.message || 'Error al remover ejecutiva', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async asignarEjecutivaAEmpresa(id, body, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.put(`http://localhost:3002/empresas/${id}/asignar-ejecutiva`, body, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al asignar ejecutiva', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefeEmpresasEjecutivasDisponibles(req) {
        try {
            console.log('🔍 [API Gateway] Solicitando ejecutivas disponibles para empresas...');
            const headers = this.getHeadersWithAuth(req);
            const url = 'http://localhost:3002/empresas/ejecutivas/disponibles';
            console.log('🔍 [API Gateway] URL destino:', url);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, {
                headers,
                timeout: 10000
            }));
            console.log('✅ [API Gateway] Ejecutivas disponibles recibidas:', response.data?.length || 0);
            return response.data;
        }
        catch (error) {
            console.error('❌ [API Gateway] Error:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            if (error.response?.status === 404 || error.response?.status === 500) {
                console.log('ℹ️ [API Gateway] No hay ejecutivas disponibles');
                return [];
            }
            throw new common_1.HttpException(error.response?.data || 'Error interno del servidor', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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
    async activateJefeCliente(id, req) {
        try {
            console.log(`🔄 [ApiGateway] Activando cliente ID: ${id}`);
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.patch(`http://localhost:3002/clientes/${id}/activate`, {}, { headers }));
            console.log(`✅ [ApiGateway] Cliente ${id} activado exitosamente`);
            return response.data;
        }
        catch (error) {
            console.error(`❌ [ApiGateway] Error al activar cliente ${id}:`, error);
            throw new common_1.HttpException(error.response?.data?.message || 'Error al activar cliente', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deactivateJefeCliente(id, req) {
        try {
            console.log(`🗑️ [ApiGateway] Desactivando cliente ID: ${id}`);
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.patch(`http://localhost:3002/clientes/${id}/deactivate`, {}, { headers }));
            console.log(`✅ [ApiGateway] Cliente ${id} desactivado exitosamente`);
            return response.data;
        }
        catch (error) {
            console.error(`❌ [ApiGateway] Error al desactivar cliente ${id}:`, error);
            throw new common_1.HttpException(error.response?.data?.message || 'Error al desactivar cliente', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefeTrazabilidad(empresaId, ejecutivaId, clienteId, fechaInicio, fechaFin, tipoContacto, etapaOportunidad, etapa, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            let url = 'http://localhost:3007/jefe/trazabilidad?';
            const params = new URLSearchParams();
            if (empresaId)
                params.append('empresa', empresaId);
            if (ejecutivaId)
                params.append('ejecutiva', ejecutivaId);
            if (clienteId)
                params.append('cliente', clienteId);
            if (fechaInicio)
                params.append('fechaInicio', fechaInicio);
            if (fechaFin)
                params.append('fechaFin', fechaFin);
            if (tipoContacto)
                params.append('tipoContacto', tipoContacto);
            if (etapaOportunidad)
                params.append('etapaOportunidad', etapaOportunidad);
            if (etapa)
                params.append('etapa', etapa);
            url += params.toString();
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
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('http://localhost:3007/jefe/trazabilidad/dashboard', { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener dashboard de trazabilidad', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefeEstadisticasEtapas(empresaId, fechaInicio, fechaFin, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            let url = 'http://localhost:3007/jefe/trazabilidad/estadisticas-etapas?';
            if (empresaId)
                url += `empresa=${empresaId}&`;
            if (fechaInicio)
                url += `fechaInicio=${fechaInicio}&`;
            if (fechaFin)
                url += `fechaFin=${fechaFin}&`;
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener estadísticas por etapa', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createJefeTrazabilidad(body, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:3007/jefe/trazabilidad', body, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al crear trazabilidad', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateJefeTrazabilidad(id, body, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.put(`http://localhost:3007/jefe/trazabilidad/${id}`, body, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al actualizar trazabilidad', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefeTrazabilidadKPIs(ejecutivaId, empresaId, clienteId, fechaDesde, fechaHasta, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            let url = 'http://localhost:3007/jefe/trazabilidad/kpis?';
            const params = new URLSearchParams();
            if (ejecutivaId)
                params.append('ejecutivaId', ejecutivaId);
            if (empresaId)
                params.append('empresaId', empresaId);
            if (clienteId)
                params.append('clienteId', clienteId);
            if (fechaDesde)
                params.append('fechaDesde', fechaDesde);
            if (fechaHasta)
                params.append('fechaHasta', fechaHasta);
            url += params.toString();
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener KPIs de trazabilidad', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefeTrazabilidadNuevosClientes(meses, ejecutivaId, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            let url = 'http://localhost:3007/jefe/trazabilidad/kpis/nuevos-clientes?';
            if (meses)
                url += `meses=${meses}&`;
            if (ejecutivaId)
                url += `ejecutivaId=${ejecutivaId}&`;
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener nuevos clientes', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefeTrazabilidadContactosPorTipo(ejecutivaId, fechaDesde, fechaHasta, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            let url = 'http://localhost:3007/jefe/trazabilidad/kpis/contactos-por-tipo?';
            if (ejecutivaId)
                url += `ejecutivaId=${ejecutivaId}&`;
            if (fechaDesde)
                url += `fechaDesde=${fechaDesde}&`;
            if (fechaHasta)
                url += `fechaHasta=${fechaHasta}&`;
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener contactos por tipo', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefeTrazabilidadMontosPorEtapa(ejecutivaId, fechaDesde, fechaHasta, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            let url = 'http://localhost:3007/jefe/trazabilidad/kpis/montos-por-etapa?';
            if (ejecutivaId)
                url += `ejecutivaId=${ejecutivaId}&`;
            if (fechaDesde)
                url += `fechaDesde=${fechaDesde}&`;
            if (fechaHasta)
                url += `fechaHasta=${fechaHasta}&`;
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener montos por etapa', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefeTrazabilidadTasaConversion(fechaDesde, fechaHasta, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            let url = 'http://localhost:3007/jefe/trazabilidad/kpis/tasa-conversion?';
            if (fechaDesde)
                url += `fechaDesde=${fechaDesde}&`;
            if (fechaHasta)
                url += `fechaHasta=${fechaHasta}&`;
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener tasa de conversión', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getNuevasReuniones(query, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const { meses, ejecutivaId } = query;
            const params = new URLSearchParams();
            if (meses)
                params.append('meses', meses);
            if (ejecutivaId)
                params.append('ejecutivaId', ejecutivaId);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3007/jefe/trazabilidad/kpis/nuevas-reuniones?${params.toString()}`, { headers }));
            return response.data;
        }
        catch (error) {
            console.error('❌ [API Gateway] Error en getNuevasReuniones:', error.response?.data);
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener nuevas reuniones', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getNuevasVentas(query, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const { meses, ejecutivaId } = query;
            const params = new URLSearchParams();
            if (meses)
                params.append('meses', meses);
            if (ejecutivaId)
                params.append('ejecutivaId', ejecutivaId);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3007/jefe/trazabilidad/kpis/nuevas-ventas?${params.toString()}`, { headers }));
            return response.data;
        }
        catch (error) {
            console.error('❌ [API Gateway] Error en getNuevasVentas:', error.response?.data);
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener nuevas ventas', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEfectividadCanales(query, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const { ejecutivaId, fechaDesde, fechaHasta } = query;
            const params = new URLSearchParams();
            if (ejecutivaId)
                params.append('ejecutivaId', ejecutivaId);
            if (fechaDesde)
                params.append('fechaDesde', fechaDesde);
            if (fechaHasta)
                params.append('fechaHasta', fechaHasta);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3007/jefe/trazabilidad/kpis/efectividad-canales?${params.toString()}`, { headers }));
            return response.data;
        }
        catch (error) {
            console.error('❌ [API Gateway] Error en getEfectividadCanales:', error.response?.data);
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener efectividad de canales', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getResumenSemanal(req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('http://localhost:3007/jefe/trazabilidad/kpis/resumen-semanal', { headers }));
            return response.data;
        }
        catch (error) {
            console.error('❌ [API Gateway] Error en getResumenSemanal:', error.response?.data);
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener resumen semanal', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmbudoVentas(query, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const { ejecutivaId, fechaDesde, fechaHasta } = query;
            const params = new URLSearchParams();
            if (ejecutivaId)
                params.append('ejecutivaId', ejecutivaId);
            if (fechaDesde)
                params.append('fechaDesde', fechaDesde);
            if (fechaHasta)
                params.append('fechaHasta', fechaHasta);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3007/jefe/trazabilidad/kpis/embudo-ventas?${params.toString()}`, { headers }));
            return response.data;
        }
        catch (error) {
            console.error('❌ [API Gateway] Error en getEmbudoVentas:', error.response?.data);
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener embudo de ventas', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRankingEjecutivas(query, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const { fechaDesde, fechaHasta } = query;
            const params = new URLSearchParams();
            if (fechaDesde)
                params.append('fechaDesde', fechaDesde);
            if (fechaHasta)
                params.append('fechaHasta', fechaHasta);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3007/jefe/trazabilidad/kpis/ranking-ejecutivas?${params.toString()}`, { headers }));
            return response.data;
        }
        catch (error) {
            console.error('❌ [API Gateway] Error en getRankingEjecutivas:', error.response?.data);
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener ranking de ejecutivas', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async generateTrazabilidadReport(reportDto, req) {
        try {
            console.log('📊 [API Gateway] Solicitando reporte:', reportDto.reportType);
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:3007/jefe/trazabilidad/report', reportDto, {
                headers,
                responseType: 'text'
            }));
            return response.data;
        }
        catch (error) {
            console.error('❌ [API Gateway] Error generando reporte:', error);
            throw new common_1.HttpException(error.response?.data?.message || 'Error al generar reporte', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async testReport(req) {
        try {
            console.log('🧪 Probando endpoint de reporte...');
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:3007/jefe/trazabilidad/report', {
                reportType: 'etapa1',
                filters: {},
                format: 'csv'
            }, {
                headers,
                responseType: 'text'
            }));
            return { success: true, data: response.data.substring(0, 100) + '...' };
        }
        catch (error) {
            console.error('❌ Error en test:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data || error.message,
                status: error.response?.status
            };
        }
    }
    async getJefeTrazabilidadEtapa1(ejecutivaId, empresaId, clienteId, resultadoContacto, tipoContacto, fechaDesde, fechaHasta, page, limit, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            let url = 'http://localhost:3007/jefe/trazabilidad/etapa1?';
            const params = new URLSearchParams();
            if (ejecutivaId)
                params.append('ejecutivaId', ejecutivaId);
            if (empresaId)
                params.append('empresaId', empresaId);
            if (clienteId)
                params.append('clienteId', clienteId);
            if (resultadoContacto)
                params.append('resultadoContacto', resultadoContacto);
            if (tipoContacto)
                params.append('tipoContacto', tipoContacto);
            if (fechaDesde)
                params.append('fechaDesde', fechaDesde);
            if (fechaHasta)
                params.append('fechaHasta', fechaHasta);
            if (page)
                params.append('page', page);
            if (limit)
                params.append('limit', limit);
            url += params.toString();
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener datos de etapa 1', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefeTrazabilidadEtapa2(ejecutivaId, empresaId, clienteId, etapaOportunidad, fechaDesde, fechaHasta, page, limit, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            let url = 'http://localhost:3007/jefe/trazabilidad/etapa2?';
            const params = new URLSearchParams();
            if (ejecutivaId)
                params.append('ejecutivaId', ejecutivaId);
            if (empresaId)
                params.append('empresaId', empresaId);
            if (clienteId)
                params.append('clienteId', clienteId);
            if (etapaOportunidad)
                params.append('etapaOportunidad', etapaOportunidad);
            if (fechaDesde)
                params.append('fechaDesde', fechaDesde);
            if (fechaHasta)
                params.append('fechaHasta', fechaHasta);
            if (page)
                params.append('page', page);
            if (limit)
                params.append('limit', limit);
            url += params.toString();
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener datos de etapa 2', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJefeTrazabilidadFilterOptions(req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('http://localhost:3007/jefe/trazabilidad/filter-options', { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener opciones de filtro', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAuditoriaContratos(fechaInicio, fechaFin, accion, usuario, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            let url = 'http://localhost:3007/auditoria/contratos?';
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
    async getAuditoriaEstadisticas(req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('http://localhost:3007/auditoria/estadisticas', { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener estadísticas de auditoría', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAuditoriaResumenMensual(req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get('http://localhost:3007/auditoria/resumen-mensual', { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener resumen mensual', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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
    async getEjecutivaEmpresasRegistradas(ejecutivaId, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3002/ejecutiva/empresas/registradas?ejecutivaId=${ejecutivaId}`, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener empresas registradas de ejecutiva', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createEjecutivaEmpresaRegistrar(body, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:3002/ejecutiva/empresas/registrar', body, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al registrar empresa', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createEjecutivaContacto(body, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:3002/ejecutiva/contactos', body, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al crear contacto', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEjecutivaContactos(clienteId, ejecutivaId, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3002/ejecutiva/contactos?clienteId=${clienteId}&ejecutivaId=${ejecutivaId}`, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener contactos de ejecutiva', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEjecutivaPipeline(ejecutivaId, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3002/ejecutiva/pipeline?ejecutivaId=${ejecutivaId}`, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener pipeline de ejecutiva', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEjecutivaActividades(ejecutivaId, limit = '10', req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3002/ejecutiva/actividades?ejecutivaId=${ejecutivaId}&limit=${limit}`, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener actividades de ejecutiva', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEjecutivaKPIsSemanales(ejecutivaId, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3002/ejecutiva/kpis/semanales?ejecutivaId=${ejecutivaId}`, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener KPIs semanales de ejecutiva', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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
    async getEjecutivaTrazabilidadPipeline(ejecutivaId, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3007/ejecutiva/trazabilidad/pipeline?ejecutivaId=${ejecutivaId}`, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener pipeline de trazabilidad', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEjecutivaTrazabilidadActividades(ejecutivaId, limit = '1000', req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3007/ejecutiva/trazabilidad/actividades?ejecutivaId=${ejecutivaId}&limit=${limit}`, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener actividades de trazabilidad', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateEjecutivaTrazabilidadEtapa(body, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.put('http://localhost:3007/ejecutiva/trazabilidad/etapa', body, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al actualizar etapa de trazabilidad', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEjecutivaTrazabilidadStats(ejecutivaId, req) {
        try {
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3007/ejecutiva/trazabilidad/stats?ejecutivaId=${ejecutivaId}`, { headers }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener estadísticas de trazabilidad', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmpresaDashboardStats(clienteUsuarioId, req) {
        try {
            console.log('📊 [API Gateway] === EMPRESA DASHBOARD STATS ===');
            console.log('📊 [API Gateway] Query clienteUsuarioId:', clienteUsuarioId);
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3002/empresa/dashboard/stats?clienteUsuarioId=${clienteUsuarioId}`, { headers }));
            console.log('✅ [API Gateway] Stats de empresa obtenidas exitosamente');
            return response.data;
        }
        catch (error) {
            console.error('❌ [API Gateway] Error en empresa/dashboard/stats:', error.response?.data);
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener estadísticas del dashboard', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmpresaTrazabilidad(clienteUsuarioId, req) {
        try {
            console.log('📋 [API Gateway] === EMPRESA TRAZABILIDAD ===');
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3002/empresa/trazabilidad?clienteUsuarioId=${clienteUsuarioId}`, { headers }));
            console.log('✅ [API Gateway] Trazabilidad de empresa obtenida exitosamente');
            return response.data;
        }
        catch (error) {
            console.error('❌ [API Gateway] Error en empresa/trazabilidad:', error.response?.data);
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener trazabilidad', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmpresaEjecutiva(clienteUsuarioId, req) {
        try {
            console.log('👩‍💼 [API Gateway] === EMPRESA EJECUTIVA ===');
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3002/empresa/ejecutiva?clienteUsuarioId=${clienteUsuarioId}`, { headers }));
            console.log('✅ [API Gateway] Info de ejecutiva obtenida exitosamente');
            return response.data;
        }
        catch (error) {
            console.error('❌ [API Gateway] Error en empresa/ejecutiva:', error.response?.data);
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener información de la ejecutiva', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmpresaActividades(clienteUsuarioId, req) {
        try {
            console.log('🔄 [API Gateway] === EMPRESA ACTIVIDADES ===');
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3002/empresa/actividades?clienteUsuarioId=${clienteUsuarioId}`, { headers }));
            console.log('✅ [API Gateway] Actividades de empresa obtenidas exitosamente');
            return response.data;
        }
        catch (error) {
            console.error('❌ [API Gateway] Error en empresa/actividades:', error.response?.data);
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener actividades', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmpresaClientes(clienteUsuarioId, req) {
        try {
            console.log('👥 [API Gateway] === EMPRESA CLIENTES ===');
            console.log('👥 [API Gateway] Query clienteUsuarioId:', clienteUsuarioId);
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3002/empresa/clientes?clienteUsuarioId=${clienteUsuarioId}`, { headers }));
            console.log('✅ [API Gateway] Clientes de empresa obtenidos exitosamente');
            return response.data;
        }
        catch (error) {
            console.error('❌ [API Gateway] Error en empresa/clientes:', error.response?.data);
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener clientes', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmpresaEjecutivas(empresaId, req) {
        try {
            console.log('👥 [API Gateway] === EMPRESA EJECUTIVAS ===');
            console.log('👥 [API Gateway] Query empresaId:', empresaId);
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3002/empresa/ejecutivas?empresaId=${empresaId}`, { headers }));
            console.log('✅ [API Gateway] Ejecutivas de empresa obtenidas exitosamente');
            return response.data;
        }
        catch (error) {
            console.error('❌ [API Gateway] Error en empresa/ejecutivas:', error.response?.data);
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener ejecutivas', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmpresaEquipoStats(empresaId, req) {
        try {
            console.log('📊 [API Gateway] === EMPRESA EQUIPO STATS ===');
            console.log('📊 [API Gateway] Query empresaId:', empresaId);
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3002/empresa/equipo/stats?empresaId=${empresaId}`, { headers }));
            console.log('✅ [API Gateway] Stats de equipo obtenidas exitosamente');
            return response.data;
        }
        catch (error) {
            console.error('❌ [API Gateway] Error en empresa/equipo/stats:', error.response?.data);
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener estadísticas del equipo', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEjecutivaEmbudo(ejecutivaId, empresaId, req) {
        try {
            console.log('🎯 [API Gateway] === EJECUTIVA EMBUDO ===');
            console.log('🎯 [API Gateway] Ejecutiva ID:', ejecutivaId, 'Empresa ID:', empresaId);
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3002/empresa/ejecutiva/${ejecutivaId}/embudo?empresaId=${empresaId}`, { headers }));
            console.log('✅ [API Gateway] Embudo de ejecutiva obtenido exitosamente');
            return response.data;
        }
        catch (error) {
            console.error('❌ [API Gateway] Error en empresa/ejecutiva/:id/embudo:', error.response?.data);
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener embudo de ejecutiva', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEjecutivaEstadisticas(ejecutivaId, empresaId, req) {
        try {
            console.log('📈 [API Gateway] === EJECUTIVA ESTADÍSTICAS ===');
            console.log('📈 [API Gateway] Ejecutiva ID:', ejecutivaId, 'Empresa ID:', empresaId);
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3002/empresa/ejecutiva/${ejecutivaId}/estadisticas?empresaId=${empresaId}`, { headers }));
            console.log('✅ [API Gateway] Estadísticas de ejecutiva obtenidas exitosamente');
            return response.data;
        }
        catch (error) {
            console.error('❌ [API Gateway] Error en empresa/ejecutiva/:id/estadisticas:', error.response?.data);
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener estadísticas de ejecutiva', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmpresaEjecutivaClientes(ejecutivaId, empresaId, req) {
        try {
            console.log('👥 [API Gateway] === EJECUTIVA CLIENTES ===');
            console.log('👥 [API Gateway] Ejecutiva ID:', ejecutivaId, 'Empresa ID:', empresaId);
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3002/empresa/ejecutiva/${ejecutivaId}/clientes?empresaId=${empresaId}`, { headers }));
            console.log('✅ [API Gateway] Clientes de ejecutiva obtenidos exitosamente');
            return response.data;
        }
        catch (error) {
            console.error('❌ [API Gateway] Error en empresa/ejecutiva/:id/clientes:', error.response?.data);
            throw new common_1.HttpException(error.response?.data?.message || 'Error al obtener clientes de ejecutiva', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async bulkCreateEjecutivaClientes(file, ejecutivaId, req) {
        try {
            console.log('📁 [API Gateway] === BULK UPLOAD CLIENTES ===');
            if (!file) {
                throw new common_1.HttpException('Archivo no proporcionado', common_1.HttpStatus.BAD_REQUEST);
            }
            if (!file.originalname.match(/\.csv$/i)) {
                throw new common_1.HttpException('Formato de archivo no válido. Use CSV', common_1.HttpStatus.BAD_REQUEST);
            }
            console.log('📁 [API Gateway] Archivo recibido:', {
                nombre: file.originalname,
                tamaño: file.size,
                tipo: file.mimetype
            });
            const headers = this.getHeadersWithAuth(req);
            const formData = new FormData();
            const blob = new Blob([file.buffer], { type: file.mimetype });
            formData.append('file', blob, file.originalname);
            formData.append('ejecutivaId', ejecutivaId);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:3002/ejecutiva/clientes/bulk', formData, {
                headers: {
                    ...headers,
                    'Content-Type': 'multipart/form-data'
                }
            }));
            console.log('✅ [API Gateway] Bulk upload completado:', response.data);
            return response.data;
        }
        catch (error) {
            console.error('❌ [API Gateway] Error en bulk upload:', error.response?.data);
            throw new common_1.HttpException(error.response?.data?.message || 'Error al procesar archivo de clientes', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async downloadEjecutivaPlantillaClientes(ejecutivaId, res, req) {
        try {
            console.log('📥 [API Gateway] === DESCARGAR PLANTILLA CLIENTES ===');
            const headers = this.getHeadersWithAuth(req);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3002/ejecutiva/clientes/plantilla?ejecutivaId=${ejecutivaId}`, {
                headers,
                responseType: 'stream'
            }));
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="plantilla_clientes.csv"');
            response.data.pipe(res);
        }
        catch (error) {
            console.error('❌ [API Gateway] Error al descargar plantilla:', error.response?.data);
            const plantillaBasica = this.generarPlantillaBasica();
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="plantilla_clientes.csv"');
            res.send(plantillaBasica);
        }
    }
    generarPlantillaBasica() {
        const headers = [
            'razon_social',
            'ruc',
            'direccion',
            'telefono',
            'correo',
            'pagina_web',
            'pais',
            'departamento',
            'provincia',
            'linkedin',
            'grupo_economico',
            'rubro',
            'sub_rubro',
            'tamanio_empresa',
            'facturacion_anual',
            'cantidad_empleados'
        ];
        const ejemplo = {
            razon_social: 'Mi Empresa Ejemplo SAC',
            ruc: '20123456789',
            direccion: 'Av. Ejemplo 123, Lima',
            telefono: '+51 987 654 321',
            correo: 'contacto@miempresa.com',
            pagina_web: 'https://miempresa.com',
            pais: 'Perú',
            departamento: 'Lima',
            provincia: 'Lima',
            linkedin: 'https://linkedin.com/company/miempresa',
            grupo_economico: 'Grupo Ejemplo',
            rubro: 'Tecnología',
            sub_rubro: 'Desarrollo Software',
            tamanio_empresa: 'Mediana',
            facturacion_anual: '500000.00',
            cantidad_empleados: '50'
        };
        let csvContent = headers.join(',') + '\n';
        const row = headers.map(header => `"${ejemplo[header] || ''}"`).join(',');
        csvContent += row + '\n';
        return csvContent;
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
    (0, common_1.Post)('auth/logout'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "logout", null);
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
    (0, common_1.Get)('jefe/ejecutivas/disponibles'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeEjecutivasDisponibles", null);
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
    (0, common_1.Delete)('jefe/empresas/:empresaId/ejecutivas/:ejecutivaId'),
    __param(0, (0, common_1.Param)('empresaId')),
    __param(1, (0, common_1.Param)('ejecutivaId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "removeJefeEmpresaEjecutiva", null);
__decorate([
    (0, common_1.Put)('jefe/empresas/:id/asignar-ejecutiva'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "asignarEjecutivaAEmpresa", null);
__decorate([
    (0, common_1.Get)('jefe/empresas/ejecutivas/disponibles'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeEmpresasEjecutivasDisponibles", null);
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
    (0, common_1.Patch)('jefe/clientes/:id/activate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "activateJefeCliente", null);
__decorate([
    (0, common_1.Patch)('jefe/clientes/:id/deactivate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "deactivateJefeCliente", null);
__decorate([
    (0, common_1.Get)('jefe/trazabilidad'),
    __param(0, (0, common_1.Query)('empresa')),
    __param(1, (0, common_1.Query)('ejecutiva')),
    __param(2, (0, common_1.Query)('cliente')),
    __param(3, (0, common_1.Query)('fechaInicio')),
    __param(4, (0, common_1.Query)('fechaFin')),
    __param(5, (0, common_1.Query)('tipoContacto')),
    __param(6, (0, common_1.Query)('etapaOportunidad')),
    __param(7, (0, common_1.Query)('etapa')),
    __param(8, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, Object]),
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
    (0, common_1.Get)('jefe/trazabilidad/estadisticas-etapas'),
    __param(0, (0, common_1.Query)('empresa')),
    __param(1, (0, common_1.Query)('fechaInicio')),
    __param(2, (0, common_1.Query)('fechaFin')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeEstadisticasEtapas", null);
__decorate([
    (0, common_1.Post)('jefe/trazabilidad'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "createJefeTrazabilidad", null);
__decorate([
    (0, common_1.Put)('jefe/trazabilidad/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "updateJefeTrazabilidad", null);
__decorate([
    (0, common_1.Get)('jefe/trazabilidad/kpis'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Query)('empresaId')),
    __param(2, (0, common_1.Query)('clienteId')),
    __param(3, (0, common_1.Query)('fechaDesde')),
    __param(4, (0, common_1.Query)('fechaHasta')),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeTrazabilidadKPIs", null);
__decorate([
    (0, common_1.Get)('jefe/trazabilidad/kpis/nuevos-clientes'),
    __param(0, (0, common_1.Query)('meses')),
    __param(1, (0, common_1.Query)('ejecutivaId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeTrazabilidadNuevosClientes", null);
__decorate([
    (0, common_1.Get)('jefe/trazabilidad/kpis/contactos-por-tipo'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Query)('fechaDesde')),
    __param(2, (0, common_1.Query)('fechaHasta')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeTrazabilidadContactosPorTipo", null);
__decorate([
    (0, common_1.Get)('jefe/trazabilidad/kpis/montos-por-etapa'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Query)('fechaDesde')),
    __param(2, (0, common_1.Query)('fechaHasta')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeTrazabilidadMontosPorEtapa", null);
__decorate([
    (0, common_1.Get)('jefe/trazabilidad/kpis/tasa-conversion'),
    __param(0, (0, common_1.Query)('fechaDesde')),
    __param(1, (0, common_1.Query)('fechaHasta')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeTrazabilidadTasaConversion", null);
__decorate([
    (0, common_1.Get)('jefe/trazabilidad/kpis/nuevas-reuniones'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getNuevasReuniones", null);
__decorate([
    (0, common_1.Get)('jefe/trazabilidad/kpis/nuevas-ventas'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getNuevasVentas", null);
__decorate([
    (0, common_1.Get)('jefe/trazabilidad/kpis/efectividad-canales'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEfectividadCanales", null);
__decorate([
    (0, common_1.Get)('jefe/trazabilidad/kpis/resumen-semanal'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getResumenSemanal", null);
__decorate([
    (0, common_1.Get)('jefe/trazabilidad/kpis/embudo-ventas'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEmbudoVentas", null);
__decorate([
    (0, common_1.Get)('jefe/trazabilidad/kpis/ranking-ejecutivas'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getRankingEjecutivas", null);
__decorate([
    (0, common_1.Post)('jefe/trazabilidad/report'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "generateTrazabilidadReport", null);
__decorate([
    (0, common_1.Get)('jefe/trazabilidad/report-test'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "testReport", null);
__decorate([
    (0, common_1.Get)('jefe/trazabilidad/etapa1'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Query)('empresaId')),
    __param(2, (0, common_1.Query)('clienteId')),
    __param(3, (0, common_1.Query)('resultadoContacto')),
    __param(4, (0, common_1.Query)('tipoContacto')),
    __param(5, (0, common_1.Query)('fechaDesde')),
    __param(6, (0, common_1.Query)('fechaHasta')),
    __param(7, (0, common_1.Query)('page')),
    __param(8, (0, common_1.Query)('limit')),
    __param(9, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeTrazabilidadEtapa1", null);
__decorate([
    (0, common_1.Get)('jefe/trazabilidad/etapa2'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Query)('empresaId')),
    __param(2, (0, common_1.Query)('clienteId')),
    __param(3, (0, common_1.Query)('etapaOportunidad')),
    __param(4, (0, common_1.Query)('fechaDesde')),
    __param(5, (0, common_1.Query)('fechaHasta')),
    __param(6, (0, common_1.Query)('page')),
    __param(7, (0, common_1.Query)('limit')),
    __param(8, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeTrazabilidadEtapa2", null);
__decorate([
    (0, common_1.Get)('jefe/trazabilidad/filter-options'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getJefeTrazabilidadFilterOptions", null);
__decorate([
    (0, common_1.Get)('auditoria/contratos'),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __param(2, (0, common_1.Query)('accion')),
    __param(3, (0, common_1.Query)('usuario')),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getAuditoriaContratos", null);
__decorate([
    (0, common_1.Get)('auditoria/estadisticas'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getAuditoriaEstadisticas", null);
__decorate([
    (0, common_1.Get)('auditoria/resumen-mensual'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getAuditoriaResumenMensual", null);
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
    (0, common_1.Get)('ejecutiva/empresas/registradas'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEjecutivaEmpresasRegistradas", null);
__decorate([
    (0, common_1.Post)('ejecutiva/empresas/registrar'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "createEjecutivaEmpresaRegistrar", null);
__decorate([
    (0, common_1.Post)('ejecutiva/contactos'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "createEjecutivaContacto", null);
__decorate([
    (0, common_1.Get)('ejecutiva/contactos'),
    __param(0, (0, common_1.Query)('clienteId')),
    __param(1, (0, common_1.Query)('ejecutivaId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEjecutivaContactos", null);
__decorate([
    (0, common_1.Get)('ejecutiva/pipeline'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEjecutivaPipeline", null);
__decorate([
    (0, common_1.Get)('ejecutiva/actividades'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEjecutivaActividades", null);
__decorate([
    (0, common_1.Get)('ejecutiva/kpis/semanales'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEjecutivaKPIsSemanales", null);
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
__decorate([
    (0, common_1.Get)('ejecutiva/trazabilidad/pipeline'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEjecutivaTrazabilidadPipeline", null);
__decorate([
    (0, common_1.Get)('ejecutiva/trazabilidad/actividades'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEjecutivaTrazabilidadActividades", null);
__decorate([
    (0, common_1.Put)('ejecutiva/trazabilidad/etapa'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "updateEjecutivaTrazabilidadEtapa", null);
__decorate([
    (0, common_1.Get)('ejecutiva/trazabilidad/stats'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEjecutivaTrazabilidadStats", null);
__decorate([
    (0, common_1.Get)('empresa/dashboard/stats'),
    __param(0, (0, common_1.Query)('clienteUsuarioId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEmpresaDashboardStats", null);
__decorate([
    (0, common_1.Get)('empresa/trazabilidad'),
    __param(0, (0, common_1.Query)('clienteUsuarioId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEmpresaTrazabilidad", null);
__decorate([
    (0, common_1.Get)('empresa/ejecutiva'),
    __param(0, (0, common_1.Query)('clienteUsuarioId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEmpresaEjecutiva", null);
__decorate([
    (0, common_1.Get)('empresa/actividades'),
    __param(0, (0, common_1.Query)('clienteUsuarioId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEmpresaActividades", null);
__decorate([
    (0, common_1.Get)('empresa/clientes'),
    __param(0, (0, common_1.Query)('clienteUsuarioId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEmpresaClientes", null);
__decorate([
    (0, common_1.Get)('empresa/ejecutivas'),
    __param(0, (0, common_1.Query)('empresaId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEmpresaEjecutivas", null);
__decorate([
    (0, common_1.Get)('empresa/equipo/stats'),
    __param(0, (0, common_1.Query)('empresaId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEmpresaEquipoStats", null);
__decorate([
    (0, common_1.Get)('empresa/ejecutiva/:id/embudo'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('empresaId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEjecutivaEmbudo", null);
__decorate([
    (0, common_1.Get)('empresa/ejecutiva/:id/estadisticas'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('empresaId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEjecutivaEstadisticas", null);
__decorate([
    (0, common_1.Get)('empresa/ejecutiva/:id/clientes'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('empresaId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "getEmpresaEjecutivaClientes", null);
__decorate([
    (0, common_1.Post)('ejecutiva/clientes/bulk'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('ejecutivaId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "bulkCreateEjecutivaClientes", null);
__decorate([
    (0, common_1.Get)('ejecutiva/clientes/plantilla'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ApiGatewayController.prototype, "downloadEjecutivaPlantillaClientes", null);
exports.ApiGatewayController = ApiGatewayController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], ApiGatewayController);
//# sourceMappingURL=api-gateway.controller.js.map