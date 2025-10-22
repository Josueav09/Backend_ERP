"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const EmpresaProveedora_entity_1 = require("../../../../../shared/entities/EmpresaProveedora.entity");
const Ejecutiva_entity_1 = require("../../../../../shared/entities/Ejecutiva.entity");
const ClienteFinal_entity_1 = require("../../../../../shared/entities/ClienteFinal.entity");
const bcrypt = __importStar(require("bcryptjs"));
let EmpresasService = class EmpresasService {
    constructor(empresaRepository, ejecutivaRepository, clienteRepository) {
        this.empresaRepository = empresaRepository;
        this.ejecutivaRepository = ejecutivaRepository;
        this.clienteRepository = clienteRepository;
    }
    async getEmpresas() {
        const empresas = await this.empresaRepository.find({
            order: { estado: 'DESC', razon_social: 'ASC' }
        });
        const empresasConStats = await Promise.all(empresas.map(async (empresa) => {
            const [totalEjecutivas, totalClientes] = await Promise.all([
                this.ejecutivaRepository.count({
                    where: {
                        empresa_proveedora: { id_empresa_prov: empresa.id_empresa_prov },
                        estado_ejecutiva: 'Activo'
                    }
                }),
                this.clienteRepository.count({
                    where: { ejecutiva: { empresa_proveedora: { id_empresa_prov: empresa.id_empresa_prov } } }
                })
            ]);
            return {
                ...empresa,
                total_ejecutivas: totalEjecutivas,
                total_clientes: totalClientes
            };
        }));
        return empresasConStats;
    }
    async createEmpresa(data) {
        console.log('📥 Datos recibidos para crear empresa:', data);
        const { ruc, razon_social, correo, contraseña, telefono, pagina_web, rubro } = data;
        const existingEmpresa = await this.empresaRepository.findOne({
            where: { ruc }
        });
        if (existingEmpresa) {
            throw new common_1.HttpException('Ya existe una empresa con este RUC', common_1.HttpStatus.BAD_REQUEST);
        }
        const existingEmail = await this.empresaRepository.findOne({
            where: { correo }
        });
        if (existingEmail) {
            throw new common_1.HttpException('Ya existe una empresa con este email', common_1.HttpStatus.BAD_REQUEST);
        }
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        const nuevaEmpresa = this.empresaRepository.create({
            ruc,
            razon_social,
            correo,
            contraseña: hashedPassword,
            telefono: telefono || null,
            pagina_web: pagina_web || null,
            rubro: rubro || null,
            estado: 'Activo'
        });
        return await this.empresaRepository.save(nuevaEmpresa);
    }
    async updateEmpresaEstado(empresaId, activo) {
        console.log('🔄 [EmpresasService] Cambiando estado de empresa:', { empresaId, activo });
        const empresa = await this.empresaRepository.findOne({
            where: { id_empresa_prov: empresaId }
        });
        if (!empresa) {
            throw new common_1.HttpException('Empresa no encontrada', common_1.HttpStatus.NOT_FOUND);
        }
        const estadoAnterior = empresa.estado;
        empresa.estado = activo ? 'Activo' : 'Inactivo';
        empresa.fecha_actualizacion = new Date();
        const ejecutivasEmpresa = await this.ejecutivaRepository.find({
            where: { empresa_proveedora: { id_empresa_prov: empresaId } },
            select: ['id_ejecutiva']
        });
        const idsEjecutivas = ejecutivasEmpresa.map(ej => ej.id_ejecutiva);
        if (idsEjecutivas.length > 0) {
            if (!activo) {
                console.log('➖ [EmpresasService] Desactivando clientes de la empresa:', empresaId);
                const resultDesactivar = await this.clienteRepository
                    .createQueryBuilder()
                    .update()
                    .set({
                    estado: 'Inactivo',
                    fecha_actualizacion: new Date()
                })
                    .where('id_ejecutiva IN (:...idsEjecutivas)', { idsEjecutivas })
                    .execute();
                console.log('✅ [EmpresasService] Clientes desactivados:', resultDesactivar.affected);
            }
            else {
                console.log('➕ [EmpresasService] Activando empresa Y clientes:', empresaId);
                const resultActivar = await this.clienteRepository
                    .createQueryBuilder()
                    .update()
                    .set({
                    estado: 'Activo',
                    fecha_actualizacion: new Date()
                })
                    .where('id_ejecutiva IN (:...idsEjecutivas)', { idsEjecutivas })
                    .andWhere('estado = :estado', { estado: 'Inactivo' })
                    .execute();
                console.log('✅ [EmpresasService] Clientes activados:', resultActivar.affected);
            }
        }
        else {
            console.log('ℹ️ [EmpresasService] No hay ejecutivas en esta empresa');
        }
        await this.empresaRepository.save(empresa);
        console.log('📝 [EmpresasService] Auditoría: Empresa', empresa.razon_social, 'cambió de', estadoAnterior, 'a', empresa.estado);
        return {
            empresa,
            message: `Empresa ${activo ? 'activada' : 'desactivada'} correctamente. ` +
                `${!activo ? 'Los clientes asociados han sido desactivados.' : 'Los clientes asociados han sido activados.'}`
        };
    }
    async updateEmpresa(empresaId, data) {
        console.log('📝 Actualizando empresa ID:', empresaId, 'con datos:', data);
        const empresa = await this.empresaRepository.findOne({
            where: { id_empresa_prov: empresaId }
        });
        if (!empresa) {
            throw new common_1.HttpException('Empresa no encontrada', common_1.HttpStatus.NOT_FOUND);
        }
        if (data.ruc && data.ruc !== empresa.ruc) {
            const existingRuc = await this.empresaRepository.findOne({
                where: { ruc: data.ruc }
            });
            if (existingRuc) {
                throw new common_1.HttpException('Ya existe una empresa con este RUC', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (data.correo && data.correo !== empresa.correo) {
            const existingEmail = await this.empresaRepository.findOne({
                where: { correo: data.correo }
            });
            if (existingEmail) {
                throw new common_1.HttpException('Ya existe una empresa con este email', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (data.razon_social)
            empresa.razon_social = data.razon_social;
        if (data.ruc)
            empresa.ruc = data.ruc;
        if (data.correo)
            empresa.correo = data.correo;
        if (data.telefono !== undefined)
            empresa.telefono = data.telefono;
        if (data.direccion !== undefined)
            empresa.direccion = data.direccion;
        if (data.pagina_web !== undefined)
            empresa.pagina_web = data.pagina_web;
        if (data.rubro !== undefined)
            empresa.rubro = data.rubro;
        if (data.tamanio_empresa)
            empresa.tamanio_empresa = data.tamanio_empresa;
        empresa.fecha_actualizacion = new Date();
        try {
            const empresaActualizada = await this.empresaRepository.save(empresa);
            console.log('✅ Empresa actualizada exitosamente:', empresaActualizada.id_empresa_prov);
            return empresaActualizada;
        }
        catch (error) {
            console.error('❌ Error al actualizar empresa:', error);
            throw new common_1.HttpException('Error interno del servidor al actualizar empresa', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmpresaEjecutivas(empresaId) {
        console.log('🏢 [EmpresasService] Obteniendo ejecutivas de empresa:', empresaId);
        const empresa = await this.empresaRepository.findOne({
            where: { id_empresa_prov: empresaId }
        });
        if (!empresa) {
            throw new common_1.HttpException('Empresa no encontrada', common_1.HttpStatus.NOT_FOUND);
        }
        const ejecutivasAsignadas = await this.ejecutivaRepository.find({
            where: {
                empresa_proveedora: { id_empresa_prov: empresaId },
                estado_ejecutiva: 'Activo'
            },
            order: { nombre_completo: 'ASC' }
        });
        console.log('✅ [EmpresasService] Ejecutivas asignadas:', ejecutivasAsignadas.length);
        const ejecutivasFormateadas = await Promise.all(ejecutivasAsignadas.map(async (ej) => {
            const totalClientes = await this.clienteRepository.count({
                where: { ejecutiva: { id_ejecutiva: ej.id_ejecutiva } }
            });
            return {
                id_usuario: ej.id_ejecutiva,
                nombre: ej.nombre_completo.split(' ')[0] || '',
                apellido: ej.nombre_completo.split(' ').slice(1).join(' ') || '',
                email: ej.correo,
                fecha_asignacion: ej.fecha_actualizacion,
                activo: ej.estado_ejecutiva === 'Activo',
                total_clientes: totalClientes
            };
        }));
        return {
            id_empresa_prov: empresa.id_empresa_prov,
            razon_social: empresa.razon_social,
            ruc: empresa.ruc,
            ejecutivas: ejecutivasFormateadas
        };
    }
    async addEjecutivaToEmpresa(empresaId, ejecutivaId) {
        console.log('➕ [EmpresasService] Asignando ejecutiva:', { empresaId, ejecutivaId });
        const empresa = await this.empresaRepository.findOne({
            where: { id_empresa_prov: empresaId }
        });
        if (!empresa) {
            throw new common_1.HttpException('Empresa no encontrada', common_1.HttpStatus.NOT_FOUND);
        }
        const ejecutiva = await this.ejecutivaRepository.findOne({
            where: { id_ejecutiva: ejecutivaId },
            relations: ['empresa_proveedora']
        });
        if (!ejecutiva) {
            throw new common_1.HttpException('Ejecutiva no encontrada', common_1.HttpStatus.NOT_FOUND);
        }
        if (ejecutiva.empresa_proveedora?.id_empresa_prov === empresaId) {
            throw new common_1.HttpException('Esta ejecutiva ya está asignada a esta empresa', common_1.HttpStatus.BAD_REQUEST);
        }
        if (ejecutiva.empresa_proveedora && ejecutiva.empresa_proveedora.id_empresa_prov !== empresaId) {
            throw new common_1.HttpException(`La ejecutiva ya está asignada a la empresa "${ejecutiva.empresa_proveedora.razon_social}"`, common_1.HttpStatus.BAD_REQUEST);
        }
        ejecutiva.empresa_proveedora = empresa;
        ejecutiva.fecha_actualizacion = new Date();
        await this.ejecutivaRepository.save(ejecutiva);
        console.log('✅ [EmpresasService] Ejecutiva asignada exitosamente');
        return {
            message: 'Ejecutiva asignada correctamente a la empresa',
            ejecutiva: {
                id_ejecutiva: ejecutiva.id_ejecutiva,
                nombre_completo: ejecutiva.nombre_completo,
                correo: ejecutiva.correo,
                empresa: empresa.razon_social
            }
        };
    }
    async removeEjecutivaFromEmpresa(empresaId, ejecutivaId) {
        console.log('➖ [EmpresasService] Removiendo ejecutiva:', { empresaId, ejecutivaId });
        const ejecutiva = await this.ejecutivaRepository.findOne({
            where: {
                id_ejecutiva: ejecutivaId,
                empresa_proveedora: { id_empresa_prov: empresaId }
            },
            relations: ['empresa_proveedora']
        });
        if (!ejecutiva) {
            throw new common_1.HttpException('Ejecutiva no encontrada o no está asignada a esta empresa', common_1.HttpStatus.NOT_FOUND);
        }
        const clientesCount = await this.clienteRepository.count({
            where: { ejecutiva: { id_ejecutiva: ejecutivaId } }
        });
        if (clientesCount > 0) {
            throw new common_1.HttpException(`No se puede quitar la ejecutiva porque tiene ${clientesCount} cliente(s) asignado(s). ` +
                `Primero reasigne los clientes a otra ejecutiva.`, common_1.HttpStatus.BAD_REQUEST);
        }
        ejecutiva.empresa_proveedora = null;
        ejecutiva.fecha_actualizacion = new Date();
        await this.ejecutivaRepository.save(ejecutiva);
        console.log('✅ [EmpresasService] Ejecutiva removida exitosamente');
        return {
            message: 'Ejecutiva removida correctamente de la empresa',
            ejecutiva: {
                id_ejecutiva: ejecutiva.id_ejecutiva,
                nombre_completo: ejecutiva.nombre_completo
            }
        };
    }
};
exports.EmpresasService = EmpresasService;
exports.EmpresasService = EmpresasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(EmpresaProveedora_entity_1.EmpresaProveedora)),
    __param(1, (0, typeorm_1.InjectRepository)(Ejecutiva_entity_1.Ejecutiva)),
    __param(2, (0, typeorm_1.InjectRepository)(ClienteFinal_entity_1.ClienteFinal)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EmpresasService);
//# sourceMappingURL=empresas.service.js.map