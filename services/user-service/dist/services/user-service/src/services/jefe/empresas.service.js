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
        const queryRunner = this.empresaRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const empresa = await queryRunner.manager.findOne(EmpresaProveedora_entity_1.EmpresaProveedora, {
                where: { id_empresa_prov: empresaId }
            });
            if (!empresa) {
                throw new common_1.HttpException('Empresa no encontrada', common_1.HttpStatus.NOT_FOUND);
            }
            const estadoAnterior = empresa.estado;
            const nuevoEstado = activo ? 'Activo' : 'Inactivo';
            console.log(`🔄 [EmpresasService] Cambiando estado de "${empresa.razon_social}": ${estadoAnterior} -> ${nuevoEstado}`);
            const ejecutivasEmpresa = await queryRunner.manager.find(Ejecutiva_entity_1.Ejecutiva, {
                where: { id_empresa_prov: empresaId }
            });
            console.log(`🔍 [EmpresasService] Ejecutivas encontradas: ${ejecutivasEmpresa.length}`);
            const idsEjecutivas = ejecutivasEmpresa.map(ej => ej.id_ejecutiva);
            if (idsEjecutivas.length > 0) {
                console.log(`🔍 [EmpresasService] Actualizando clientes...`);
                const nuevoEstadoCliente = activo ? 'Activo' : 'Inactivo';
                for (const idEjecutiva of idsEjecutivas) {
                    const result = await queryRunner.manager.update(ClienteFinal_entity_1.ClienteFinal, { ejecutiva: { id_ejecutiva: idEjecutiva } }, {
                        estado: nuevoEstadoCliente,
                        fecha_actualizacion: new Date()
                    });
                    console.log(`✅ Ejecutiva ${idEjecutiva}: ${result.affected} clientes actualizados`);
                }
            }
            await queryRunner.manager.update(EmpresaProveedora_entity_1.EmpresaProveedora, { id_empresa_prov: empresaId }, {
                estado: nuevoEstado,
                fecha_actualizacion: new Date()
            });
            await queryRunner.commitTransaction();
            console.log('✅ [EmpresasService] Transacción completada exitosamente');
            return {
                empresa: { ...empresa, estado: nuevoEstado },
                message: `Empresa ${activo ? 'activada' : 'desactivada'} correctamente. ` +
                    `${idsEjecutivas.length > 0 ? `${idsEjecutivas.length} cliente(s) ${activo ? 'activado(s)' : 'desactivado(s)'}.` : 'No hay clientes asociados.'}`
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('❌ [EmpresasService] Error en transacción - REVERTIDO:', error);
            throw new common_1.HttpException('Error al cambiar estado. Los cambios han sido revertidos.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            await queryRunner.release();
        }
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
    async asignarEjecutivaAEmpresa(idEmpresa, idEjecutiva) {
        try {
            console.log(`🔗 [EmpresasService] Asignando ejecutiva ${idEjecutiva} a empresa ${idEmpresa}`);
            const empresa = await this.empresaRepository.findOne({
                where: { id_empresa_prov: idEmpresa }
            });
            if (!empresa) {
                throw new Error('Empresa no encontrada');
            }
            const ejecutiva = await this.ejecutivaRepository.findOne({
                where: {
                    id_ejecutiva: idEjecutiva,
                    estado_ejecutiva: 'Activo'
                }
            });
            if (!ejecutiva) {
                throw new Error('Ejecutiva no encontrada o no disponible');
            }
            ejecutiva.id_empresa_prov = idEmpresa;
            await this.ejecutivaRepository.save(ejecutiva);
            console.log(`✅ [EmpresasService] Ejecutiva ${idEjecutiva} asignada a empresa ${idEmpresa}`);
            return {
                success: true,
                message: 'Ejecutiva asignada correctamente',
                empresa: empresa.razon_social,
                ejecutiva: ejecutiva.nombre_completo
            };
        }
        catch (error) {
            console.error('❌ [EmpresasService] Error asignando ejecutiva:', error);
            throw new Error(error.message || 'Error al asignar ejecutiva');
        }
    }
    async getEjecutivasDisponibles() {
        console.log('🔄 [EmpresasService] Buscando ejecutivas disponibles...');
        const ejecutivasDisponibles = await this.ejecutivaRepository
            .createQueryBuilder('ejecutiva')
            .leftJoinAndSelect('ejecutiva.empresa_proveedora', 'empresa')
            .where('ejecutiva.estado_ejecutiva = :estado', { estado: 'Activo' })
            .andWhere('empresa.id_empresa_prov IS NULL')
            .orderBy('ejecutiva.nombre_completo', 'ASC')
            .getMany();
        console.log(`✅ [EmpresasService] Ejecutivas disponibles encontradas: ${ejecutivasDisponibles.length}`);
        const ejecutivasFormateadas = ejecutivasDisponibles.map(ejecutiva => ({
            id_ejecutiva: ejecutiva.id_ejecutiva,
            id_usuario: ejecutiva.id_ejecutiva,
            nombre_completo: ejecutiva.nombre_completo,
            nombre: ejecutiva.nombre_completo?.split(' ')[0] || '',
            apellido: ejecutiva.nombre_completo?.split(' ').slice(1).join(' ') || '',
            correo: ejecutiva.correo,
            email: ejecutiva.correo,
            telefono: ejecutiva.telefono,
            dni: ejecutiva.dni,
            estado_ejecutiva: ejecutiva.estado_ejecutiva,
            activo: ejecutiva.estado_ejecutiva === 'Activo',
            rol: 'ejecutiva'
        }));
        return ejecutivasFormateadas;
    }
    async addEjecutivaToEmpresa(empresaId, ejecutivaId) {
        console.log('➕ [EmpresasService] Asignando ejecutiva:', { empresaId, ejecutivaId });
        try {
            const empresa = await this.empresaRepository.findOne({
                where: { id_empresa_prov: empresaId }
            });
            if (!empresa) {
                throw new common_1.HttpException('Empresa no encontrada', common_1.HttpStatus.NOT_FOUND);
            }
            const ejecutiva = await this.ejecutivaRepository.findOne({
                where: {
                    id_ejecutiva: ejecutivaId,
                    estado_ejecutiva: 'Activo'
                },
                relations: ['empresa_proveedora']
            });
            if (!ejecutiva) {
                throw new common_1.HttpException('Ejecutiva no encontrada o inactiva', common_1.HttpStatus.NOT_FOUND);
            }
            if (ejecutiva.empresa_proveedora?.id_empresa_prov === empresaId) {
                throw new common_1.HttpException('Esta ejecutiva ya está asignada a esta empresa', common_1.HttpStatus.BAD_REQUEST);
            }
            if (ejecutiva.empresa_proveedora && ejecutiva.empresa_proveedora.id_empresa_prov !== empresaId) {
                throw new common_1.HttpException(`La ejecutiva ya está asignada a: ${ejecutiva.empresa_proveedora.razon_social}`, common_1.HttpStatus.BAD_REQUEST);
            }
            ejecutiva.empresa_proveedora = empresa;
            ejecutiva.fecha_actualizacion = new Date();
            await this.ejecutivaRepository.save(ejecutiva);
            console.log('✅ [EmpresasService] Ejecutiva asignada exitosamente');
            return {
                success: true,
                message: 'Ejecutiva asignada correctamente a la empresa',
                ejecutiva: {
                    id_ejecutiva: ejecutiva.id_ejecutiva,
                    nombre_completo: ejecutiva.nombre_completo,
                    correo: ejecutiva.correo
                }
            };
        }
        catch (error) {
            console.error('❌ [EmpresasService] Error asignando ejecutiva:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Error interno al asignar ejecutiva', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async removeEjecutivaFromEmpresa(empresaId, ejecutivaId) {
        const ejecutiva = await this.ejecutivaRepository.findOne({
            where: {
                id_ejecutiva: ejecutivaId,
                empresa_proveedora: { id_empresa_prov: empresaId }
            },
            relations: ['empresa_proveedora']
        });
        if (!ejecutiva) {
            throw new common_1.HttpException('Ejecutiva no encontrada en esta empresa', common_1.HttpStatus.NOT_FOUND);
        }
        ejecutiva.empresa_proveedora = null;
        ejecutiva.fecha_actualizacion = new Date();
        await this.ejecutivaRepository.save(ejecutiva);
        return { message: 'Ejecutiva removida correctamente de la empresa' };
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