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
exports.EjecutivaController = void 0;
const common_1 = require("@nestjs/common");
const ejecutiva_service_1 = require("../../services/ejecutiva/ejecutiva.service");
const platform_express_1 = require("@nestjs/platform-express");
let EjecutivaController = class EjecutivaController {
    constructor(ejecutivaService) {
        this.ejecutivaService = ejecutivaService;
    }
    async getStats(ejecutivaId) {
        if (!ejecutivaId) {
            throw new common_1.HttpException('ID de ejecutiva requerido', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.ejecutivaService.getStats(ejecutivaId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener estadísticas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmpresas(ejecutivaId) {
        if (!ejecutivaId) {
            throw new common_1.HttpException('ID de ejecutiva requerido', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.ejecutivaService.getEmpresas(ejecutivaId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener empresas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async registrarEmpresa(body) {
        const { razon_social, ruc, direccion, telefono, correo, ejecutivaId, pagina_web, contraseña, pais, departamento, provincia, linkedin, grupo_economico, rubro, sub_rubro, tamanio_empresa, facturacion_anual, cantidad_empleados } = body;
        console.log('📨 Datos recibidos en backend:', body);
        if (!ejecutivaId) {
            throw new common_1.HttpException('ID de ejecutiva requerido', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!razon_social || !ruc || !correo) {
            throw new common_1.HttpException('Razón social, RUC y correo son requeridos', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.ejecutivaService.createEmpresa({
                razon_social,
                ruc,
                direccion,
                telefono,
                correo,
                ejecutivaId,
                pagina_web,
                contraseña,
                pais,
                departamento,
                provincia,
                linkedin,
                grupo_economico,
                rubro,
                sub_rubro,
                tamanio_empresa,
                facturacion_anual,
                cantidad_empleados
            });
        }
        catch (error) {
            console.error('❌ Error en controller:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al registrar empresa', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmpresasRegistradas(ejecutivaId) {
        if (!ejecutivaId) {
            throw new common_1.HttpException('ID de ejecutiva requerido', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.ejecutivaService.getEmpresasRegistradas(ejecutivaId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener empresas registradas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getClientes(ejecutivaId) {
        if (!ejecutivaId) {
            throw new common_1.HttpException('ID de ejecutiva requerido', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.ejecutivaService.getClientes(ejecutivaId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener clientes', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createCliente(body) {
        const { razon_social, ruc, direccion, telefono, correo, ejecutivaId, pagina_web, pais, departamento, provincia, linkedin, grupo_economico, rubro, sub_rubro, tamanio_empresa, facturacion_anual, cantidad_empleados } = body;
        console.log('📨 Datos recibidos para crear cliente:', body);
        if (!ejecutivaId) {
            throw new common_1.HttpException('ID de ejecutiva requerido', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!razon_social || !ruc) {
            throw new common_1.HttpException('Razón social y RUC son requeridos', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.ejecutivaService.createCliente({
                razon_social,
                ruc,
                direccion,
                telefono,
                correo,
                ejecutivaId,
                pagina_web,
                pais,
                departamento,
                provincia,
                linkedin,
                grupo_economico,
                rubro,
                sub_rubro,
                tamanio_empresa,
                facturacion_anual,
                cantidad_empleados
            });
        }
        catch (error) {
            console.error('❌ Error en controller crear cliente:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al crear cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createContacto(body) {
        const { nombre_completo, cargo, correo, telefono, id_cliente_final, ejecutivaId, dni, linkedin } = body;
        console.log('📨 Datos recibidos para crear contacto:', body);
        if (!ejecutivaId || !id_cliente_final) {
            throw new common_1.HttpException('Ejecutiva y cliente son requeridos', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!nombre_completo || !correo) {
            throw new common_1.HttpException('Nombre completo y correo son requeridos', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.ejecutivaService.createPersonaContacto({
                nombre_completo,
                cargo,
                correo,
                telefono,
                id_cliente_final,
                ejecutivaId,
                dni,
                linkedin
            });
        }
        catch (error) {
            console.error('❌ Error en controller crear contacto:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al crear contacto', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getContactos(clienteId, ejecutivaId) {
        if (!clienteId || !ejecutivaId) {
            throw new common_1.HttpException('Cliente y ejecutiva son requeridos', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.ejecutivaService.getContactosCliente(clienteId, ejecutivaId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener contactos', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPipeline(ejecutivaId) {
        if (!ejecutivaId) {
            throw new common_1.HttpException('ID de ejecutiva requerido', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.ejecutivaService.getPipeline(ejecutivaId);
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
            return await this.ejecutivaService.getActividadesRecientes(ejecutivaId, parseInt(limit));
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener actividades', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getKPIsSemanales(ejecutivaId) {
        if (!ejecutivaId) {
            throw new common_1.HttpException('ID de ejecutiva requerido', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.ejecutivaService.getKPIsSemanales(ejecutivaId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener KPIs', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async bulkCreateClientes(file, ejecutivaId) {
        if (!file) {
            throw new common_1.HttpException('Archivo no proporcionado', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!file.originalname.match(/\.(csv|xlsx|xls)$/)) {
            throw new common_1.HttpException('Formato de archivo no válido. Use CSV o Excel', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.ejecutivaService.bulkCreateClientes(file, ejecutivaId);
    }
    async downloadPlantilla(_ejecutivaId, res) {
        const plantilla = await this.ejecutivaService.downloadPlantillaClientes();
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${plantilla.filename}"`);
        res.send(plantilla.csv);
    }
};
exports.EjecutivaController = EjecutivaController;
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EjecutivaController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('empresas'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EjecutivaController.prototype, "getEmpresas", null);
__decorate([
    (0, common_1.Post)('empresas/registrar'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EjecutivaController.prototype, "registrarEmpresa", null);
__decorate([
    (0, common_1.Get)('empresas/registradas'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EjecutivaController.prototype, "getEmpresasRegistradas", null);
__decorate([
    (0, common_1.Get)('clientes'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EjecutivaController.prototype, "getClientes", null);
__decorate([
    (0, common_1.Post)('clientes'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EjecutivaController.prototype, "createCliente", null);
__decorate([
    (0, common_1.Post)('contactos'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EjecutivaController.prototype, "createContacto", null);
__decorate([
    (0, common_1.Get)('contactos'),
    __param(0, (0, common_1.Query)('clienteId')),
    __param(1, (0, common_1.Query)('ejecutivaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EjecutivaController.prototype, "getContactos", null);
__decorate([
    (0, common_1.Get)('pipeline'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EjecutivaController.prototype, "getPipeline", null);
__decorate([
    (0, common_1.Get)('actividades'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EjecutivaController.prototype, "getActividadesRecientes", null);
__decorate([
    (0, common_1.Get)('kpis/semanales'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EjecutivaController.prototype, "getKPIsSemanales", null);
__decorate([
    (0, common_1.Post)('clientes/bulk'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('ejecutivaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EjecutivaController.prototype, "bulkCreateClientes", null);
__decorate([
    (0, common_1.Get)('clientes/plantilla'),
    __param(0, (0, common_1.Query)('ejecutivaId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EjecutivaController.prototype, "downloadPlantilla", null);
exports.EjecutivaController = EjecutivaController = __decorate([
    (0, common_1.Controller)('ejecutiva'),
    __metadata("design:paramtypes", [ejecutiva_service_1.EjecutivaService])
], EjecutivaController);
//# sourceMappingURL=ejecutiva.controller.js.map