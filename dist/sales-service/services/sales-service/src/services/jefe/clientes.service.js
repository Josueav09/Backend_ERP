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
const PersonaContacto_entity_1 = require("../../../../../shared/entities/PersonaContacto.entity");
const Trazabilidad_entity_1 = require("../../../../../shared/entities/Trazabilidad.entity");
let ClientesService = class ClientesService {
    constructor(clienteRepository, ejecutivaRepository, empresaRepository, contactoRepository, trazabilidadRepository) {
        this.clienteRepository = clienteRepository;
        this.ejecutivaRepository = ejecutivaRepository;
        this.empresaRepository = empresaRepository;
        this.contactoRepository = contactoRepository;
        this.trazabilidadRepository = trazabilidadRepository;
    }
    async getClientes() {
        const clientes = await this.clienteRepository.find({
            relations: ['ejecutiva', 'ejecutiva.empresa_proveedora', 'personas_contacto'],
            order: { fecha_creacion: 'DESC' }
        });
        const clientesConStats = await Promise.all(clientes.map(async (cliente) => {
            const totalActividades = await this.trazabilidadRepository.count({
                where: { cliente_final: { id_cliente_final: cliente.id_cliente_final } }
            });
            const ultimaActividad = await this.trazabilidadRepository.findOne({
                where: { cliente_final: { id_cliente_final: cliente.id_cliente_final } },
                order: { fecha_contacto: 'DESC' }
            });
            return {
                ...cliente,
                total_actividades: totalActividades,
                ultima_actividad: ultimaActividad?.fecha_contacto || null,
                ejecutiva_asignada: cliente.ejecutiva ? cliente.ejecutiva.nombre_completo : 'Sin asignar',
                empresa_proveedora: cliente.ejecutiva?.empresa_proveedora?.razon_social || 'Sin empresa'
            };
        }));
        return clientesConStats;
    }
    async getClienteById(id) {
        const cliente = await this.clienteRepository.findOne({
            where: { id_cliente_final: id },
            relations: [
                'ejecutiva',
                'ejecutiva.empresa_proveedora',
                'personas_contacto',
                'trazabilidades',
                'trazabilidades.persona_contacto',
                'trazabilidades.ejecutiva'
            ]
        });
        if (!cliente) {
            return null;
        }
        const actividadesRecientes = await this.trazabilidadRepository.find({
            where: { cliente_final: { id_cliente_final: id } },
            relations: ['persona_contacto', 'ejecutiva'],
            order: { fecha_contacto: 'DESC' },
            take: 20
        });
        return {
            cliente,
            actividades_recientes: actividadesRecientes,
            total_actividades: actividadesRecientes.length,
            personas_contacto: cliente.personas_contacto
        };
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
                where: {
                    id_ejecutiva: data.id_ejecutiva,
                    empresa_proveedora: { id_empresa_prov: data.id_empresa_prov }
                },
                relations: ['empresa_proveedora']
            });
            if (!ejecutiva) {
                throw new common_1.HttpException('La ejecutiva seleccionada no pertenece a la empresa proveedora especificada', common_1.HttpStatus.BAD_REQUEST);
            }
            const empresa = await this.empresaRepository.findOne({
                where: { id_empresa_prov: data.id_empresa_prov }
            });
            if (!empresa) {
                throw new common_1.HttpException('La empresa proveedora seleccionada no existe', common_1.HttpStatus.BAD_REQUEST);
            }
            if (data.ruc) {
                const existeRuc = await this.clienteRepository.findOne({
                    where: {
                        ruc: data.ruc,
                        empresa_proveedora: { id_empresa_prov: data.id_empresa_prov }
                    }
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
            console.error('❌ [ClientesService] Error al crear cliente:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Error al crear el cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateCliente(id, data) {
        const cliente = await this.clienteRepository.findOne({
            where: { id_cliente_final: id }
        });
        if (!cliente) {
            throw new common_1.HttpException('Cliente no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        if (data.ruc && data.ruc !== cliente.ruc) {
            const existingCliente = await this.clienteRepository.findOne({
                where: { ruc: data.ruc }
            });
            if (existingCliente) {
                throw new common_1.HttpException('Ya existe otro cliente con este RUC', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (data.id_ejecutiva) {
            const ejecutiva = await this.ejecutivaRepository.findOne({
                where: { id_ejecutiva: data.id_ejecutiva }
            });
            if (!ejecutiva) {
                throw new common_1.HttpException('Ejecutiva no encontrada', common_1.HttpStatus.BAD_REQUEST);
            }
            cliente.ejecutiva = ejecutiva;
        }
        if (data.razon_social)
            cliente.razon_social = data.razon_social;
        if (data.ruc !== undefined)
            cliente.ruc = data.ruc;
        if (data.correo !== undefined)
            cliente.correo = data.correo;
        if (data.telefono !== undefined)
            cliente.telefono = data.telefono;
        if (data.direccion !== undefined)
            cliente.direccion = data.direccion;
        if (data.rubro !== undefined)
            cliente.rubro = data.rubro;
        if (data.sub_rubro !== undefined)
            cliente.sub_rubro = data.sub_rubro;
        cliente.fecha_actualizacion = new Date();
        return await this.clienteRepository.save(cliente);
    }
};
exports.ClientesService = ClientesService;
exports.ClientesService = ClientesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ClienteFinal_entity_1.ClienteFinal)),
    __param(1, (0, typeorm_1.InjectRepository)(Ejecutiva_entity_1.Ejecutiva)),
    __param(2, (0, typeorm_1.InjectRepository)(EmpresaProveedora_entity_1.EmpresaProveedora)),
    __param(3, (0, typeorm_1.InjectRepository)(PersonaContacto_entity_1.PersonaContacto)),
    __param(4, (0, typeorm_1.InjectRepository)(Trazabilidad_entity_1.Trazabilidad)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ClientesService);
//# sourceMappingURL=clientes.service.js.map