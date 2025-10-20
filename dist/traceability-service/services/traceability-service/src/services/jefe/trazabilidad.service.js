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
            const { empresaId, ejecutivaId, clienteId, fechaInicio, fechaFin, tipoContacto, etapaOportunidad } = filters || {};
            const query = this.trazabilidadRepository
                .createQueryBuilder('trazabilidad')
                .leftJoinAndSelect('trazabilidad.ejecutiva', 'ejecutiva')
                .leftJoinAndSelect('trazabilidad.empresa_proveedora', 'empresa')
                .leftJoinAndSelect('trazabilidad.cliente_final', 'cliente')
                .leftJoinAndSelect('trazabilidad.persona_contacto', 'contacto')
                .orderBy('trazabilidad.fecha_contacto', 'DESC');
            console.log('🔍 Query construido, aplicando filtros...');
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
        const [pipelineVentas, dashboardEjecutivas] = await Promise.all([
            this.trazabilidadRepository.query('SELECT * FROM vista_pipeline_ventas'),
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
            .groupBy('t.etapa_oportunidad')
            .getRawMany();
        const revenueTotal = pipelineVentas.reduce((sum, item) => {
            return sum + (Number(item.monto_total_sin_imp) || 0);
        }, 0);
        return {
            pipeline_ventas: pipelineVentas,
            dashboard_ejecutivas: dashboardEjecutivas,
            estadisticas: {
                total_gestiones: totalGestiones,
                revenue_total: revenueTotal,
                gestiones_por_tipo: gestionesPorTipo,
                oportunidades_por_etapa: oportunidadesPorEtapa
            }
        };
    }
    async createTrazabilidad(data) {
        const { id_ejecutiva, id_empresa_prov, id_cliente_final, id_contacto, tipo_contacto, fecha_contacto, resultado_contacto, etapa_oportunidad, nombre_oportunidad, monto_total_sin_imp, probabilidad_cierre, observaciones } = data;
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
        const nuevaTrazabilidad = this.trazabilidadRepository.create({
            ejecutiva,
            empresa_proveedora: empresa,
            cliente_final: cliente,
            persona_contacto: contacto,
            tipo_contacto,
            fecha_contacto: new Date(fecha_contacto),
            resultado_contacto,
            etapa_oportunidad,
            nombre_oportunidad: nombre_oportunidad || null,
            monto_total_sin_imp: monto_total_sin_imp || null,
            probabilidad_cierre: probabilidad_cierre || null,
            observaciones: observaciones || null
        });
        return await this.trazabilidadRepository.save(nuevaTrazabilidad);
    }
};
exports.TrazabilidadService = TrazabilidadService;
exports.TrazabilidadService = TrazabilidadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Trazabilidad_entity_1.Trazabilidad)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TrazabilidadService);
//# sourceMappingURL=trazabilidad.service.js.map