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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const AuditoriaCambios_entity_1 = require("../../../../../shared/entities/AuditoriaCambios.entity");
let AuditService = class AuditService {
    constructor(auditoriaRepository) {
        this.auditoriaRepository = auditoriaRepository;
    }
    async getAuditoriaContratos(filters) {
        const { fechaInicio, fechaFin, accion, usuario } = filters || {};
        const query = this.auditoriaRepository
            .createQueryBuilder('auditoria')
            .leftJoinAndSelect('auditoria.empresa_proveedora', 'empresa')
            .leftJoinAndSelect('auditoria.cliente_final', 'cliente')
            .leftJoinAndSelect('auditoria.ejecutiva', 'ejecutiva')
            .leftJoinAndSelect('auditoria.ejecutiva_anterior', 'ejecutiva_anterior')
            .leftJoinAndSelect('auditoria.ejecutiva_nueva', 'ejecutiva_nueva')
            .orderBy('auditoria.fecha_accion', 'DESC');
        if (fechaInicio && fechaFin) {
            query.andWhere('auditoria.fecha_accion BETWEEN :fechaInicio AND :fechaFin', {
                fechaInicio,
                fechaFin: `${fechaFin} 23:59:59`
            });
        }
        if (accion) {
            query.andWhere('auditoria.accion = :accion', { accion });
        }
        if (usuario) {
            query.andWhere('auditoria.usuario_responsable ILIKE :usuario', {
                usuario: `%${usuario}%`
            });
        }
        const auditorias = await query.getMany();
        return auditorias.map(audit => ({
            id_auditoria: audit.id_auditoria,
            accion: audit.accion,
            detalles: audit.detalles,
            fecha_accion: audit.fecha_accion,
            usuario_responsable: audit.usuario_responsable,
            empresa: audit.empresa_proveedora?.razon_social || 'N/A',
            cliente: audit.cliente_final?.razon_social || 'N/A',
            ejecutiva: audit.ejecutiva?.nombre_completo || 'N/A',
            ejecutiva_anterior: audit.ejecutiva_anterior?.nombre_completo || 'N/A',
            ejecutiva_nueva: audit.ejecutiva_nueva?.nombre_completo || 'N/A',
            estado_anterior: audit.estado_anterior,
            estado_nuevo: audit.estado_nuevo,
            motivo_desvinculacion: audit.motivo_desvinculacion,
            observaciones_adicionales: audit.observaciones_adicionales
        }));
    }
    async getEstadisticasAuditoria() {
        try {
            const totalRegistros = await this.auditoriaRepository.count();
            const accionesPorTipo = await this.auditoriaRepository
                .createQueryBuilder('auditoria')
                .select('auditoria.accion, COUNT(*) as total')
                .groupBy('auditoria.accion')
                .getRawMany();
            const auditoriasPorUsuario = await this.auditoriaRepository
                .createQueryBuilder('auditoria')
                .select('auditoria.usuario_responsable, COUNT(*) as total')
                .groupBy('auditoria.usuario_responsable')
                .orderBy('total', 'DESC')
                .limit(10)
                .getRawMany();
            const auditoriasRecientes = await this.auditoriaRepository.find({
                order: { fecha_accion: 'DESC' },
                take: 10,
                relations: ['empresa_proveedora', 'cliente_final', 'ejecutiva']
            });
            const estadisticasPorEntidad = await this.auditoriaRepository
                .createQueryBuilder('auditoria')
                .select(`
          CASE 
            WHEN auditoria.id_empresa_proveedora IS NOT NULL THEN 'Empresa'
            WHEN auditoria.id_cliente_final IS NOT NULL THEN 'Cliente' 
            WHEN auditoria.id_ejecutiva IS NOT NULL THEN 'Ejecutiva'
            ELSE 'Otro'
          END as entidad,
          COUNT(*) as total
        `)
                .groupBy('entidad')
                .getRawMany();
            return {
                total_registros: totalRegistros,
                acciones_por_tipo: accionesPorTipo,
                top_usuarios: auditoriasPorUsuario,
                auditorias_recientes: auditoriasRecientes.map(audit => ({
                    id_auditoria: audit.id_auditoria,
                    accion: audit.accion,
                    fecha_accion: audit.fecha_accion,
                    usuario_responsable: audit.usuario_responsable,
                    empresa: audit.empresa_proveedora?.razon_social,
                    cliente: audit.cliente_final?.razon_social,
                    ejecutiva: audit.ejecutiva?.nombre_completo
                })),
                estadisticas_por_entidad: estadisticasPorEntidad,
                resumen: {
                    total_acciones: totalRegistros,
                    accion_mas_comun: accionesPorTipo.length > 0 ? accionesPorTipo[0].accion : 'N/A',
                    usuario_mas_activo: auditoriasPorUsuario.length > 0 ? auditoriasPorUsuario[0].usuario_responsable : 'N/A'
                }
            };
        }
        catch (error) {
            console.error('Error en getEstadisticasAuditoria:', error);
            throw error;
        }
    }
    async getAuditoriaResumenMensual() {
        const result = await this.auditoriaRepository
            .createQueryBuilder('auditoria')
            .select(`
        EXTRACT(YEAR FROM auditoria.fecha_accion) as year,
        EXTRACT(MONTH FROM auditoria.fecha_accion) as month,
        COUNT(*) as total
      `)
            .groupBy('year, month')
            .orderBy('year, month', 'DESC')
            .limit(12)
            .getRawMany();
        return result;
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(AuditoriaCambios_entity_1.AuditoriaCambios)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuditService);
//# sourceMappingURL=audit.service.js.map