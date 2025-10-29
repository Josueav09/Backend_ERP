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
            console.log('📊 [EmpresaDashboardService] Obteniendo stats REALES para empresa:', empresaId);
            const empresa = await this.empresaRepository.findOne({
                where: { id_empresa_prov: empresaId }
            });
            if (!empresa) {
                console.log('❌ Empresa no encontrada:', empresaId);
                return this.getEmptyStats();
            }
            const ejecutivaInfo = await this.getEjecutivaInfo(empresaId);
            const [totalClientes, totalEjecutivas, totalActividades, actividadesEsteMes, clientesEsteMes, revenueTotal, pipelineOportunidades, actividadesCompletadas, actividadesEnProceso] = await Promise.all([
                this.getTotalClientes(empresaId),
                this.getTotalEjecutivas(empresaId),
                this.getTotalActividades(empresaId),
                this.getActividadesEsteMes(empresaId),
                this.getClientesEsteMes(empresaId),
                this.getRevenueTotal(empresaId),
                this.getPipelineOportunidades(empresaId),
                this.getActividadesCompletadas(empresaId),
                this.getActividadesEnProceso(empresaId)
            ]);
            const ventasGanadas = await this.getVentasGanadas(empresaId);
            const rendimiento = totalActividades > 0
                ? Math.round((actividadesCompletadas / totalActividades) * 100)
                : 0;
            const tasaConversion = pipelineOportunidades > 0
                ? `${((ventasGanadas / pipelineOportunidades) * 100).toFixed(1)}%`
                : '0%';
            const stats = {
                cliente: {
                    nombre_cliente: empresa.razon_social,
                    nombre_empresa: empresa.razon_social,
                    ejecutiva_nombre: ejecutivaInfo.ejecutiva_nombre,
                    ejecutiva_email: ejecutivaInfo.ejecutiva_email
                },
                totalActividades,
                completadas: actividadesCompletadas,
                enProceso: actividadesEnProceso,
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
            console.log('✅ [EmpresaDashboardService] Stats REALES obtenidas:', stats);
            return stats;
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardService] Error en getStats:', error);
            return this.getEmptyStats();
        }
    }
    async getActividadesCompletadas(empresaId) {
        try {
            const result = await this.trazabilidadRepository
                .createQueryBuilder('t')
                .where('t.id_empresa_prov = :empresaId', { empresaId })
                .andWhere('t.etapa_oportunidad = :etapa', { etapa: 'Venta ganada' })
                .getCount();
            return result;
        }
        catch (error) {
            console.error('❌ Error en getActividadesCompletadas:', error);
            return 0;
        }
    }
    async getActividadesEnProceso(empresaId) {
        try {
            const result = await this.trazabilidadRepository
                .createQueryBuilder('t')
                .where('t.id_empresa_prov = :empresaId', { empresaId })
                .andWhere('t.etapa_oportunidad IN (:...etapas)', {
                etapas: ['Prospección', 'Calificación', 'Negociación', 'Presentación de propuesta']
            })
                .getCount();
            return result;
        }
        catch (error) {
            console.error('❌ Error en getActividadesEnProceso:', error);
            return 0;
        }
    }
    async getTrazabilidad(empresaId) {
        try {
            console.log('📋 [EmpresaDashboardService] Obteniendo trazabilidad para empresa:', empresaId);
            const trazabilidad = await this.trazabilidadRepository
                .createQueryBuilder('t')
                .leftJoinAndSelect('t.ejecutiva', 'e')
                .leftJoinAndSelect('t.empresa_proveedora', 'emp')
                .leftJoinAndSelect('t.cliente_final', 'cf')
                .leftJoinAndSelect('t.persona_contacto', 'pc')
                .where('t.id_empresa_prov = :empresaId', { empresaId })
                .orderBy('t.fecha_contacto', 'DESC')
                .limit(50)
                .getMany();
            console.log('🔍 [Debug] Primer registro de trazabilidad:', trazabilidad[0]);
            const trazabilidadFormateada = trazabilidad.map(item => {
                console.log("🔍 ESTADO desde entity:", item.etapa_oportunidad);
                return {
                    id_trazabilidad: item.id_trazabilidad,
                    tipo_actividad: item.tipo_contacto,
                    descripcion: item.observaciones || `Contacto ${item.tipo_contacto} con ${item.persona_contacto?.nombre_completo}`,
                    fecha_actividad: item.fecha_contacto,
                    resultado_contacto: this.mapEstadoTrazabilidad(item.etapa_oportunidad),
                    notas: item.observaciones,
                    informacion_importante: item.informacion_importante,
                    resultados_reunion: item.resultados_reunion,
                    ejecutiva_nombre: item.ejecutiva?.nombre_completo,
                    nombre_empresa: item.empresa_proveedora?.razon_social,
                    cliente_nombre: item.cliente_final?.razon_social,
                    contacto_nombre: item.persona_contacto?.nombre_completo
                };
            });
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
    async getClientesRecientes(empresaId) {
        try {
            console.log('👥 [EmpresaDashboardService] Obteniendo clientes recientes CON ESTADÍSTICAS para empresa:', empresaId);
            const clientes = await this.clienteRepository
                .createQueryBuilder('cf')
                .leftJoinAndSelect('cf.ejecutiva', 'e')
                .select([
                'cf.id_cliente_final',
                'cf.razon_social',
                'cf.ruc',
                'cf.correo',
                'cf.telefono',
                'cf.pais',
                'cf.rubro',
                'cf.estado',
                'cf.fecha_creacion',
                'e.nombre_completo'
            ])
                .where('cf.id_empresa_prov = :empresaId', { empresaId })
                .orderBy('cf.fecha_creacion', 'DESC')
                .limit(5)
                .getMany();
            const clientesConEstadisticas = await Promise.all(clientes.map(async (cliente) => {
                const estadisticas = await this.getEstadisticasCliente(cliente.id_cliente_final);
                return {
                    id_cliente_final: cliente.id_cliente_final,
                    razon_social: cliente.razon_social,
                    ruc: cliente.ruc,
                    correo: cliente.correo,
                    telefono: cliente.telefono,
                    pais: cliente.pais,
                    rubro: cliente.rubro,
                    estado: cliente.estado,
                    fecha_creacion: cliente.fecha_creacion,
                    ejecutiva_nombre: cliente.ejecutiva?.nombre_completo || 'Sin ejecutiva asignada',
                    actividades_completadas: estadisticas.completadas,
                    actividades_en_proceso: estadisticas.en_proceso,
                    total_actividades: estadisticas.total
                };
            }));
            console.log(`✅ [EmpresaDashboardService] ${clientesConEstadisticas.length} clientes con estadísticas obtenidos`);
            if (clientesConEstadisticas.length > 0) {
                console.log('🔍 [Debug] Primer cliente con estadísticas:', clientesConEstadisticas[0]);
            }
            return clientesConEstadisticas;
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardService] Error en getClientesRecientes:', error);
            return [];
        }
    }
    async getEstadisticasCliente(clienteId) {
        try {
            const [completadas, enProceso, total] = await Promise.all([
                this.trazabilidadRepository
                    .createQueryBuilder('t')
                    .where('t.id_cliente_final = :clienteId', { clienteId })
                    .andWhere('t.etapa_oportunidad = :etapa', { etapa: 'Venta ganada' })
                    .getCount(),
                this.trazabilidadRepository
                    .createQueryBuilder('t')
                    .where('t.id_cliente_final = :clienteId', { clienteId })
                    .andWhere('t.etapa_oportunidad IN (:...etapas)', {
                    etapas: ['Prospección', 'Calificación', 'Negociación', 'Presentación de propuesta', 'Firma de contrato']
                })
                    .getCount(),
                this.trazabilidadRepository
                    .createQueryBuilder('t')
                    .where('t.id_cliente_final = :clienteId', { clienteId })
                    .getCount()
            ]);
            return {
                completadas,
                en_proceso: enProceso,
                total
            };
        }
        catch (error) {
            console.error('❌ Error obteniendo estadísticas del cliente:', error);
            return {
                completadas: 0,
                en_proceso: 0,
                total: 0
            };
        }
    }
    mapEstadoTrazabilidad(estado) {
        console.log("🔍 ESTADO recibido en mapEstadoTrazabilidad:", estado);
        if (!estado) {
            console.log("⚠️ Estado vacío, usando 'pendiente'");
            return 'pendiente';
        }
        const estadoMap = {
            'Venta ganada': 'completada',
            'Venta perdida': 'cancelada',
            'Venta suspendida': 'cancelada',
            'Prospección': 'en_proceso',
            'Calificación': 'en_proceso',
            'Detección de necesidades': 'en_proceso',
            'Presentación de solución': 'en_proceso',
            'Manejo de objeciones': 'en_proceso',
            'Presentación de propuesta': 'en_proceso',
            'Negociación': 'en_proceso',
            'Firma de contrato': 'en_proceso'
        };
        const resultado = estadoMap[estado] || 'en_proceso';
        console.log(`🔍 Estado mapeado: ${estado} -> ${resultado}`);
        return resultado;
    }
    async getEjecutivaInfoCompleta(empresaId) {
        try {
            console.log('👩‍💼 [EmpresaDashboardService] Obteniendo información COMPLETA de ejecutiva para empresa:', empresaId);
            const ejecutiva = await this.ejecutivaRepository
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
                .getOne();
            if (!ejecutiva) {
                return {
                    ejecutiva_nombre: 'Sin ejecutiva asignada',
                    ejecutiva_email: 'contacto@growvia.com',
                    telefono: 'Por asignar',
                    linkedin: null
                };
            }
            const estadisticasReales = await this.getEstadisticasEjecutiva(ejecutiva.id_ejecutiva);
            return {
                ejecutiva_nombre: ejecutiva.nombre_completo,
                ejecutiva_email: ejecutiva.correo,
                telefono: ejecutiva.telefono || 'No disponible',
                linkedin: ejecutiva.linkedin,
                estadisticas: estadisticasReales
            };
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardService] Error en getEjecutivaInfoCompleta:', error);
            return {
                ejecutiva_nombre: 'Error al cargar información',
                ejecutiva_email: 'contacto@growvia.com',
                telefono: 'No disponible',
                linkedin: null,
                estadisticas: {
                    clientes_activos: 0,
                    tasa_conversion: '0%',
                    ventas_ganadas: 0,
                    tiempo_respuesta: 'Por determinar'
                }
            };
        }
    }
    async getEstadisticasEjecutiva(ejecutivaId) {
        try {
            const [clientesActivos, ventasGanadas, totalActividades] = await Promise.all([
                this.clienteRepository
                    .createQueryBuilder('cf')
                    .where('cf.id_ejecutiva = :ejecutivaId', { ejecutivaId })
                    .andWhere('cf.estado = :estado', { estado: 'Activo' })
                    .getCount(),
                this.trazabilidadRepository
                    .createQueryBuilder('t')
                    .where('t.id_ejecutiva = :ejecutivaId', { ejecutivaId })
                    .andWhere('t.etapa_oportunidad = :etapa', { etapa: 'Venta ganada' })
                    .getCount(),
                this.trazabilidadRepository
                    .createQueryBuilder('t')
                    .where('t.id_ejecutiva = :ejecutivaId', { ejecutivaId })
                    .getCount()
            ]);
            const tasaConversion = totalActividades > 0
                ? `${((ventasGanadas / totalActividades) * 100).toFixed(1)}%`
                : '0%';
            return {
                clientes_activos: clientesActivos,
                tasa_conversion: tasaConversion,
                ventas_ganadas: ventasGanadas,
                tiempo_respuesta: '< 24 horas'
            };
        }
        catch (error) {
            console.error('❌ Error obteniendo estadísticas ejecutiva:', error);
            return {
                clientes_activos: 0,
                tasa_conversion: '0%',
                ventas_ganadas: 0,
                tiempo_respuesta: 'Por determinar'
            };
        }
    }
    async getEjecutivasByEmpresa(empresaId) {
        try {
            console.log('👥 [EmpresaDashboardService] Obteniendo ejecutivas para empresa:', empresaId);
            const ejecutivas = await this.ejecutivaRepository
                .createQueryBuilder('e')
                .select([
                'e.id_ejecutiva',
                'e.nombre_completo',
                'e.correo',
                'e.telefono',
                'e.linkedin',
                'e.estado_ejecutiva'
            ])
                .where('e.id_empresa_prov = :empresaId', { empresaId })
                .andWhere('e.estado_ejecutiva = :estado', { estado: 'Activo' })
                .getMany();
            console.log(`✅ [EmpresaDashboardService] ${ejecutivas.length} ejecutivas encontradas`);
            return ejecutivas;
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardService] Error en getEjecutivasByEmpresa:', error);
            return [];
        }
    }
    async getEquipoStats(empresaId) {
        try {
            console.log('📊 [EmpresaDashboardService] Obteniendo stats de equipo para empresa:', empresaId);
            const [totalEjecutivas, totalClientes, ventasTotales, pipelineTotal, actividadesMes] = await Promise.all([
                this.getTotalEjecutivas(empresaId),
                this.getTotalClientes(empresaId),
                this.getRevenueTotal(empresaId),
                this.getPipelineOportunidades(empresaId),
                this.getActividadesEsteMes(empresaId)
            ]);
            const conversionPromedio = await this.getConversionPromedioEquipo(empresaId);
            return {
                totalEjecutivas,
                totalClientes,
                ventasTotales,
                pipelineTotal,
                actividadesMes,
                conversionPromedio: `${conversionPromedio}%`
            };
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardService] Error en getEquipoStats:', error);
            return {
                totalEjecutivas: 0,
                totalClientes: 0,
                ventasTotales: 0,
                pipelineTotal: 0,
                actividadesMes: 0,
                conversionPromedio: '0%'
            };
        }
    }
    async getEmbudoVentasEjecutiva(ejecutivaId, empresaId) {
        try {
            console.log('🎯 [EmpresaDashboardService] Obteniendo embudo REAL para ejecutiva:', ejecutivaId);
            const etapasBD = [
                'Prospección',
                'Calificación',
                'Detección de necesidades',
                'Presentación de solución',
                'Manejo de objeciones',
                'Presentación de propuesta',
                'Negociación',
                'Firma de contrato',
                'Venta ganada'
            ];
            const etapasEmbudo = [
                { etapaBD: 'Prospección', etapaFrontend: 'Prospección' },
                { etapaBD: 'Calificación', etapaFrontend: 'Calificación' },
                { etapaBD: 'Detección de necesidades', etapaFrontend: 'Propuesta' },
                { etapaBD: 'Presentación de solución', etapaFrontend: 'Propuesta' },
                { etapaBD: 'Manejo de objeciones', etapaFrontend: 'Negociación' },
                { etapaBD: 'Presentación de propuesta', etapaFrontend: 'Negociación' },
                { etapaBD: 'Negociación', etapaFrontend: 'Negociación' },
                { etapaBD: 'Firma de contrato', etapaFrontend: 'Cierre' },
                { etapaBD: 'Venta ganada', etapaFrontend: 'Cierre' }
            ];
            const embudoAgrupado = await Promise.all(['Prospección', 'Calificación', 'Propuesta', 'Negociación', 'Cierre'].map(async (etapaFrontend) => {
                const etapasCorrespondientes = etapasEmbudo
                    .filter(e => e.etapaFrontend === etapaFrontend)
                    .map(e => e.etapaBD);
                console.log(`🔍 [Embudo] ${etapaFrontend} -> BD:`, etapasCorrespondientes);
                if (etapasCorrespondientes.length === 0) {
                    return {
                        etapa: etapaFrontend,
                        cantidad: 0,
                        tasa_conversion: '0%',
                        monto_potencial: 0
                    };
                }
                const cantidad = await this.trazabilidadRepository
                    .createQueryBuilder('t')
                    .where('t.id_ejecutiva = :ejecutivaId', { ejecutivaId })
                    .andWhere('t.id_empresa_prov = :empresaId', { empresaId })
                    .andWhere('t.etapa_oportunidad IN (:...etapas)', { etapas: etapasCorrespondientes })
                    .andWhere('t.nombre_oportunidad IS NOT NULL')
                    .getCount();
                const montoResult = await this.trazabilidadRepository
                    .createQueryBuilder('t')
                    .select('COALESCE(SUM(t.monto_total_sin_imp), 0)', 'monto')
                    .where('t.id_ejecutiva = :ejecutivaId', { ejecutivaId })
                    .andWhere('t.id_empresa_prov = :empresaId', { empresaId })
                    .andWhere('t.etapa_oportunidad IN (:...etapas)', { etapas: etapasCorrespondientes })
                    .andWhere('t.nombre_oportunidad IS NOT NULL')
                    .getRawOne();
                console.log(`📊 [Embudo] ${etapaFrontend}: ${cantidad} oportunidades, $${montoResult.monto}`);
                return {
                    etapa: etapaFrontend,
                    cantidad: cantidad,
                    tasa_conversion: this.calcularTasaConversion(etapaFrontend, cantidad),
                    monto_potencial: parseFloat(montoResult.monto) || 0
                };
            }));
            console.log('✅ [Embudo] Resultado final:', embudoAgrupado);
            return embudoAgrupado;
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardService] Error en getEmbudoVentasEjecutiva:', error);
            return [
                { etapa: "Prospección", cantidad: 0, tasa_conversion: "0%", monto_potencial: 0 },
                { etapa: "Calificación", cantidad: 0, tasa_conversion: "0%", monto_potencial: 0 },
                { etapa: "Propuesta", cantidad: 0, tasa_conversion: "0%", monto_potencial: 0 },
                { etapa: "Negociación", cantidad: 0, tasa_conversion: "0%", monto_potencial: 0 },
                { etapa: "Cierre", cantidad: 0, tasa_conversion: "0%", monto_potencial: 0 }
            ];
        }
    }
    calcularTasaConversion(etapa, cantidad) {
        const tasas = {
            'Prospección': '100%',
            'Calificación': '75%',
            'Propuesta': '50%',
            'Negociación': '25%',
            'Cierre': '10%'
        };
        return tasas[etapa] || '0%';
    }
    async getEstadisticasEjecutivaCompleta(ejecutivaId, empresaId) {
        try {
            console.log('📈 [EmpresaDashboardService] Obteniendo estadísticas COMPLETAS para ejecutiva:', ejecutivaId);
            const [clientesActivos, ventasGanadas, totalActividades, actividadesEsteMes, revenueTotal, totalOportunidades] = await Promise.all([
                this.getClientesActivosEjecutiva(ejecutivaId, empresaId),
                this.getVentasGanadasEjecutiva(ejecutivaId, empresaId),
                this.getTotalActividadesEjecutiva(ejecutivaId, empresaId),
                this.getActividadesEsteMesEjecutiva(ejecutivaId, empresaId),
                this.getRevenueEjecutiva(ejecutivaId, empresaId),
                this.getTotalOportunidadesEjecutiva(ejecutivaId, empresaId)
            ]);
            const tasaConversion = totalOportunidades > 0
                ? (ventasGanadas / totalOportunidades) * 100
                : 0;
            return {
                clientes_activos: clientesActivos,
                ventas_ganadas: ventasGanadas,
                total_actividades: totalActividades,
                actividades_este_mes: actividadesEsteMes,
                revenue_total: revenueTotal,
                tasa_conversion: `${tasaConversion.toFixed(1)}%`,
                tiempo_respuesta: this.calcularTiempoRespuestaPromedio(ejecutivaId, empresaId),
                total_oportunidades: totalOportunidades
            };
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardService] Error en getEstadisticasEjecutivaCompleta:', error);
            return {
                clientes_activos: 0,
                ventas_ganadas: 0,
                total_actividades: 0,
                actividades_este_mes: 0,
                revenue_total: 0,
                tasa_conversion: '0%',
                tiempo_respuesta: 'Por determinar',
                total_oportunidades: 0
            };
        }
    }
    async getTotalOportunidadesEjecutiva(ejecutivaId, empresaId) {
        return await this.trazabilidadRepository
            .createQueryBuilder('t')
            .where('t.id_ejecutiva = :ejecutivaId', { ejecutivaId })
            .andWhere('t.id_empresa_prov = :empresaId', { empresaId })
            .andWhere('t.nombre_oportunidad IS NOT NULL')
            .andWhere('t.etapa_oportunidad NOT IN (:...etapas)', {
            etapas: ['Venta perdida', 'Venta suspendida']
        })
            .getCount();
    }
    async getClientesPorEjecutiva(ejecutivaId, empresaId) {
        try {
            console.log('👥 [EmpresaDashboardService] Obteniendo clientes para ejecutiva:', ejecutivaId);
            const clientes = await this.clienteRepository
                .createQueryBuilder('cf')
                .select([
                'cf.id_cliente_final',
                'cf.razon_social',
                'cf.ruc',
                'cf.correo',
                'cf.telefono',
                'cf.pais',
                'cf.rubro',
                'cf.estado',
                'cf.fecha_creacion'
            ])
                .where('cf.id_ejecutiva = :ejecutivaId', { ejecutivaId })
                .andWhere('cf.id_empresa_prov = :empresaId', { empresaId })
                .orderBy('cf.fecha_creacion', 'DESC')
                .getMany();
            return clientes;
        }
        catch (error) {
            console.error('❌ [EmpresaDashboardService] Error en getClientesPorEjecutiva:', error);
            return [];
        }
    }
    async getClientesActivosEjecutiva(ejecutivaId, empresaId) {
        return await this.clienteRepository
            .createQueryBuilder('cf')
            .where('cf.id_ejecutiva = :ejecutivaId', { ejecutivaId })
            .andWhere('cf.id_empresa_prov = :empresaId', { empresaId })
            .andWhere('cf.estado = :estado', { estado: 'Activo' })
            .getCount();
    }
    async getVentasGanadasEjecutiva(ejecutivaId, empresaId) {
        return await this.trazabilidadRepository
            .createQueryBuilder('t')
            .where('t.id_ejecutiva = :ejecutivaId', { ejecutivaId })
            .andWhere('t.id_empresa_prov = :empresaId', { empresaId })
            .andWhere('t.etapa_oportunidad = :etapa', { etapa: 'Venta ganada' })
            .getCount();
    }
    async getTotalActividadesEjecutiva(ejecutivaId, empresaId) {
        return await this.trazabilidadRepository
            .createQueryBuilder('t')
            .where('t.id_ejecutiva = :ejecutivaId', { ejecutivaId })
            .andWhere('t.id_empresa_prov = :empresaId', { empresaId })
            .getCount();
    }
    async getActividadesEsteMesEjecutiva(ejecutivaId, empresaId) {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        return await this.trazabilidadRepository
            .createQueryBuilder('t')
            .where('t.id_ejecutiva = :ejecutivaId', { ejecutivaId })
            .andWhere('t.id_empresa_prov = :empresaId', { empresaId })
            .andWhere('t.fecha_contacto >= :startOfMonth', { startOfMonth })
            .getCount();
    }
    async getRevenueEjecutiva(ejecutivaId, empresaId) {
        const result = await this.trazabilidadRepository
            .createQueryBuilder('t')
            .select('COALESCE(SUM(t.monto_cierre_final), 0)', 'revenue')
            .where('t.id_ejecutiva = :ejecutivaId', { ejecutivaId })
            .andWhere('t.id_empresa_prov = :empresaId', { empresaId })
            .andWhere('t.etapa_oportunidad = :etapa', { etapa: 'Venta ganada' })
            .getRawOne();
        return parseFloat(result.revenue) || 0;
    }
    async getConversionPromedioEquipo(empresaId) {
        const [ventasGanadas, totalActividades] = await Promise.all([
            this.getVentasGanadas(empresaId),
            this.getTotalActividades(empresaId)
        ]);
        return totalActividades > 0 ? Math.round((ventasGanadas / totalActividades) * 100) : 0;
    }
    calcularTiempoRespuestaPromedio(ejecutivaId, empresaId) {
        return '< 24 horas';
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