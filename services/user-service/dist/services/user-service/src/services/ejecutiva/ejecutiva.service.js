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
exports.EjecutivaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Ejecutiva_entity_1 = require("../../../../../shared/entities/Ejecutiva.entity");
const EmpresaProveedora_entity_1 = require("../../../../../shared/entities/EmpresaProveedora.entity");
const ClienteFinal_entity_1 = require("../../../../../shared/entities/ClienteFinal.entity");
const Trazabilidad_entity_1 = require("../../../../../shared/entities/Trazabilidad.entity");
const PersonaContacto_entity_1 = require("../../../../../shared/entities/PersonaContacto.entity");
let EjecutivaService = class EjecutivaService {
    constructor(ejecutivaRepository, empresaRepository, clienteRepository, trazabilidadRepository, contactoRepository) {
        this.ejecutivaRepository = ejecutivaRepository;
        this.empresaRepository = empresaRepository;
        this.clienteRepository = clienteRepository;
        this.trazabilidadRepository = trazabilidadRepository;
        this.contactoRepository = contactoRepository;
    }
    async getStats(ejecutivaId) {
        try {
            const id = parseInt(ejecutivaId);
            const ejecutiva = await this.ejecutivaRepository.findOne({
                where: { id_ejecutiva: id, estado_ejecutiva: 'Activo' }
            });
            if (!ejecutiva) {
                throw new common_1.HttpException('Ejecutiva no encontrada', common_1.HttpStatus.NOT_FOUND);
            }
            const totalClientes = await this.clienteRepository.count({
                where: { ejecutiva: { id_ejecutiva: id } }
            });
            const actividadesMes = await this.trazabilidadRepository.count({
                where: {
                    ejecutiva: { id_ejecutiva: id },
                    fecha_contacto: (0, typeorm_2.MoreThanOrEqual)(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
                }
            });
            const revenueResult = await this.trazabilidadRepository
                .createQueryBuilder('t')
                .select('COALESCE(SUM(t.monto_cierre_final), 0)', 'revenue')
                .where('t.id_ejecutiva = :id', { id })
                .andWhere('t.etapa_oportunidad = :etapa', { etapa: 'Venta ganada' })
                .getRawOne();
            const pipelineCount = await this.trazabilidadRepository.count({
                where: {
                    ejecutiva: { id_ejecutiva: id },
                    etapa_oportunidad: (0, typeorm_3.Not)((0, typeorm_3.In)(['Venta ganada', 'Venta perdida', 'Venta suspendida'])),
                    nombre_oportunidad: (0, typeorm_3.Not)((0, typeorm_3.IsNull)())
                }
            });
            return {
                totalEmpresas: ejecutiva.empresa_proveedora ? 1 : 0,
                totalClientes,
                actividadesMes,
                pipelineCount,
                revenueGenerado: parseFloat(revenueResult.revenue),
                empresaAsignada: ejecutiva.empresa_proveedora ? true : false
            };
        }
        catch (error) {
            console.error('Error en getStats:', error);
            throw new common_1.HttpException('Error al obtener estadísticas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmpresas(ejecutivaId) {
        try {
            const id = parseInt(ejecutivaId);
            const ejecutiva = await this.ejecutivaRepository.findOne({
                where: { id_ejecutiva: id },
                relations: ['empresa_proveedora']
            });
            if (!ejecutiva || !ejecutiva.empresa_proveedora) {
                return [];
            }
            const totalClientes = await this.clienteRepository.count({
                where: { ejecutiva: { id_ejecutiva: id } }
            });
            return [{
                    ...ejecutiva.empresa_proveedora,
                    total_clientes: totalClientes
                }];
        }
        catch (error) {
            console.error('Error en getEmpresas:', error);
            throw new common_1.HttpException('Error al obtener empresas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createEmpresa(data) {
        const id = parseInt(data.ejecutivaId);
        const ejecutiva = await this.ejecutivaRepository.findOne({
            where: { id_ejecutiva: id, estado_ejecutiva: 'Activo' }
        });
        if (!ejecutiva) {
            throw new common_1.HttpException('Ejecutiva no encontrada', common_1.HttpStatus.NOT_FOUND);
        }
        if (ejecutiva.empresa_proveedora) {
            throw new common_1.HttpException('La ejecutiva ya tiene una empresa asignada', common_1.HttpStatus.BAD_REQUEST);
        }
        const existingRuc = await this.empresaRepository.findOne({
            where: { ruc: data.ruc }
        });
        if (existingRuc) {
            throw new common_1.HttpException('Ya existe una empresa con este RUC', common_1.HttpStatus.BAD_REQUEST);
        }
        const nuevaEmpresa = this.empresaRepository.create({
            ruc: data.ruc,
            razon_social: data.razon_social,
            direccion: data.direccion,
            telefono: data.telefono,
            correo: data.correo,
            contraseña: 'temp_password_123',
            estado: 'Activo'
        });
        const empresaGuardada = await this.empresaRepository.save(nuevaEmpresa);
        ejecutiva.empresa_proveedora = empresaGuardada;
        await this.ejecutivaRepository.save(ejecutiva);
        return empresaGuardada;
    }
    async getClientes(ejecutivaId) {
        try {
            const id = parseInt(ejecutivaId);
            const clientes = await this.clienteRepository.find({
                where: { ejecutiva: { id_ejecutiva: id } },
                relations: ['personas_contacto'],
                order: { razon_social: 'ASC' }
            });
            const clientesConStats = await Promise.all(clientes.map(async (cliente) => {
                const totalActividades = await this.trazabilidadRepository.count({
                    where: { cliente_final: { id_cliente_final: cliente.id_cliente_final } }
                });
                const ultimaActividad = await this.trazabilidadRepository.findOne({
                    where: { cliente_final: { id_cliente_final: cliente.id_cliente_final } },
                    order: { fecha_contacto: 'DESC' },
                    relations: ['contacto']
                });
                return {
                    ...cliente,
                    total_actividades: totalActividades,
                    contacto_principal: cliente.personas_contacto?.[0] || null,
                    ultima_actividad: ultimaActividad ? {
                        fecha: ultimaActividad.fecha_contacto,
                        tipo: ultimaActividad.tipo_contacto,
                        resultado: ultimaActividad.resultado_contacto,
                        persona_contacto: ultimaActividad.persona_contacto ? {
                            id: ultimaActividad.persona_contacto.id_contacto,
                            nombre_completo: ultimaActividad.persona_contacto.nombre_completo,
                            email: ultimaActividad.persona_contacto.correo,
                            telefono: ultimaActividad.persona_contacto.telefono
                        } : null
                    } : null
                };
            }));
            return clientesConStats;
        }
        catch (error) {
            console.error('Error en getClientes:', error);
            throw new common_1.HttpException('Error al obtener clientes', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createCliente(data) {
        const idEjecutiva = parseInt(data.id_ejecutiva);
        const idEmpresa = parseInt(data.id_empresa);
        const ejecutiva = await this.ejecutivaRepository.findOne({
            where: {
                id_ejecutiva: idEjecutiva,
                empresa_proveedora: { id_empresa_prov: idEmpresa }
            },
            relations: ['empresa_proveedora']
        });
        if (!ejecutiva) {
            throw new common_1.HttpException('Empresa no asignada a esta ejecutiva', common_1.HttpStatus.FORBIDDEN);
        }
        const existingRuc = await this.clienteRepository.findOne({
            where: { ruc: data.ruc }
        });
        if (existingRuc) {
            throw new common_1.HttpException('Ya existe un cliente con este RUC', common_1.HttpStatus.BAD_REQUEST);
        }
        const nuevoCliente = this.clienteRepository.create({
            ruc: data.ruc,
            razon_social: data.razon_social,
            direccion: data.direccion,
            telefono: data.telefono,
            correo: data.correo,
            ejecutiva: ejecutiva
        });
        return await this.clienteRepository.save(nuevoCliente);
    }
    async getPipeline(ejecutivaId) {
        try {
            const id = parseInt(ejecutivaId);
            const pipeline = await this.trazabilidadRepository.find({
                where: {
                    ejecutiva: { id_ejecutiva: id },
                    etapa_oportunidad: (0, typeorm_3.Not)((0, typeorm_3.In)(['Venta ganada', 'Venta perdida', 'Venta suspendida'])),
                    nombre_oportunidad: (0, typeorm_3.Not)((0, typeorm_3.IsNull)())
                },
                relations: ['cliente_final', 'persona_contacto', 'empresa_proveedora'],
                order: { fecha_cierre_esperado: 'ASC' }
            });
            const pipelinePorEtapa = pipeline.reduce((acc, oportunidad) => {
                const etapa = oportunidad.etapa_oportunidad || 'Sin etapa';
                if (!acc[etapa]) {
                    acc[etapa] = [];
                }
                acc[etapa].push(oportunidad);
                return acc;
            }, {});
            const totalMontoPipeline = pipeline.reduce((sum, op) => sum + (op.monto_total_sin_imp || 0), 0);
            const totalOportunidades = pipeline.length;
            return {
                oportunidades: pipeline,
                agrupado_por_etapa: pipelinePorEtapa,
                metricas: {
                    total_oportunidades: totalOportunidades,
                    total_monto_pipeline: totalMontoPipeline,
                    promedio_probabilidad: pipeline.length > 0
                        ? pipeline.reduce((sum, op) => sum + (op.probabilidad_cierre || 0), 0) / pipeline.length
                        : 0
                }
            };
        }
        catch (error) {
            console.error('Error en getPipeline:', error);
            throw new common_1.HttpException('Error al obtener pipeline', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getActividadesRecientes(ejecutivaId, limit = 10) {
        try {
            const id = parseInt(ejecutivaId);
            const actividades = await this.trazabilidadRepository.find({
                where: {
                    ejecutiva: { id_ejecutiva: id }
                },
                relations: ['cliente_final', 'persona_contacto', 'empresa_proveedora'],
                order: { fecha_contacto: 'DESC' },
                take: limit
            });
            return actividades.map(actividad => ({
                id: actividad.id_trazabilidad,
                fecha: actividad.fecha_contacto,
                tipo_contacto: actividad.tipo_contacto,
                resultado: actividad.resultado_contacto,
                cliente: actividad.cliente_final?.razon_social,
                persona_contacto: actividad.persona_contacto ? {
                    id: actividad.persona_contacto.id_contacto,
                    nombre_completo: actividad.persona_contacto.nombre_completo,
                    email: actividad.persona_contacto?.correo || null,
                    telefono: actividad.persona_contacto?.telefono || null
                } : null,
                oportunidad: actividad.nombre_oportunidad,
                etapa: actividad.etapa_oportunidad,
                observaciones: actividad.observaciones
                    ? actividad.observaciones.substring(0, 100) + (actividad.observaciones.length > 100 ? '...' : '')
                    : null
            }));
        }
        catch (error) {
            console.error('Error en getActividadesRecientes:', error);
            throw new common_1.HttpException('Error al obtener actividades', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getKPIsSemanales(ejecutivaId) {
        try {
            const id = parseInt(ejecutivaId);
            const inicioSemana = new Date();
            inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
            const actividadesSemana = await this.trazabilidadRepository.count({
                where: {
                    ejecutiva: { id_ejecutiva: id },
                    fecha_contacto: (0, typeorm_2.MoreThanOrEqual)(inicioSemana)
                }
            });
            const nuevasOportunidades = await this.trazabilidadRepository.count({
                where: {
                    ejecutiva: { id_ejecutiva: id },
                    fecha_registro_oportunidad: (0, typeorm_2.MoreThanOrEqual)(inicioSemana),
                    nombre_oportunidad: (0, typeorm_3.Not)((0, typeorm_3.IsNull)())
                }
            });
            const reunionesAgendadas = await this.trazabilidadRepository.count({
                where: {
                    ejecutiva: { id_ejecutiva: id },
                    reunion_agendada: true,
                    fecha_reunion: (0, typeorm_2.MoreThanOrEqual)(inicioSemana)
                }
            });
            return {
                actividades_semana: actividadesSemana,
                nuevas_oportunidades: nuevasOportunidades,
                reuniones_agendadas: reunionesAgendadas,
                inicio_semana: inicioSemana
            };
        }
        catch (error) {
            console.error('Error en getKPIsSemanales:', error);
            throw new common_1.HttpException('Error al obtener KPIs semanales', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.EjecutivaService = EjecutivaService;
exports.EjecutivaService = EjecutivaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Ejecutiva_entity_1.Ejecutiva)),
    __param(1, (0, typeorm_1.InjectRepository)(EmpresaProveedora_entity_1.EmpresaProveedora)),
    __param(2, (0, typeorm_1.InjectRepository)(ClienteFinal_entity_1.ClienteFinal)),
    __param(3, (0, typeorm_1.InjectRepository)(Trazabilidad_entity_1.Trazabilidad)),
    __param(4, (0, typeorm_1.InjectRepository)(PersonaContacto_entity_1.PersonaContacto)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EjecutivaService);
const typeorm_3 = require("typeorm");
//# sourceMappingURL=ejecutiva.service.js.map