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
exports.ClientesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ClienteFinal_entity_1 = require("../../../../../shared/entities/ClienteFinal.entity");
const Ejecutiva_entity_1 = require("../../../../../shared/entities/Ejecutiva.entity");
const EmpresaProveedora_entity_1 = require("../../../../../shared/entities/EmpresaProveedora.entity");
let ClientesService = class ClientesService {
    constructor(clienteRepository, ejecutivaRepository, empresaProveedoraRepository) {
        this.clienteRepository = clienteRepository;
        this.ejecutivaRepository = ejecutivaRepository;
        this.empresaProveedoraRepository = empresaProveedoraRepository;
    }
    async findAll() {
        try {
            console.log('📋 [ClientesService] Obteniendo todos los clientes finales...');
            const clientes = await this.clienteRepository
                .createQueryBuilder('cf')
                .leftJoinAndSelect('cf.ejecutiva', 'ejecutiva')
                .leftJoinAndSelect('cf.empresa_proveedora', 'empresa')
                .orderBy('cf.fecha_creacion', 'DESC')
                .getMany();
            console.log(`✅ [ClientesService] ${clientes.length} clientes básicos encontrados`);
            const clientesConCounts = await Promise.all(clientes.map(async (cliente) => {
                const count = await this.clienteRepository
                    .createQueryBuilder('cf')
                    .leftJoin('cf.trazabilidades', 'trazabilidad')
                    .where('cf.id_cliente_final = :id', { id: cliente.id_cliente_final })
                    .select('COUNT(trazabilidad.id_trazabilidad)', 'count')
                    .getRawOne();
                return {
                    ...cliente,
                    ejecutiva_nombre: cliente.ejecutiva?.nombre_completo || 'Sin asignar',
                    empresa_nombre: cliente.empresa_proveedora?.razon_social || 'Sin asignar',
                    total_actividades: parseInt(count?.count) || 0
                };
            }));
            console.log(`✅ [ClientesService] ${clientesConCounts.length} clientes procesados con counts`);
            if (clientesConCounts.length > 0) {
                console.log('📊 Estructura completa del primer cliente:', JSON.stringify(clientesConCounts[0], null, 2));
            }
            return clientesConCounts;
        }
        catch (error) {
            console.error('❌ [ClientesService] Error detallado:', error);
            throw new common_1.HttpException(`Error al obtener clientes finales: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            console.log(`🔍 [ClientesService] Buscando cliente con ID: ${id}`);
            const cliente = await this.clienteRepository.findOne({
                where: { id_cliente_final: id },
                relations: ['ejecutiva', 'empresa_proveedora', 'trazabilidades']
            });
            if (!cliente) {
                throw new common_1.NotFoundException(`Cliente con ID ${id} no encontrado`);
            }
            const totalActividades = cliente.trazabilidades?.length || 0;
            console.log(`✅ [ClientesService] Cliente encontrado: ${cliente.razon_social}`);
            return {
                ...cliente,
                total_actividades: totalActividades,
                ejecutiva_nombre: cliente.ejecutiva?.nombre_completo,
                empresa_nombre: cliente.empresa_proveedora?.razon_social,
                estado: cliente.estado
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            console.error('❌ [ClientesService] Error al obtener cliente:', error);
            throw new common_1.HttpException('Error al obtener el cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(data) {
        try {
            console.log('➕ [ClientesService] Creando nuevo cliente:', data.razon_social);
            if (!data.razon_social) {
                throw new common_1.HttpException('La razón social es obligatoria', common_1.HttpStatus.BAD_REQUEST);
            }
            if (!data.id_ejecutiva) {
                throw new common_1.HttpException('Debe asignar una ejecutiva', common_1.HttpStatus.BAD_REQUEST);
            }
            if (!data.id_empresa_prov) {
                throw new common_1.HttpException('Debe asignar una empresa proveedora', common_1.HttpStatus.BAD_REQUEST);
            }
            const ejecutiva = await this.ejecutivaRepository.findOne({
                where: { id_ejecutiva: data.id_ejecutiva }
            });
            if (!ejecutiva) {
                throw new common_1.HttpException('La ejecutiva seleccionada no existe', common_1.HttpStatus.BAD_REQUEST);
            }
            const empresa = await this.empresaProveedoraRepository.findOne({
                where: { id_empresa_prov: data.id_empresa_prov }
            });
            if (!empresa) {
                throw new common_1.HttpException('La empresa proveedora seleccionada no existe', common_1.HttpStatus.BAD_REQUEST);
            }
            if (data.ruc) {
                const existeRuc = await this.clienteRepository.findOne({
                    where: { ruc: data.ruc, empresa_proveedora: { id_empresa_prov: data.id_empresa_prov } }
                });
                if (existeRuc) {
                    throw new common_1.HttpException('Ya existe un cliente con ese RUC en esta empresa', common_1.HttpStatus.CONFLICT);
                }
            }
            const nuevoCliente = this.clienteRepository.create({
                ruc: data.ruc || null,
                razon_social: data.razon_social,
                pagina_web: data.pagina_web || null,
                correo: data.correo || null,
                telefono: data.telefono || null,
                pais: data.pais || 'Perú',
                departamento: data.departamento || null,
                provincia: data.provincia || null,
                direccion: data.direccion || null,
                linkedin: data.linkedin || null,
                grupo_economico: data.grupo_economico || null,
                rubro: data.rubro || null,
                sub_rubro: data.sub_rubro || null,
                tamanio_empresa: data.tamanio_empresa || null,
                facturacion_anual: data.facturacion_anual || null,
                cantidad_empleados: data.cantidad_empleados || null,
                logo: data.logo || null,
                ejecutiva: ejecutiva,
                empresa_proveedora: empresa,
                estado: 'Activo'
            });
            const clienteGuardado = await this.clienteRepository.save(nuevoCliente);
            console.log(`✅ [ClientesService] Cliente creado con ID: ${clienteGuardado.id_cliente_final}`);
            return {
                ...clienteGuardado,
                ejecutiva_nombre: ejecutiva.nombre_completo,
                empresa_nombre: empresa.razon_social,
                total_actividades: 0,
                estado: 'Activo'
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            console.error('❌ [ClientesService] Error al crear cliente:', error);
            throw new common_1.HttpException(error.message || 'Error al crear el cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, data) {
        try {
            console.log(`📝 [ClientesService] Actualizando cliente ID: ${id}`);
            const cliente = await this.clienteRepository.findOne({
                where: { id_cliente_final: id },
                relations: ['ejecutiva', 'empresa_proveedora']
            });
            if (!cliente) {
                throw new common_1.NotFoundException(`Cliente con ID ${id} no encontrado`);
            }
            if (data.estado && !['Activo', 'Inactivo'].includes(data.estado)) {
                throw new common_1.HttpException('Estado inválido. Use: Activo o Inactivo', common_1.HttpStatus.BAD_REQUEST);
            }
            if (data.ruc !== undefined)
                cliente.ruc = data.ruc;
            if (data.razon_social)
                cliente.razon_social = data.razon_social;
            if (data.pagina_web !== undefined)
                cliente.pagina_web = data.pagina_web;
            if (data.correo !== undefined)
                cliente.correo = data.correo;
            if (data.telefono !== undefined)
                cliente.telefono = data.telefono;
            if (data.pais !== undefined)
                cliente.pais = data.pais;
            if (data.departamento !== undefined)
                cliente.departamento = data.departamento;
            if (data.provincia !== undefined)
                cliente.provincia = data.provincia;
            if (data.direccion !== undefined)
                cliente.direccion = data.direccion;
            if (data.linkedin !== undefined)
                cliente.linkedin = data.linkedin;
            if (data.grupo_economico !== undefined)
                cliente.grupo_economico = data.grupo_economico;
            if (data.rubro !== undefined)
                cliente.rubro = data.rubro;
            if (data.sub_rubro !== undefined)
                cliente.sub_rubro = data.sub_rubro;
            if (data.tamanio_empresa !== undefined)
                cliente.tamanio_empresa = data.tamanio_empresa;
            if (data.facturacion_anual !== undefined)
                cliente.facturacion_anual = data.facturacion_anual;
            if (data.cantidad_empleados !== undefined)
                cliente.cantidad_empleados = data.cantidad_empleados;
            if (data.logo !== undefined)
                cliente.logo = data.logo;
            if (data.estado !== undefined) {
                cliente.estado = data.estado;
            }
            cliente.fecha_actualizacion = new Date();
            const clienteActualizado = await this.clienteRepository.save(cliente);
            console.log(`✅ [ClientesService] Cliente actualizado: ${clienteActualizado.razon_social}`);
            return {
                ...clienteActualizado,
                ejecutiva_nombre: clienteActualizado.ejecutiva?.nombre_completo,
                empresa_nombre: clienteActualizado.empresa_proveedora?.razon_social,
                estado: clienteActualizado.estado
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            console.error('❌ [ClientesService] Error al actualizar cliente:', error);
            throw new common_1.HttpException('Error al actualizar el cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async activate(id) {
        try {
            console.log(`🔄 [ClientesService] Activando cliente ID: ${id}`);
            const cliente = await this.clienteRepository.findOne({
                where: { id_cliente_final: id }
            });
            if (!cliente) {
                throw new common_1.NotFoundException(`Cliente con ID ${id} no encontrado`);
            }
            if (cliente.estado === 'Activo') {
                throw new common_1.HttpException('El cliente ya se encuentra activo', common_1.HttpStatus.BAD_REQUEST);
            }
            await this.clienteRepository.update(id, {
                estado: 'Activo',
                fecha_actualizacion: new Date()
            });
            console.log(`✅ [ClientesService] Cliente activado: ${cliente.razon_social}`);
            return {
                success: true,
                message: 'Cliente activado exitosamente',
                cliente: {
                    id_cliente_final: id,
                    razon_social: cliente.razon_social,
                    estado: 'Activo'
                }
            };
        }
        catch (error) {
            console.error('❌ [ClientesService] Error al activar cliente:', error);
            if (error instanceof common_1.NotFoundException || error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Error al activar el cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deactivate(id) {
        try {
            console.log(`🔄 [ClientesService] Desactivando cliente ID: ${id}`);
            const cliente = await this.clienteRepository.findOne({
                where: { id_cliente_final: id }
            });
            if (!cliente) {
                throw new common_1.NotFoundException(`Cliente con ID ${id} no encontrado`);
            }
            if (cliente.estado === 'Inactivo') {
                throw new common_1.HttpException('El cliente ya se encuentra inactivo', common_1.HttpStatus.BAD_REQUEST);
            }
            await this.clienteRepository.update(id, {
                estado: 'Inactivo',
                fecha_actualizacion: new Date()
            });
            console.log(`✅ [ClientesService] Cliente desactivado: ${cliente.razon_social}`);
            return {
                success: true,
                message: 'Cliente desactivado exitosamente',
                cliente: {
                    id_cliente_final: id,
                    razon_social: cliente.razon_social,
                    estado: 'Inactivo'
                }
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.HttpException) {
                throw error;
            }
            console.error('❌ [ClientesService] Error al desactivar cliente:', error);
            throw new common_1.HttpException('Error al desactivar el cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ClientesService = ClientesService;
exports.ClientesService = ClientesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ClienteFinal_entity_1.ClienteFinal)),
    __param(1, (0, typeorm_1.InjectRepository)(Ejecutiva_entity_1.Ejecutiva)),
    __param(2, (0, typeorm_1.InjectRepository)(EmpresaProveedora_entity_1.EmpresaProveedora)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ClientesService);
//# sourceMappingURL=clientes.service.js.map