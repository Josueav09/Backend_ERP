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
exports.EjecutivaTraceabilityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Trazabilidad_entity_1 = require("../../../../../shared/entities/Trazabilidad.entity");
const Ejecutiva_entity_1 = require("../../../../../shared/entities/Ejecutiva.entity");
const EmpresaProveedora_entity_1 = require("../../../../../shared/entities/EmpresaProveedora.entity");
const ClienteFinal_entity_1 = require("../../../../../shared/entities/ClienteFinal.entity");
const PersonaContacto_entity_1 = require("../../../../../shared/entities/PersonaContacto.entity");
let EjecutivaTraceabilityService = class EjecutivaTraceabilityService {
    constructor(trazabilidadRepository, ejecutivaRepository, empresaRepository, clienteRepository, contactoRepository) {
        this.trazabilidadRepository = trazabilidadRepository;
        this.ejecutivaRepository = ejecutivaRepository;
        this.empresaRepository = empresaRepository;
        this.clienteRepository = clienteRepository;
        this.contactoRepository = contactoRepository;
    }
    async getTrazabilidad(ejecutivaId) {
        try {
            const id = parseInt(ejecutivaId);
            const trazabilidad = await this.trazabilidadRepository.find({
                where: { id_ejecutiva: id },
                relations: [
                    'empresa_proveedora',
                    'cliente_final',
                    'persona_contacto'
                ],
                order: { fecha_contacto: 'DESC' },
                take: 50
            });
            return trazabilidad.map(registro => ({
                id_trazabilidad: registro.id_trazabilidad,
                fecha_contacto: registro.fecha_contacto,
                tipo_contacto: registro.tipo_contacto,
                resultado_contacto: registro.resultado_contacto,
                empresa_proveedora: registro.empresa_proveedora?.razon_social,
                cliente_final: registro.cliente_final?.razon_social,
                persona_contacto: registro.persona_contacto?.nombre_completo,
                reunion_agendada: registro.reunion_agendada,
                fecha_reunion: registro.fecha_reunion,
                pasa_embudo_ventas: registro.pasa_embudo_ventas,
                nombre_oportunidad: registro.nombre_oportunidad,
                etapa_oportunidad: registro.etapa_oportunidad,
                monto_total_sin_imp: registro.monto_total_sin_imp,
                observaciones: registro.observaciones,
                informacion_importante: registro.informacion_importante
            }));
        }
        catch (error) {
            console.error('Error en getTrazabilidad:', error);
            throw new common_1.HttpException('Error al obtener trazabilidad', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createTrazabilidad(data) {
        try {
            const idEjecutiva = parseInt(data.id_ejecutiva);
            const idEmpresa = parseInt(data.id_empresa_prov);
            const idCliente = parseInt(data.id_cliente_final);
            const idContacto = parseInt(data.id_contacto);
            const ejecutiva = await this.ejecutivaRepository.findOne({
                where: {
                    id_ejecutiva: idEjecutiva,
                    id_empresa_prov: idEmpresa
                }
            });
            if (!ejecutiva) {
                throw new common_1.HttpException('Ejecutiva no encontrada o no asignada a esta empresa', common_1.HttpStatus.NOT_FOUND);
            }
            const cliente = await this.clienteRepository.findOne({
                where: {
                    id_cliente_final: idCliente,
                    id_ejecutiva: idEjecutiva,
                    id_empresa_prov: idEmpresa
                }
            });
            if (!cliente) {
                throw new common_1.HttpException('Cliente no encontrado o no asignado a esta ejecutiva/empresa', common_1.HttpStatus.NOT_FOUND);
            }
            const persona_contacto = await this.contactoRepository.findOne({
                where: {
                    id_contacto: idContacto,
                    cliente_final: { id_cliente_final: idCliente }
                },
                relations: ['cliente_final']
            });
            if (!persona_contacto) {
                throw new common_1.HttpException('Contacto no encontrado o no pertenece a este cliente', common_1.HttpStatus.NOT_FOUND);
            }
            const nuevaTrazabilidad = this.trazabilidadRepository.create({
                ejecutiva: { id_ejecutiva: idEjecutiva },
                empresa_proveedora: { id_empresa_prov: idEmpresa },
                cliente_final: { id_cliente_final: idCliente },
                persona_contacto: { id_contacto: idContacto },
                tipo_contacto: data.tipo_contacto,
                fecha_contacto: data.fecha_contacto || new Date(),
                resultado_contacto: data.resultado_contacto,
                informacion_importante: data.informacion_importante,
                reunion_agendada: data.reunion_agendada || false,
                fecha_reunion: data.fecha_reunion,
                participantes: data.participantes,
                se_dio_reunion: data.se_dio_reunion,
                resultados_reunion: data.resultados_reunion,
                pasa_embudo_ventas: data.pasa_embudo_ventas || false,
                nombre_oportunidad: data.nombre_oportunidad,
                etapa_oportunidad: data.etapa_oportunidad,
                producto_ofrecido: data.producto_ofrecido,
                monto_total_sin_imp: data.monto_total_sin_imp,
                probabilidad_cierre: data.probabilidad_cierre,
                observaciones: data.observaciones
            });
            const saved = await this.trazabilidadRepository.save(nuevaTrazabilidad);
            return {
                id: saved.id_trazabilidad,
                fecha_contacto: saved.fecha_contacto,
                tipo_contacto: saved.tipo_contacto,
                resultado: saved.resultado_contacto,
                cliente: cliente.razon_social,
                persona_contacto: persona_contacto.nombre_completo,
                oportunidad: saved.nombre_oportunidad,
                etapa: saved.etapa_oportunidad
            };
        }
        catch (error) {
            console.error('Error en createTrazabilidad:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al crear trazabilidad', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPipeline(ejecutivaId) {
        try {
            const id = parseInt(ejecutivaId);
            const pipeline = await this.trazabilidadRepository.find({
                where: {
                    id_ejecutiva: id,
                    etapa_oportunidad: (0, typeorm_2.Not)((0, typeorm_2.In)(['Venta ganada', 'Venta perdida', 'Venta suspendida'])),
                    nombre_oportunidad: (0, typeorm_2.Not)((0, typeorm_2.IsNull)())
                },
                relations: ['cliente_final', 'persona_contacto', 'empresa_proveedora'],
                order: { fecha_cierre_esperado: 'ASC' }
            });
            return pipeline.map(oportunidad => ({
                id: oportunidad.id_trazabilidad,
                nombre_oportunidad: oportunidad.nombre_oportunidad,
                cliente: oportunidad.cliente_final?.razon_social,
                persona_contacto: oportunidad.persona_contacto?.nombre_completo,
                etapa: oportunidad.etapa_oportunidad,
                monto: oportunidad.monto_total_sin_imp,
                probabilidad: oportunidad.probabilidad_cierre,
                fecha_cierre_esperado: oportunidad.fecha_cierre_esperado,
                producto_ofrecido: oportunidad.producto_ofrecido,
                fecha_inicio_etapa: oportunidad.fecha_inicio_etapa
            }));
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
                    id_ejecutiva: id
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
                persona_contacto: actividad.persona_contacto?.nombre_completo,
                oportunidad: actividad.nombre_oportunidad,
                etapa: actividad.etapa_oportunidad,
                observaciones: actividad.observaciones?.substring(0, 100) + (actividad.observaciones?.length > 100 ? '...' : '')
            }));
        }
        catch (error) {
            console.error('Error en getActividadesRecientes:', error);
            throw new common_1.HttpException('Error al obtener actividades', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateEtapaOportunidad(trazabilidadId, nuevaEtapa, ejecutivaId) {
        try {
            const idTrazabilidad = parseInt(trazabilidadId);
            const idEjecutiva = parseInt(ejecutivaId);
            const trazabilidad = await this.trazabilidadRepository.findOne({
                where: {
                    id_trazabilidad: idTrazabilidad,
                    id_ejecutiva: idEjecutiva
                }
            });
            if (!trazabilidad) {
                throw new common_1.HttpException('Trazabilidad no encontrada o no autorizada', common_1.HttpStatus.NOT_FOUND);
            }
            const etapasValidas = [
                'Prospección', 'Calificación', 'Detección de necesidades', 'Presentación de solución',
                'Manejo de objeciones', 'Presentación de propuesta', 'Negociación', 'Firma de contrato',
                'Venta ganada', 'Venta perdida', 'Venta suspendida'
            ];
            if (!etapasValidas.includes(nuevaEtapa)) {
                throw new common_1.HttpException('Etapa no válida', common_1.HttpStatus.BAD_REQUEST);
            }
            await this.trazabilidadRepository.update(idTrazabilidad, {
                etapa_oportunidad: nuevaEtapa,
                fecha_inicio_etapa: nuevaEtapa !== trazabilidad.etapa_oportunidad ? new Date() : trazabilidad.fecha_inicio_etapa
            });
            return {
                message: 'Etapa actualizada correctamente',
                nueva_etapa: nuevaEtapa
            };
        }
        catch (error) {
            console.error('Error en updateEtapaOportunidad:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al actualizar etapa', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.EjecutivaTraceabilityService = EjecutivaTraceabilityService;
exports.EjecutivaTraceabilityService = EjecutivaTraceabilityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Trazabilidad_entity_1.Trazabilidad)),
    __param(1, (0, typeorm_1.InjectRepository)(Ejecutiva_entity_1.Ejecutiva)),
    __param(2, (0, typeorm_1.InjectRepository)(EmpresaProveedora_entity_1.EmpresaProveedora)),
    __param(3, (0, typeorm_1.InjectRepository)(ClienteFinal_entity_1.ClienteFinal)),
    __param(4, (0, typeorm_1.InjectRepository)(PersonaContacto_entity_1.PersonaContacto)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EjecutivaTraceabilityService);
//# sourceMappingURL=ejecutiva.service.js.map