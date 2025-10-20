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
exports.TrazabilidadService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Trazabilidad_entity_1 = require("../../../../../shared/entities/Trazabilidad.entity");
const Ejecutiva_entity_1 = require("../../../../../shared/entities/Ejecutiva.entity");
const EmpresaProveedora_entity_1 = require("../../../../../shared/entities/EmpresaProveedora.entity");
const ClienteFinal_entity_1 = require("../../../../../shared/entities/ClienteFinal.entity");
const PersonaContacto_entity_1 = require("../../../../../shared/entities/PersonaContacto.entity");
let TrazabilidadService = class TrazabilidadService {
    constructor(trazabilidadRepository) {
        this.trazabilidadRepository = trazabilidadRepository;
        console.log('🔧 TrazabilidadService inicializado');
    }
    async getTrazabilidad(filters) {
        try {
            console.log('🔍 [TrazabilidadService] getTrazabilidad ejecutándose');
            console.log('🔍 Filters recibidos:', filters);
            const totalCount = await this.trazabilidadRepository.count();
            console.log('🔍 Total de registros en BD:', totalCount);
            const { empresaId, ejecutivaId, clienteId, fechaInicio, fechaFin, tipoContacto, etapaOportunidad, etapa } = filters || {};
            const query = this.trazabilidadRepository
                .createQueryBuilder('trazabilidad')
                .leftJoinAndSelect('trazabilidad.ejecutiva', 'ejecutiva')
                .leftJoinAndSelect('trazabilidad.empresa_proveedora', 'empresa')
                .leftJoinAndSelect('trazabilidad.cliente_final', 'cliente')
                .leftJoinAndSelect('trazabilidad.persona_contacto', 'contacto')
                .orderBy('trazabilidad.fecha_contacto', 'DESC');
            console.log('🔍 Query construido, aplicando filtros...');
            if (empresaId) {
                query.andWhere('trazabilidad.id_empresa_prov = :empresaId', {
                    empresaId: parseInt(empresaId)
                });
            }
            if (ejecutivaId) {
                query.andWhere('trazabilidad.id_ejecutiva = :ejecutivaId', {
                    ejecutivaId: parseInt(ejecutivaId)
                });
            }
            if (clienteId) {
                query.andWhere('trazabilidad.id_cliente_final = :clienteId', {
                    clienteId: parseInt(clienteId)
                });
            }
            if (fechaInicio && fechaFin) {
                query.andWhere('trazabilidad.fecha_contacto BETWEEN :fechaInicio AND :fechaFin', {
                    fechaInicio,
                    fechaFin: `${fechaFin} 23:59:59`
                });
            }
            if (tipoContacto) {
                query.andWhere('trazabilidad.tipo_contacto = :tipoContacto', { tipoContacto });
            }
            if (etapaOportunidad) {
                query.andWhere('trazabilidad.etapa_oportunidad = :etapaOportunidad', { etapaOportunidad });
            }
            if (etapa) {
                if (etapa === '1') {
                    query.andWhere('(trazabilidad.pasa_embudo_ventas = FALSE OR trazabilidad.nombre_oportunidad IS NULL)');
                }
                else if (etapa === '2') {
                    query.andWhere('trazabilidad.pasa_embudo_ventas = TRUE AND trazabilidad.nombre_oportunidad IS NOT NULL');
                }
            }
            const trazabilidades = await query.getMany();
            console.log('✅ [TrazabilidadService] Query ejecutado exitosamente');
            console.log('✅ Registros encontrados:', trazabilidades.length);
            return trazabilidades;
        }
        catch (error) {
            console.error('❌ [TrazabilidadService] ERROR en getTrazabilidad:', error);
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack,
                code: error.code
            });
            throw error;
        }
    }
    async getDashboardTrazabilidad() {
        const [etapa1Generacion, etapa2Embudo, kpisSemanales, dashboardEjecutivas] = await Promise.all([
            this.trazabilidadRepository.query('SELECT * FROM vista_etapa1_generacion'),
            this.trazabilidadRepository.query('SELECT * FROM vista_etapa2_embudo'),
            this.trazabilidadRepository.query('SELECT * FROM vista_kpis_semanales'),
            this.trazabilidadRepository.query('SELECT * FROM vista_dashboard_ejecutiva')
        ]);
        const totalGestiones = await this.trazabilidadRepository.count();
        const gestionesPorTipo = await this.trazabilidadRepository
            .createQueryBuilder('t')
            .select('t.tipo_contacto, COUNT(*) as total')
            .groupBy('t.tipo_contacto')
            .getRawMany();
        const oportunidadesPorEtapa = await this.trazabilidadRepository
            .createQueryBuilder('t')
            .select('t.etapa_oportunidad, COUNT(*) as total')
            .where('t.etapa_oportunidad IS NOT NULL')
            .groupBy('t.etapa_oportunidad')
            .getRawMany();
        const revenueTotal = await this.trazabilidadRepository
            .createQueryBuilder('t')
            .select('COALESCE(SUM(t.monto_cierre_final), 0)', 'revenue_total')
            .where('t.etapa_oportunidad = :etapa', { etapa: 'Venta ganada' })
            .getRawOne();
        const estadisticasEtapas = await this.trazabilidadRepository
            .createQueryBuilder('t')
            .select(`
        COUNT(CASE WHEN t.pasa_embudo_ventas = FALSE OR t.nombre_oportunidad IS NULL THEN 1 END) as total_etapa1,
        COUNT(CASE WHEN t.pasa_embudo_ventas = TRUE AND t.nombre_oportunidad IS NOT NULL THEN 1 END) as total_etapa2,
        COUNT(CASE WHEN t.etapa_oportunidad = 'Venta ganada' THEN 1 END) as ventas_ganadas
      `)
            .getRawOne();
        return {
            etapa1_generacion: etapa1Generacion,
            etapa2_embudo: etapa2Embudo,
            kpis_semanales: kpisSemanales,
            dashboard_ejecutivas: dashboardEjecutivas,
            estadisticas: {
                total_gestiones: totalGestiones,
                revenue_total: parseFloat(revenueTotal?.revenue_total || 0),
                gestiones_por_tipo: gestionesPorTipo,
                oportunidades_por_etapa: oportunidadesPorEtapa,
                por_etapa: estadisticasEtapas
            }
        };
    }
    async createTrazabilidad(data) {
        const { id_ejecutiva, id_empresa_prov, id_cliente_final, id_contacto, fecha_agregado_base, tipo_contacto, fecha_contacto, fecha_respuesta, resultado_contacto, informacion_importante, reunion_agendada, fecha_reunion, participantes, se_dio_reunion, resultados_reunion, pasa_embudo_ventas, fecha_inicio_etapa, nombre_oportunidad, tipo_oportunidad, etapa_oportunidad, producto_ofrecido, fecha_registro_oportunidad, fecha_cierre_esperado, monto_total_sin_imp, probabilidad_cierre, monto_cierre_final, observaciones } = data;
        const [ejecutiva, empresa, cliente, contacto] = await Promise.all([
            this.trazabilidadRepository.manager.findOne(Ejecutiva_entity_1.Ejecutiva, {
                where: { id_ejecutiva }
            }),
            this.trazabilidadRepository.manager.findOne(EmpresaProveedora_entity_1.EmpresaProveedora, {
                where: { id_empresa_prov }
            }),
            this.trazabilidadRepository.manager.findOne(ClienteFinal_entity_1.ClienteFinal, {
                where: { id_cliente_final }
            }),
            this.trazabilidadRepository.manager.findOne(PersonaContacto_entity_1.PersonaContacto, {
                where: { id_contacto }
            })
        ]);
        if (!ejecutiva) {
            throw new common_1.HttpException('Ejecutiva no encontrada', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!empresa) {
            throw new common_1.HttpException('Empresa proveedora no encontrada', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!cliente) {
            throw new common_1.HttpException('Cliente final no encontrado', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!contacto) {
            throw new common_1.HttpException('Persona de contacto no encontrada', common_1.HttpStatus.BAD_REQUEST);
        }
        if (pasa_embudo_ventas && !nombre_oportunidad) {
            throw new common_1.HttpException('Para pasar al embudo de ventas se requiere un nombre de oportunidad', common_1.HttpStatus.BAD_REQUEST);
        }
        const nuevaTrazabilidad = this.trazabilidadRepository.create({
            ejecutiva,
            empresa_proveedora: empresa,
            cliente_final: cliente,
            persona_contacto: contacto,
            fecha_agregado_base: fecha_agregado_base ? new Date(fecha_agregado_base) : null,
            tipo_contacto,
            fecha_contacto: new Date(fecha_contacto),
            fecha_respuesta: fecha_respuesta ? new Date(fecha_respuesta) : null,
            resultado_contacto,
            informacion_importante: informacion_importante || null,
            reunion_agendada: reunion_agendada || false,
            fecha_reunion: fecha_reunion ? new Date(fecha_reunion) : null,
            participantes: participantes || null,
            se_dio_reunion: se_dio_reunion || null,
            resultados_reunion: resultados_reunion || null,
            pasa_embudo_ventas: pasa_embudo_ventas || false,
            fecha_inicio_etapa: fecha_inicio_etapa ? new Date(fecha_inicio_etapa) : null,
            nombre_oportunidad: nombre_oportunidad || null,
            tipo_oportunidad: tipo_oportunidad || null,
            etapa_oportunidad: etapa_oportunidad || null,
            producto_ofrecido: producto_ofrecido || null,
            fecha_registro_oportunidad: fecha_registro_oportunidad ? new Date(fecha_registro_oportunidad) : null,
            fecha_cierre_esperado: fecha_cierre_esperado ? new Date(fecha_cierre_esperado) : null,
            monto_total_sin_imp: monto_total_sin_imp || null,
            probabilidad_cierre: probabilidad_cierre || null,
            monto_cierre_final: monto_cierre_final || null,
            observaciones: observaciones || null
        });
        return await this.trazabilidadRepository.save(nuevaTrazabilidad);
    }
    async updateTrazabilidad(id, data) {
        const trazabilidad = await this.trazabilidadRepository.findOne({
            where: { id_trazabilidad: id },
            relations: ['ejecutiva', 'empresa_proveedora', 'cliente_final', 'persona_contacto']
        });
        if (!trazabilidad) {
            throw new common_1.HttpException('Trazabilidad no encontrada', common_1.HttpStatus.NOT_FOUND);
        }
        if (data.pasa_embudo_ventas && !data.nombre_oportunidad) {
            throw new common_1.HttpException('Para pasar al embudo de ventas se requiere un nombre de oportunidad', common_1.HttpStatus.BAD_REQUEST);
        }
        Object.assign(trazabilidad, data);
        return await this.trazabilidadRepository.save(trazabilidad);
    }
    async getEstadisticasPorEtapa(filters) {
        const { empresaId, fechaInicio, fechaFin } = filters || {};
        const query = this.trazabilidadRepository
            .createQueryBuilder('t')
            .select(`
        COUNT(*) as total_gestiones,
        COUNT(CASE WHEN t.pasa_embudo_ventas = FALSE OR t.nombre_oportunidad IS NULL THEN 1 END) as etapa1_generacion,
        COUNT(CASE WHEN t.pasa_embudo_ventas = TRUE AND t.nombre_oportunidad IS NOT NULL THEN 1 END) as etapa2_embudo,
        COUNT(CASE WHEN t.etapa_oportunidad = 'Venta ganada' THEN 1 END) as ventas_ganadas,
        COALESCE(SUM(CASE WHEN t.etapa_oportunidad = 'Venta ganada' THEN t.monto_cierre_final ELSE 0 END), 0) as revenue_total
      `);
        if (empresaId) {
            query.andWhere('t.id_empresa_prov = :empresaId', { empresaId: parseInt(empresaId) });
        }
        if (fechaInicio && fechaFin) {
            query.andWhere('t.fecha_contacto BETWEEN :fechaInicio AND :fechaFin', {
                fechaInicio,
                fechaFin: `${fechaFin} 23:59:59`
            });
        }
        return await query.getRawOne();
    }
};
exports.TrazabilidadService = TrazabilidadService;
exports.TrazabilidadService = TrazabilidadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Trazabilidad_entity_1.Trazabilidad)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TrazabilidadService);
//# sourceMappingURL=trazabilidad.service.js.map