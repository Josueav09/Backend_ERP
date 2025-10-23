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
exports.EjecutivasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Ejecutiva_entity_1 = require("../../../../../shared/entities/Ejecutiva.entity");
const EmpresaProveedora_entity_1 = require("../../../../../shared/entities/EmpresaProveedora.entity");
const ClienteFinal_entity_1 = require("../../../../../shared/entities/ClienteFinal.entity");
const Trazabilidad_entity_1 = require("../../../../../shared/entities/Trazabilidad.entity");
const Jefe_entity_1 = require("../../../../../shared/entities/Jefe.entity");
let EjecutivasService = class EjecutivasService {
    constructor(ejecutivaRepository, empresaRepository, clienteRepository, trazabilidadRepository, jefeRepository) {
        this.ejecutivaRepository = ejecutivaRepository;
        this.empresaRepository = empresaRepository;
        this.clienteRepository = clienteRepository;
        this.trazabilidadRepository = trazabilidadRepository;
        this.jefeRepository = jefeRepository;
    }
    async getEjecutivas() {
        const ejecutivas = await this.ejecutivaRepository.find({
            relations: ['empresa_proveedora'],
            order: { estado_ejecutiva: 'DESC', nombre_completo: 'ASC' }
        });
        const ejecutivasConStats = await Promise.all(ejecutivas.map(async (ejecutiva) => {
            const [totalClientes, totalActividades] = await Promise.all([
                this.clienteRepository.count({
                    where: { ejecutiva: { id_ejecutiva: ejecutiva.id_ejecutiva } }
                }),
                this.trazabilidadRepository.count({
                    where: { ejecutiva: { id_ejecutiva: ejecutiva.id_ejecutiva } }
                })
            ]);
            return {
                ...ejecutiva,
                total_clientes: totalClientes,
                total_actividades: totalActividades,
                empresa_asignada: ejecutiva.empresa_proveedora ? ejecutiva.empresa_proveedora.razon_social : 'Sin asignar'
            };
        }));
        return ejecutivasConStats;
    }
    async getEjecutivaById(id) {
        const ejecutiva = await this.ejecutivaRepository.findOne({
            where: { id_ejecutiva: id },
            relations: ['empresa_proveedora', 'clientes_finales', 'clientes_finales.empresa_proveedora']
        });
        if (!ejecutiva) {
            return null;
        }
        const [totalActividades, actividadesRecientes] = await Promise.all([
            this.trazabilidadRepository.count({
                where: { ejecutiva: { id_ejecutiva: id } }
            }),
            this.trazabilidadRepository.find({
                where: { ejecutiva: { id_ejecutiva: id } },
                order: { fecha_contacto: 'DESC' },
                take: 10,
                relations: ['cliente_final']
            })
        ]);
        const empresasAsociadas = ejecutiva.empresa_proveedora ? [{
                id_empresa: ejecutiva.empresa_proveedora.id_empresa_prov,
                nombre_empresa: ejecutiva.empresa_proveedora.razon_social,
                rut: ejecutiva.empresa_proveedora.ruc,
                fecha_asignacion: ejecutiva.fecha_creacion,
                asignacion_activa: true
            }] : [];
        const clientesAsignados = ejecutiva.clientes_finales.map(cliente => ({
            id_cliente: cliente.id_cliente_final,
            nombre_cliente: cliente.razon_social,
            rut_cliente: cliente.ruc,
            email: cliente.correo,
            telefono: cliente.telefono,
            estado: cliente.estado || 'activo',
            nombre_empresa: cliente.empresa_proveedora?.razon_social || 'N/A',
            fecha_registro: cliente.fecha_creacion
        }));
        return {
            ejecutiva: {
                ...ejecutiva,
                empresa_asignada: ejecutiva.empresa_proveedora ? ejecutiva.empresa_proveedora.razon_social : 'Sin asignar',
                empresa_nombre: ejecutiva.empresa_proveedora ? ejecutiva.empresa_proveedora.razon_social : 'Sin asignar'
            },
            estadisticas: {
                total_clientes: ejecutiva.clientes_finales.length,
                total_actividades: totalActividades,
                actividades_recientes: actividadesRecientes
            },
            empresas: empresasAsociadas,
            clientes: clientesAsignados
        };
    }
    async createEjecutiva(data) {
        console.log('📥 Datos recibidos en backend:', data);
        const { dni, nombre_completo, correo, contraseña, telefono, id_jefe } = data;
        console.log('🔍 Buscando jefe con ID:', id_jefe);
        let jefeAsignar;
        if (id_jefe) {
            jefeAsignar = await this.jefeRepository.findOne({
                where: { id_jefe: id_jefe }
            });
            console.log('✅ Jefe encontrado:', jefeAsignar);
        }
        if (!jefeAsignar) {
            console.log('⚠️  No se encontró jefe específico, buscando primero disponible...');
            jefeAsignar = await this.jefeRepository.findOne({
                order: { id_jefe: 'ASC' }
            });
            console.log('✅ Primer jefe disponible:', jefeAsignar);
        }
        if (!jefeAsignar) {
            console.error('❌ No hay jefes en el sistema');
            throw new common_1.HttpException('No hay jefes disponibles en el sistema', common_1.HttpStatus.BAD_REQUEST);
        }
        const existingDni = await this.ejecutivaRepository.findOne({
            where: { dni }
        });
        if (existingDni) {
            throw new common_1.HttpException('Ya existe una ejecutiva con este DNI', common_1.HttpStatus.BAD_REQUEST);
        }
        const existingEmail = await this.ejecutivaRepository.findOne({
            where: { correo }
        });
        if (existingEmail) {
            throw new common_1.HttpException('Ya existe una ejecutiva con este email', common_1.HttpStatus.BAD_REQUEST);
        }
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        const nuevaEjecutiva = this.ejecutivaRepository.create({
            dni,
            nombre_completo,
            correo,
            contraseña: hashedPassword,
            telefono: telefono || null,
            estado_ejecutiva: 'Activo',
            jefe: jefeAsignar,
        });
        console.log('Nueva Ejecutiva:', nuevaEjecutiva, 'Jefe asignado:', jefeAsignar);
        return await this.ejecutivaRepository.save(nuevaEjecutiva);
    }
    async updateEjecutiva(id, data) {
        const ejecutiva = await this.ejecutivaRepository.findOne({
            where: { id_ejecutiva: id }
        });
        if (!ejecutiva) {
            return null;
        }
        if (data.nombre_completo)
            ejecutiva.nombre_completo = data.nombre_completo;
        if (data.telefono !== undefined)
            ejecutiva.telefono = data.telefono;
        if (data.linkedin !== undefined)
            ejecutiva.linkedin = data.linkedin;
        if (data.estado_ejecutiva)
            ejecutiva.estado_ejecutiva = data.estado_ejecutiva;
        ejecutiva.fecha_actualizacion = new Date();
        return await this.ejecutivaRepository.save(ejecutiva);
    }
    async deleteEjecutiva(id) {
        const ejecutiva = await this.ejecutivaRepository.findOne({
            where: { id_ejecutiva: id }
        });
        if (!ejecutiva) {
            return null;
        }
        ejecutiva.estado_ejecutiva = 'Inactivo';
        ejecutiva.fecha_actualizacion = new Date();
        return await this.ejecutivaRepository.save(ejecutiva);
    }
    async getEjecutivasDisponibles() {
        try {
            console.log('🔍 [EjecutivasService] Buscando ejecutivas disponibles...');
            const ejecutivasDisponibles = await this.ejecutivaRepository.find({
                where: {
                    estado_ejecutiva: 'Activo',
                    id_empresa_prov: (0, typeorm_2.IsNull)()
                },
                relations: ['jefe'],
                order: { nombre_completo: 'ASC' }
            });
            console.log('✅ [EjecutivasService] Ejecutivas encontradas:', ejecutivasDisponibles.length);
            const ejecutivasValidas = ejecutivasDisponibles.filter(ej => ej.id_ejecutiva !== null && ej.id_ejecutiva !== undefined);
            console.log('✅ [EjecutivasService] Ejecutivas válidas:', ejecutivasValidas.length);
            if (ejecutivasValidas.length === 0) {
                return [];
            }
            const ejecutivasConStats = await Promise.all(ejecutivasValidas.map(async (ej) => {
                try {
                    const [totalClientes, totalActividades] = await Promise.all([
                        this.clienteRepository.count({
                            where: { ejecutiva: { id_ejecutiva: ej.id_ejecutiva } }
                        }),
                        this.trazabilidadRepository.count({
                            where: { ejecutiva: { id_ejecutiva: ej.id_ejecutiva } }
                        })
                    ]);
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
                        activo: ej.estado_ejecutiva === 'Activo',
                        total_empresas: 0,
                        total_clientes: totalClientes || 0,
                        total_actividades: totalActividades || 0,
                        fecha_creacion: ej.fecha_creacion,
                        fecha_actualizacion: ej.fecha_actualizacion
                    };
                }
                catch (error) {
                    console.error(`❌ Error procesando ejecutiva ${ej.id_ejecutiva}:`, error);
                    return null;
                }
            }));
            const resultado = ejecutivasConStats.filter(ej => ej !== null);
            console.log('✅ [EjecutivasService] Resultado final:', resultado.length);
            return resultado;
        }
        catch (error) {
            console.error('❌ [EjecutivasService] Error crítico:', error);
            throw error;
        }
    }
};
exports.EjecutivasService = EjecutivasService;
exports.EjecutivasService = EjecutivasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Ejecutiva_entity_1.Ejecutiva)),
    __param(1, (0, typeorm_1.InjectRepository)(EmpresaProveedora_entity_1.EmpresaProveedora)),
    __param(2, (0, typeorm_1.InjectRepository)(ClienteFinal_entity_1.ClienteFinal)),
    __param(3, (0, typeorm_1.InjectRepository)(Trazabilidad_entity_1.Trazabilidad)),
    __param(4, (0, typeorm_1.InjectRepository)(Jefe_entity_1.Jefe)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EjecutivasService);
//# sourceMappingURL=ejecutivas.service.js.map