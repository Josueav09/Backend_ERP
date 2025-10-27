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
exports.EmpresaDashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const EmpresaProveedora_entity_1 = require("../../../../../shared/entities/EmpresaProveedora.entity");
const Ejecutiva_entity_1 = require("../../../../../shared/entities/Ejecutiva.entity");
const ClienteFinal_entity_1 = require("../../../../../shared/entities/ClienteFinal.entity");
const Trazabilidad_entity_1 = require("../../../../../shared/entities/Trazabilidad.entity");
let EmpresaDashboardService = class EmpresaDashboardService {
    constructor(empresaRepository, ejecutivaRepository, clienteRepository, trazabilidadRepository) {
        this.empresaRepository = empresaRepository;
        this.ejecutivaRepository = ejecutivaRepository;
        this.clienteRepository = clienteRepository;
        this.trazabilidadRepository = trazabilidadRepository;
    }
    async getStats(empresaId) {
        try {
            console.log('📊 [EmpresaDashboardService] Obteniendo stats para empresa:', empresaId);
            const empresa = await this.empresaRepository.findOne({
                where: { id_empresa_prov: empresaId }
            });
            if (!empresa) {
                return this.getEmptyStats();
            }
            const ejecutivaInfo = await this.getEjecutivaInfo(empresaId);
            const [totalClientes, totalEjecutivas, totalActividades, actividadesEsteMes, clientesEsteMes, revenueTotal, pipelineOportunidades] = await Promise.all([
                this.getTotalClientes(empresaId),
                this.getTotalEjecutivas(empresaId),
                this.getTotalActividades(empresaId),
                this.getActividadesEsteMes(empresaId),
                this.getClientesEsteMes(empresaId),
                this.getRevenueTotal(empresaId),
                this.getPipelineOportunidades(empresaId)
            ]);
            const ventasGanadas = await this.getVentasGanadas(empresaId);
            const tasaConversion = totalClientes > 0
                ? `${((ventasGanadas / totalClientes) * 100).toFixed(1)}%`
                : '0%';
            const rendimiento = totalActividades > 0
                ? Math.round((ventasGanadas / totalActividades) * 100)
                : 0;
            const stats = {
                cliente: {
                    nombre_cliente: empresa.razon_social,
                    nombre_empresa: empresa.razon_social,
                    ejecutiva_nombre: ejecutivaInfo.ejecutiva_nombre,
                    ejecutiva_email: ejecutivaInfo.ejecutiva_email
                },
                totalActividades,
                completadas: ventasGanadas,
                enProceso: pipelineOportunidades,
                rendimiento,
                totalClientes,
                totalEjecutivas,
                actividadesEsteMes,
                clientesEsteMes,
                revenueTotal,
                pipelineOportunidades,
                tasaConversion,
                ventasGanadas
            };
            console.log('✅ [EmpresaDashboardService] Stats obtenidas:', {
                empresa: empresa.razon_social,
                totalActividades,
                ventasGanadas,
                rendimiento
            });
            return stats;
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardService] Error en getStats:', error);
            return this.getEmptyStats();
        }
    }
    async getTrazabilidad(empresaId) {
        try {
            console.log('📋 [EmpresaDashboardService] Obteniendo trazabilidad para empresa:', empresaId);
            const trazabilidad = await this.trazabilidadRepository
                .createQueryBuilder('t')
                .leftJoin('t.ejecutiva', 'e')
                .leftJoin('t.empresa_proveedora', 'emp')
                .leftJoin('t.cliente_final', 'cf')
                .leftJoin('t.persona_contacto', 'pc')
                .select([
                't.id_trazabilidad',
                't.tipo_contacto as tipo_actividad',
                't.fecha_contacto as fecha_actividad',
                't.etapa_oportunidad',
                't.observaciones as descripcion',
                't.informacion_importante as informacion_importante',
                't.resultados_reunion as resultados_reunion',
                'e.nombre_completo as ejecutiva_nombre',
                'emp.razon_social as nombre_empresa',
                'cf.razon_social as cliente_nombre',
                'pc.nombre_completo as contacto_nombre'
            ])
                .where('t.id_empresa_prov = :empresaId', { empresaId })
                .orderBy('t.fecha_contacto', 'DESC')
                .limit(50)
                .getRawMany();
            const trazabilidadFormateada = trazabilidad.map(item => ({
                id_trazabilidad: item.id_trazabilidad,
                tipo_actividad: item.tipo_actividad,
                descripcion: item.descripcion || `Contacto ${item.tipo_actividad} con ${item.contacto_nombre}`,
                fecha_actividad: item.fecha_actividad,
                resultado_contacto: this.mapEstadoTrazabilidad(item.etapa_oportunidad),
                notas: item.descripcion,
                informacion_importante: item.informacion_importante,
                resultados_reunion: item.resultados_reunion,
                ejecutiva_nombre: item.ejecutiva_nombre,
                nombre_empresa: item.nombre_empresa,
                cliente_nombre: item.cliente_nombre,
                contacto_nombre: item.contacto_nombre
            }));
            console.log(`✅ [EmpresaDashboardService] ${trazabilidadFormateada.length} actividades obtenidas`);
            return trazabilidadFormateada;
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardService] Error en getTrazabilidad:', error);
            return [];
        }
    }
    async getEjecutivaInfo(empresaId) {
        try {
            console.log('👩‍💼 [EmpresaDashboardService] Obteniendo información de ejecutiva para empresa:', empresaId);
            const ejecutivas = await this.ejecutivaRepository
                .createQueryBuilder('e')
                .select([
                'e.id_ejecutiva',
                'e.nombre_completo',
                'e.correo',
                'e.telefono',
                'e.linkedin'
            ])
                .where('e.id_empresa_prov = :empresaId', { empresaId })
                .andWhere('e.estado_ejecutiva = :estado', { estado: 'Activo' })
                .getMany();
            if (ejecutivas.length === 0) {
                return {
                    ejecutiva_nombre: 'Sin ejecutiva asignada',
                    ejecutiva_email: 'contacto@growvia.com',
                    telefono: 'Por asignar'
                };
            }
            const ejecutivaPrincipal = ejecutivas[0];
            return {
                ejecutiva_nombre: ejecutivaPrincipal.nombre_completo,
                ejecutiva_email: ejecutivaPrincipal.correo,
                telefono: ejecutivaPrincipal.telefono || 'No disponible',
                linkedin: ejecutivaPrincipal.linkedin
            };
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardService] Error en getEjecutivaInfo:', error);
            return {
                ejecutiva_nombre: 'Error al cargar información',
                ejecutiva_email: 'contacto@growvia.com',
                telefono: 'No disponible'
            };
        }
    }
    async getTotalClientes(empresaId) {
        try {
            const result = await this.clienteRepository
                .createQueryBuilder('cf')
                .where('cf.id_empresa_prov = :empresaId', { empresaId })
                .andWhere('cf.estado = :estado', { estado: 'Activo' })
                .getCount();
            return result;
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardService] Error en getTotalClientes:', error);
            return 0;
        }
    }
    async getTotalEjecutivas(empresaId) {
        try {
            const result = await this.ejecutivaRepository
                .createQueryBuilder('e')
                .where('e.id_empresa_prov = :empresaId', { empresaId })
                .andWhere('e.estado_ejecutiva = :estado', { estado: 'Activo' })
                .getCount();
            return result;
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardService] Error en getTotalEjecutivas:', error);
            return 0;
        }
    }
    async getTotalActividades(empresaId) {
        try {
            const result = await this.trazabilidadRepository
                .createQueryBuilder('t')
                .where('t.id_empresa_prov = :empresaId', { empresaId })
                .getCount();
            return result;
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardService] Error en getTotalActividades:', error);
            return 0;
        }
    }
    async getActividadesEsteMes(empresaId) {
        try {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);
            const result = await this.trazabilidadRepository
                .createQueryBuilder('t')
                .where('t.id_empresa_prov = :empresaId', { empresaId })
                .andWhere('t.fecha_contacto >= :startOfMonth', { startOfMonth })
                .getCount();
            return result;
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardService] Error en getActividadesEsteMes:', error);
            return 0;
        }
    }
    async getClientesEsteMes(empresaId) {
        try {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);
            const result = await this.clienteRepository
                .createQueryBuilder('cf')
                .where('cf.id_empresa_prov = :empresaId', { empresaId })
                .andWhere('cf.fecha_creacion >= :startOfMonth', { startOfMonth })
                .getCount();
            return result;
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardService] Error en getClientesEsteMes:', error);
            return 0;
        }
    }
    async getRevenueTotal(empresaId) {
        try {
            const result = await this.trazabilidadRepository
                .createQueryBuilder('t')
                .select('COALESCE(SUM(t.monto_cierre_final), 0)', 'revenue')
                .where('t.id_empresa_prov = :empresaId', { empresaId })
                .andWhere('t.etapa_oportunidad = :etapa', { etapa: 'Venta ganada' })
                .getRawOne();
            return parseFloat(result.revenue) || 0;
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardService] Error en getRevenueTotal:', error);
            return 0;
        }
    }
    async getPipelineOportunidades(empresaId) {
        try {
            const result = await this.trazabilidadRepository
                .createQueryBuilder('t')
                .where('t.id_empresa_prov = :empresaId', { empresaId })
                .andWhere('t.nombre_oportunidad IS NOT NULL')
                .andWhere('t.etapa_oportunidad NOT IN (:...etapas)', {
                etapas: ['Venta ganada', 'Venta perdida', 'Venta suspendida']
            })
                .getCount();
            return result;
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardService] Error en getPipelineOportunidades:', error);
            return 0;
        }
    }
    async getVentasGanadas(empresaId) {
        try {
            const result = await this.trazabilidadRepository
                .createQueryBuilder('t')
                .where('t.id_empresa_prov = :empresaId', { empresaId })
                .andWhere('t.etapa_oportunidad = :etapa', { etapa: 'Venta ganada' })
                .getCount();
            return result;
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardService] Error en getVentasGanadas:', error);
            return 0;
        }
    }
    mapEstadoTrazabilidad(estado) {
        console.log("VIENDO", estado);
        if (!estado)
            return 'pendiente';
        const estadoMap = {
            'Venta ganada': 'completado',
            'Venta perdida': 'cancelado',
            'Venta suspendida': 'cancelado',
            'Prospección': 'en_proceso',
            'Calificación': 'en_proceso',
            'Detección de necesidades': 'en_proceso',
            'Presentación de solución': 'en_proceso',
            'Manejo de objeciones': 'en_proceso',
            'Presentación de propuesta': 'en_proceso',
            'Negociación': 'en_proceso',
            'Firma de contrato': 'en_proceso'
        };
        return estadoMap[estado] || 'en_proceso';
    }
    getEmptyStats() {
        return {
            cliente: {
                nombre_cliente: "Empresa no encontrada",
                nombre_empresa: "Sin empresa asignada",
                ejecutiva_nombre: "Sin ejecutiva asignada",
                ejecutiva_email: "contacto@growvia.com"
            },
            totalActividades: 0,
            completadas: 0,
            enProceso: 0,
            rendimiento: 0,
            totalClientes: 0,
            totalEjecutivas: 0,
            actividadesEsteMes: 0,
            clientesEsteMes: 0,
            revenueTotal: 0,
            pipelineOportunidades: 0,
            tasaConversion: '0%',
            ventasGanadas: 0
        };
    }
};
exports.EmpresaDashboardService = EmpresaDashboardService;
exports.EmpresaDashboardService = EmpresaDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(EmpresaProveedora_entity_1.EmpresaProveedora)),
    __param(1, (0, typeorm_1.InjectRepository)(Ejecutiva_entity_1.Ejecutiva)),
    __param(2, (0, typeorm_1.InjectRepository)(ClienteFinal_entity_1.ClienteFinal)),
    __param(3, (0, typeorm_1.InjectRepository)(Trazabilidad_entity_1.Trazabilidad)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EmpresaDashboardService);
//# sourceMappingURL=dashboard.service.js.map