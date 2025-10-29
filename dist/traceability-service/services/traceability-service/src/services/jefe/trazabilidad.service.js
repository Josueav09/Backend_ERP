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
    constructor(trazabilidadRepository, ejecutivaRepository, empresaRepository, clienteRepository) {
        this.trazabilidadRepository = trazabilidadRepository;
        this.ejecutivaRepository = ejecutivaRepository;
        this.empresaRepository = empresaRepository;
        this.clienteRepository = clienteRepository;
        console.log('🔧 TrazabilidadService inicializado');
    }
    async getTrazabilidad(filters) {
        try {
            console.log('🔍 [TrazabilidadService] getTrazabilidad ejecutándose');
            console.log('🔍 Filters recibidos:', filters);
            const { empresaId, ejecutivaId, clienteId, fechaInicio, fechaFin, tipoContacto, etapaOportunidad, etapa } = filters || {};
            const query = this.trazabilidadRepository
                .createQueryBuilder('trazabilidad')
                .leftJoinAndSelect('trazabilidad.ejecutiva', 'ejecutiva')
                .leftJoinAndSelect('trazabilidad.empresa_proveedora', 'empresa')
                .leftJoinAndSelect('trazabilidad.cliente_final', 'cliente')
                .leftJoinAndSelect('trazabilidad.persona_contacto', 'contacto')
                .orderBy('trazabilidad.fecha_contacto', 'DESC');
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
        if (!ejecutiva)
            throw new common_1.HttpException('Ejecutiva no encontrada', common_1.HttpStatus.BAD_REQUEST);
        if (!empresa)
            throw new common_1.HttpException('Empresa proveedora no encontrada', common_1.HttpStatus.BAD_REQUEST);
        if (!cliente)
            throw new common_1.HttpException('Cliente final no encontrado', common_1.HttpStatus.BAD_REQUEST);
        if (!contacto)
            throw new common_1.HttpException('Persona de contacto no encontrada', common_1.HttpStatus.BAD_REQUEST);
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
    async getKPIs(filters) {
        console.log('🔍 [TrazabilidadService.getKPIs] Filtros recibidos:', filters);
        const query = this.trazabilidadRepository.createQueryBuilder('t')
            .leftJoin('t.ejecutiva', 'ej')
            .leftJoin('t.empresa_proveedora', 'ep')
            .leftJoin('t.cliente_final', 'cf');
        if (filters.ejecutivaId) {
            query.andWhere('t.id_ejecutiva = :ejecutivaId', { ejecutivaId: filters.ejecutivaId });
        }
        if (filters.empresaId) {
            query.andWhere('t.id_empresa_prov = :empresaId', { empresaId: filters.empresaId });
        }
        if (filters.clienteId) {
            query.andWhere('t.id_cliente_final = :clienteId', { clienteId: filters.clienteId });
        }
        if (filters.fechaDesde) {
            query.andWhere('t.fecha_contacto >= :fechaDesde', { fechaDesde: filters.fechaDesde });
        }
        if (filters.fechaHasta) {
            query.andWhere('t.fecha_contacto <= :fechaHasta', { fechaHasta: filters.fechaHasta });
        }
        const data = await query.getMany();
        console.log('📊 [TrazabilidadService] Datos encontrados:', data.length, 'registros');
        const totalOportunidades = data.length;
        const enProceso = data.filter(t => ['Prospección', 'Calificación', 'Detección de necesidades', 'Presentación de solución'].includes(t.etapa_oportunidad)).length;
        const ventasGanadas = data.filter(t => t.etapa_oportunidad === 'Venta ganada').length;
        const ventasPerdidas = data.filter(t => t.etapa_oportunidad === 'Venta perdida').length;
        const montoTotal = data.reduce((sum, t) => sum + (Number(t.monto_total_sin_imp) || 0), 0);
        const oportunidadesEmbudo = data.filter(t => t.pasa_embudo_ventas === true);
        const tasaConversion = oportunidadesEmbudo.length > 0 ?
            (ventasGanadas / oportunidadesEmbudo.length) * 100 : 0;
        console.log('📈 [TrazabilidadService] KPIs calculados:', {
            totalOportunidades,
            enProceso,
            ventasGanadas,
            ventasPerdidas,
            montoTotal,
            tasaConversion: Math.round(tasaConversion * 100) / 100
        });
        return {
            totalOportunidades,
            enProceso,
            ventasGanadas,
            ventasPerdidas,
            montoTotal,
            tasaConversion: Math.round(tasaConversion * 100) / 100
        };
    }
    async getNuevosClientes(meses = 6, ejecutivaId) {
        console.log('🔄 [getNuevosClientes] === INICIANDO ===');
        const fechaActual = new Date();
        const fechaInicio = new Date();
        fechaInicio.setMonth(fechaActual.getMonth() - meses);
        console.log('📅 [getNuevosClientes] FECHAS CALCULADAS:');
        console.log('   - Fecha actual:', fechaActual.toISOString());
        console.log('   - Fecha inicio (hace', meses, 'meses):', fechaInicio.toISOString());
        const query = this.trazabilidadRepository.createQueryBuilder('t')
            .select('EXTRACT(MONTH FROM t.fecha_contacto)', 'mes_numero')
            .addSelect('EXTRACT(YEAR FROM t.fecha_contacto)', 'anio')
            .addSelect(`CASE 
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 1 THEN 'Ene'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 2 THEN 'Feb' 
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 3 THEN 'Mar'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 4 THEN 'Abr'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 5 THEN 'May'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 6 THEN 'Jun'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 7 THEN 'Jul'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 8 THEN 'Ago'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 9 THEN 'Sep'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 10 THEN 'Oct'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 11 THEN 'Nov'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 12 THEN 'Dic'
      END`, 'mes_nombre')
            .addSelect('COUNT(t.id_trazabilidad)', 'contactos')
            .where('t.fecha_contacto >= :fechaInicio', { fechaInicio })
            .groupBy('EXTRACT(MONTH FROM t.fecha_contacto), EXTRACT(YEAR FROM t.fecha_contacto)')
            .orderBy('EXTRACT(YEAR FROM t.fecha_contacto), EXTRACT(MONTH FROM t.fecha_contacto)', 'ASC');
        if (ejecutivaId) {
            query.andWhere('t.id_ejecutiva = :ejecutivaId', { ejecutivaId });
        }
        const data = await query.getRawMany();
        console.log('📊 [getNuevosClientes] RESULTADO:', data);
        if (data.length > 0) {
            const resultado = data.map(item => ({
                mes: `${item.mes_nombre} ${item.anio}`.trim(),
                contactos: parseInt(item.contactos) || 0
            }));
            console.log('✅ [getNuevosClientes] DATOS FINALES:', resultado);
            return resultado;
        }
        return [
            { mes: 'Oct 2025', contactos: 1 },
            { mes: 'Sep 2025', contactos: 0 },
            { mes: 'Ago 2025', contactos: 0 }
        ];
    }
    async getContactosPorTipo(filters) {
        const query = this.trazabilidadRepository.createQueryBuilder('t')
            .select('t.tipo_contacto as name')
            .addSelect('COUNT(*) as value')
            .groupBy('t.tipo_contacto');
        if (filters.ejecutivaId) {
            query.andWhere('t.id_ejecutiva = :ejecutivaId', { ejecutivaId: filters.ejecutivaId });
        }
        if (filters.fechaDesde) {
            query.andWhere('t.fecha_contacto >= :fechaDesde', { fechaDesde: filters.fechaDesde });
        }
        if (filters.fechaHasta) {
            query.andWhere('t.fecha_contacto <= :fechaHasta', { fechaHasta: filters.fechaHasta });
        }
        const data = await query.getRawMany();
        const colorMap = {
            'Llamada telefónica': '#3B82F6',
            'Correo electrónico': '#A855F7',
            'Chat de Whatsapp': '#10B981',
            'Contacto por linkedin': '#0EA5E9',
            'Reunión presencial': '#F97316',
            'Otro': '#6B7280'
        };
        return data.map(item => ({
            name: this.mapTipoContacto(item.name),
            value: parseInt(item.value),
            color: colorMap[item.name] || '#6B7280'
        }));
    }
    async getMontosPorEtapa(filters) {
        const query = this.trazabilidadRepository.createQueryBuilder('t')
            .select('t.etapa_oportunidad as etapa')
            .addSelect('SUM(t.monto_total_sin_imp) as monto')
            .where('t.pasa_embudo_ventas = true')
            .andWhere('t.etapa_oportunidad IS NOT NULL')
            .groupBy('t.etapa_oportunidad');
        if (filters.ejecutivaId) {
            query.andWhere('t.id_ejecutiva = :ejecutivaId', { ejecutivaId: filters.ejecutivaId });
        }
        if (filters.fechaDesde) {
            query.andWhere('t.fecha_registro_oportunidad >= :fechaDesde', { fechaDesde: filters.fechaDesde });
        }
        if (filters.fechaHasta) {
            query.andWhere('t.fecha_registro_oportunidad <= :fechaHasta', { fechaHasta: filters.fechaHasta });
        }
        const data = await query.getRawMany();
        return data.map(item => ({
            etapa: item.etapa,
            monto: parseFloat(item.monto) || 0
        }));
    }
    async getTasaConversion(filters) {
        console.log('🔄 [getTasaConversion] Obteniendo ventas cerradas por ejecutiva...');
        const query = this.trazabilidadRepository.createQueryBuilder('t')
            .leftJoin('t.ejecutiva', 'ej')
            .select('ej.id_ejecutiva', 'id_ejecutiva')
            .addSelect('ej.nombre_completo', 'ejecutiva')
            .addSelect('COUNT(t.id_trazabilidad)', 'total_oportunidades')
            .addSelect('COUNT(CASE WHEN t.etapa_oportunidad = \'Venta ganada\' THEN 1 END)', 'ventas_ganadas')
            .addSelect('COUNT(CASE WHEN t.etapa_oportunidad = \'Venta perdida\' THEN 1 END)', 'ventas_perdidas')
            .addSelect('SUM(CASE WHEN t.etapa_oportunidad = \'Venta ganada\' THEN t.monto_cierre_final ELSE 0 END)', 'monto_total_ganado')
            .where('t.pasa_embudo_ventas = true')
            .andWhere('t.etapa_oportunidad IS NOT NULL')
            .groupBy('ej.id_ejecutiva, ej.nombre_completo')
            .having('COUNT(t.id_trazabilidad) > 0');
        if (filters.fechaDesde) {
            query.andWhere('t.fecha_contacto >= :fechaDesde', { fechaDesde: filters.fechaDesde });
        }
        if (filters.fechaHasta) {
            query.andWhere('t.fecha_contacto <= :fechaHasta', { fechaHasta: filters.fechaHasta });
        }
        const data = await query.getRawMany();
        console.log('📊 [getTasaConversion] Datos crudos:', data);
        const resultado = data.map(item => ({
            id_ejecutiva: item.id_ejecutiva,
            ejecutiva: item.ejecutiva?.split(' ')[0] || item.ejecutiva || 'N/A',
            ventas_ganadas: parseInt(item.ventas_ganadas) || 0,
            ventas_perdidas: parseInt(item.ventas_perdidas) || 0,
            total_oportunidades: parseInt(item.total_oportunidades) || 0,
            monto_total_ganado: parseFloat(item.monto_total_ganado) || 0,
            tasa: item.ventas_ganadas > 0 ?
                Math.round((item.ventas_ganadas / item.total_oportunidades) * 100 * 10) / 10 : 0
        }));
        console.log('✅ [getTasaConversion] Resultado final:', resultado);
        return resultado;
    }
    async getEtapa1(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;
        const query = this.trazabilidadRepository.createQueryBuilder('t')
            .leftJoinAndSelect('t.ejecutiva', 'ej')
            .leftJoinAndSelect('t.empresa_proveedora', 'ep')
            .leftJoinAndSelect('t.cliente_final', 'cf')
            .leftJoinAndSelect('t.persona_contacto', 'pc')
            .select([
            't.id_trazabilidad',
            't.fecha_contacto',
            't.tipo_contacto',
            't.resultado_contacto',
            't.pasa_embudo_ventas',
            't.informacion_importante',
            't.reunion_agendada',
            't.fecha_reunion',
            't.participantes',
            't.se_dio_reunion',
            't.resultados_reunion',
            't.observaciones',
            'ej.id_ejecutiva',
            'ej.nombre_completo',
            'ep.id_empresa_prov',
            'ep.razon_social',
            'cf.id_cliente_final',
            'cf.razon_social',
            'pc.id_contacto',
            'pc.nombre_completo',
            'pc.cargo',
            'pc.correo'
        ]);
        if (filters.ejecutivaId) {
            query.andWhere('t.id_ejecutiva = :ejecutivaId', { ejecutivaId: filters.ejecutivaId });
        }
        if (filters.empresaId) {
            query.andWhere('t.id_empresa_prov = :empresaId', { empresaId: filters.empresaId });
        }
        if (filters.clienteId) {
            query.andWhere('t.id_cliente_final = :clienteId', { clienteId: filters.clienteId });
        }
        if (filters.resultadoContacto) {
            query.andWhere('t.resultado_contacto = :resultado', { resultado: filters.resultadoContacto });
        }
        if (filters.tipoContacto) {
            query.andWhere('t.tipo_contacto = :tipo', { tipo: filters.tipoContacto });
        }
        if (filters.fechaDesde) {
            query.andWhere('t.fecha_contacto >= :fechaDesde', { fechaDesde: filters.fechaDesde });
        }
        if (filters.fechaHasta) {
            query.andWhere('t.fecha_contacto <= :fechaHasta', { fechaHasta: filters.fechaHasta });
        }
        query.orderBy('t.fecha_contacto', 'DESC');
        query.skip(skip).take(limit);
        const [data, total] = await query.getManyAndCount();
        const etapa1Data = data.map(t => ({
            id: t.id_trazabilidad,
            clienteFinal: t.cliente_final?.razon_social || 'N/A',
            personaContacto: t.persona_contacto?.nombre_completo || 'N/A',
            ejecutiva: t.ejecutiva?.nombre_completo || 'N/A',
            tipoContacto: t.tipo_contacto,
            fechaContacto: this.formatDate(t.fecha_contacto),
            resultadoContacto: t.resultado_contacto,
            pasaEmbudo: t.pasa_embudo_ventas,
            informacionImportante: t.informacion_importante || '',
            fechaReunion: t.fecha_reunion?.toISOString().split('T')[0] || null,
            participantes: t.participantes || null,
            resultadosReunion: t.resultados_reunion || null,
            observaciones: t.observaciones || ''
        }));
        console.log('📊 [getEtapa1] Total registros encontrados:', total);
        console.log('📊 [getEtapa1] Tipos de contacto únicos:', [...new Set(data.map(item => item.tipo_contacto))]);
        return {
            data: etapa1Data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    async getEtapa2(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;
        const query = this.trazabilidadRepository.createQueryBuilder('t')
            .leftJoinAndSelect('t.ejecutiva', 'ej')
            .leftJoinAndSelect('t.empresa_proveedora', 'ep')
            .leftJoinAndSelect('t.cliente_final', 'cf')
            .where('t.pasa_embudo_ventas = true')
            .andWhere('t.nombre_oportunidad IS NOT NULL')
            .select([
            't.id_trazabilidad',
            't.nombre_oportunidad',
            't.tipo_oportunidad',
            't.etapa_oportunidad',
            't.monto_total_sin_imp',
            't.probabilidad_cierre',
            't.fecha_cierre_esperado',
            't.producto_ofrecido',
            't.observaciones',
            't.monto_cierre_final',
            't.fecha_registro_oportunidad',
            'ej.id_ejecutiva',
            'ej.nombre_completo',
            'ep.id_empresa_prov',
            'ep.razon_social',
            'cf.id_cliente_final',
            'cf.razon_social'
        ]);
        if (filters.ejecutivaId) {
            query.andWhere('t.id_ejecutiva = :ejecutivaId', { ejecutivaId: filters.ejecutivaId });
        }
        if (filters.empresaId) {
            query.andWhere('t.id_empresa_prov = :empresaId', { empresaId: filters.empresaId });
        }
        if (filters.clienteId) {
            query.andWhere('t.id_cliente_final = :clienteId', { clienteId: filters.clienteId });
        }
        if (filters.etapaOportunidad && filters.etapaOportunidad !== 'all') {
            query.andWhere('t.etapa_oportunidad = :etapa', { etapa: filters.etapaOportunidad });
        }
        if (filters.fechaDesde) {
            query.andWhere('t.fecha_registro_oportunidad >= :fechaDesde', { fechaDesde: filters.fechaDesde });
        }
        if (filters.fechaHasta) {
            query.andWhere('t.fecha_registro_oportunidad <= :fechaHasta', { fechaHasta: filters.fechaHasta });
        }
        query.orderBy('t.fecha_cierre_esperado', 'ASC');
        query.skip(skip).take(limit);
        const [data, total] = await query.getManyAndCount();
        const etapa2Data = data.map(t => ({
            id: t.id_trazabilidad,
            nombreOportunidad: t.nombre_oportunidad || 'Sin nombre',
            ejecutiva: t.ejecutiva?.nombre_completo || 'N/A',
            clienteFinal: t.cliente_final?.razon_social || 'N/A',
            tipoOportunidad: t.tipo_oportunidad || 'N/A',
            etapaOportunidad: t.etapa_oportunidad || 'Prospección',
            montoTotal: Number(t.monto_total_sin_imp) || 0,
            probabilidad_cierre: t.probabilidad_cierre || 0,
            fechaCierreEsperado: this.formatDate(t.fecha_cierre_esperado),
            productoOfrecido: t.producto_ofrecido || '',
            observaciones: t.observaciones || '',
            montoCierreFinal: t.monto_cierre_final ? Number(t.monto_cierre_final) : null
        }));
        console.log('✅ [getEtapa2] Datos mapeados exitosamente:', etapa2Data.length, 'registros');
        return {
            data: etapa2Data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    async getFilterOptions() {
        console.log('🔄 [TrazabilidadService] Obteniendo opciones de filtro desde BD...');
        try {
            const [ejecutivas, empresas, clientes] = await Promise.all([
                this.ejecutivaRepository.find({
                    select: ['id_ejecutiva', 'nombre_completo'],
                    where: { estado_ejecutiva: 'Activo' },
                    order: { nombre_completo: 'ASC' }
                }),
                this.empresaRepository.find({
                    select: ['id_empresa_prov', 'razon_social'],
                    where: { estado: 'Activo' },
                    order: { razon_social: 'ASC' }
                }),
                this.clienteRepository.find({
                    select: ['id_cliente_final', 'razon_social'],
                    order: { razon_social: 'ASC' }
                })
            ]);
            console.log(`📊 [TrazabilidadService] Datos obtenidos - Ejecutivas: ${ejecutivas.length}, Empresas: ${empresas.length}, Clientes: ${clientes.length}`);
            return {
                ejecutivas: ejecutivas.map(e => ({
                    id: e.id_ejecutiva,
                    nombre_completo: e.nombre_completo || 'Sin nombre'
                })),
                empresas: empresas.map(e => ({
                    id: e.id_empresa_prov,
                    razon_social: e.razon_social || 'Sin razón social'
                })),
                clientes: clientes.map(c => ({
                    id: c.id_cliente_final,
                    razon_social: c.razon_social || 'Sin razón social'
                }))
            };
        }
        catch (error) {
            console.error('❌ [TrazabilidadService] Error obteniendo opciones de filtro:', error);
            return {
                ejecutivas: [],
                empresas: [],
                clientes: []
            };
        }
    }
    mapTipoContacto(tipo) {
        const map = {
            'Llamada telefónica': 'Llamada',
            'Chat de Whatsapp': 'WhatsApp',
            'Correo electrónico': 'Email',
            'Contacto por linkedin': 'LinkedIn',
            'Reunión presencial': 'Reunión presencial',
            'Otro': 'Otro'
        };
        return map[tipo] || tipo;
    }
    formatDate(dateValue) {
        if (!dateValue)
            return '';
        try {
            if (typeof dateValue === 'string') {
                return dateValue.split('T')[0];
            }
            else if (dateValue instanceof Date) {
                return dateValue.toISOString().split('T')[0];
            }
            else {
                return String(dateValue).split('T')[0];
            }
        }
        catch (error) {
            console.warn('⚠️ Error formateando fecha:', dateValue, error);
            return '';
        }
    }
    async getNuevasReunionesAgendadas(meses = 6, ejecutivaId) {
        console.log('🔄 [getNuevasReunionesAgendadas] === INICIANDO ===');
        const query = this.trazabilidadRepository.createQueryBuilder('t')
            .select('EXTRACT(MONTH FROM t.fecha_reunion)', 'mes_numero')
            .addSelect('EXTRACT(YEAR FROM t.fecha_reunion)', 'anio')
            .addSelect(`CASE 
        WHEN EXTRACT(MONTH FROM t.fecha_reunion) = 1 THEN 'Ene'
        WHEN EXTRACT(MONTH FROM t.fecha_reunion) = 2 THEN 'Feb' 
        WHEN EXTRACT(MONTH FROM t.fecha_reunion) = 3 THEN 'Mar'
        WHEN EXTRACT(MONTH FROM t.fecha_reunion) = 4 THEN 'Abr'
        WHEN EXTRACT(MONTH FROM t.fecha_reunion) = 5 THEN 'May'
        WHEN EXTRACT(MONTH FROM t.fecha_reunion) = 6 THEN 'Jun'
        WHEN EXTRACT(MONTH FROM t.fecha_reunion) = 7 THEN 'Jul'
        WHEN EXTRACT(MONTH FROM t.fecha_reunion) = 8 THEN 'Ago'
        WHEN EXTRACT(MONTH FROM t.fecha_reunion) = 9 THEN 'Sep'
        WHEN EXTRACT(MONTH FROM t.fecha_reunion) = 10 THEN 'Oct'
        WHEN EXTRACT(MONTH FROM t.fecha_reunion) = 11 THEN 'Nov'
        WHEN EXTRACT(MONTH FROM t.fecha_reunion) = 12 THEN 'Dic'
      END`, 'mes_nombre')
            .addSelect('COUNT(t.id_trazabilidad)', 'reuniones')
            .where('t.reunion_agendada = true')
            .andWhere('t.fecha_reunion IS NOT NULL')
            .groupBy('EXTRACT(MONTH FROM t.fecha_reunion), EXTRACT(YEAR FROM t.fecha_reunion)')
            .orderBy('EXTRACT(YEAR FROM t.fecha_reunion), EXTRACT(MONTH FROM t.fecha_reunion)', 'ASC');
        if (ejecutivaId) {
            query.andWhere('t.id_ejecutiva = :ejecutivaId', { ejecutivaId });
        }
        const data = await query.getRawMany();
        console.log('📊 [getNuevasReunionesAgendadas] RESULTADO:', data);
        if (data.length > 0) {
            return data.map(item => ({
                mes: `${item.mes_nombre} ${item.anio}`.trim(),
                reuniones: parseInt(item.reuniones) || 0
            }));
        }
        return [];
    }
    async getNuevasVentas(meses = 6, ejecutivaId) {
        console.log('🔄 [getNuevasVentas] === INICIANDO ===');
        const query = this.trazabilidadRepository.createQueryBuilder('t')
            .select('EXTRACT(MONTH FROM t.fecha_contacto)', 'mes_numero')
            .addSelect('EXTRACT(YEAR FROM t.fecha_contacto)', 'anio')
            .addSelect(`CASE 
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 1 THEN 'Ene'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 2 THEN 'Feb' 
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 3 THEN 'Mar'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 4 THEN 'Abr'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 5 THEN 'May'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 6 THEN 'Jun'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 7 THEN 'Jul'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 8 THEN 'Ago'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 9 THEN 'Sep'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 10 THEN 'Oct'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 11 THEN 'Nov'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 12 THEN 'Dic'
      END`, 'mes_nombre')
            .addSelect('COUNT(t.id_trazabilidad)', 'ventas')
            .where('t.etapa_oportunidad = :etapa', { etapa: 'Venta ganada' })
            .groupBy('EXTRACT(MONTH FROM t.fecha_contacto), EXTRACT(YEAR FROM t.fecha_contacto)')
            .orderBy('EXTRACT(YEAR FROM t.fecha_contacto), EXTRACT(MONTH FROM t.fecha_contacto)', 'ASC');
        if (ejecutivaId) {
            query.andWhere('t.id_ejecutiva = :ejecutivaId', { ejecutivaId });
        }
        const data = await query.getRawMany();
        console.log('📊 [getNuevasVentas] RESULTADO:', data);
        if (data.length > 0) {
            return data.map(item => ({
                mes: `${item.mes_nombre} ${item.anio}`.trim(),
                ventas: parseInt(item.ventas) || 0
            }));
        }
        return [];
    }
    async getEfectividadCanalesContacto(filters) {
        const query = this.trazabilidadRepository.createQueryBuilder('t')
            .select('t.tipo_contacto as canal')
            .addSelect('COUNT(*) as total_contactos')
            .addSelect(`COUNT(CASE WHEN t.resultado_contacto = 'Positivo' THEN 1 END) as positivos`)
            .addSelect(`COUNT(CASE WHEN t.resultado_contacto = 'Negativo' THEN 1 END) as negativos`)
            .addSelect(`COUNT(CASE WHEN t.resultado_contacto = 'Pendiente' THEN 1 END) as pendientes`)
            .addSelect(`COUNT(CASE WHEN t.resultado_contacto = 'Neutro' THEN 1 END) as neutros`)
            .groupBy('t.tipo_contacto')
            .orderBy(`COUNT(CASE WHEN t.resultado_contacto = 'Positivo' THEN 1 END)`, 'DESC');
        if (filters?.ejecutivaId) {
            query.andWhere('t.id_ejecutiva = :ejecutivaId', { ejecutivaId: filters.ejecutivaId });
        }
        if (filters?.fechaDesde) {
            query.andWhere('t.fecha_contacto >= :fechaDesde', { fechaDesde: filters.fechaDesde });
        }
        if (filters?.fechaHasta) {
            query.andWhere('t.fecha_contacto <= :fechaHasta', { fechaHasta: filters.fechaHasta });
        }
        const data = await query.getRawMany();
        console.log('📊 [getEfectividadCanalesContacto] Datos:', data);
        return data.map(item => ({
            canal: this.mapTipoContacto(item.canal),
            total_contactos: parseInt(item.total_contactos),
            positivos: parseInt(item.positivos),
            negativos: parseInt(item.negativos),
            pendientes: parseInt(item.pendientes),
            neutros: parseInt(item.neutros),
            efectividad: item.total_contactos > 0 ?
                Math.round((parseInt(item.positivos) / parseInt(item.total_contactos)) * 100) : 0
        }));
    }
    async getResumenSemanalEjecutivas() {
        const query = this.trazabilidadRepository.createQueryBuilder('t')
            .leftJoin('t.ejecutiva', 'ej')
            .select('ej.id_ejecutiva', 'id_ejecutiva')
            .addSelect('ej.nombre_completo', 'ejecutiva')
            .addSelect('COUNT(t.id_trazabilidad)', 'total_actividades')
            .addSelect(`COUNT(CASE WHEN t.reunion_agendada = true THEN 1 END) as reuniones_agendadas`)
            .addSelect(`COUNT(CASE WHEN t.etapa_oportunidad = 'Venta ganada' THEN 1 END) as ventas_ganadas`)
            .addSelect(`SUM(CASE WHEN t.etapa_oportunidad = 'Venta ganada' THEN t.monto_cierre_final ELSE 0 END) as monto_total`)
            .where('t.fecha_contacto IS NOT NULL')
            .groupBy('ej.id_ejecutiva, ej.nombre_completo')
            .orderBy('ventas_ganadas', 'DESC')
            .addOrderBy('reuniones_agendadas', 'DESC');
        const data = await query.getRawMany();
        console.log('📊 [getResumenSemanalEjecutivas] Datos reales:', data);
        return data.map(item => ({
            id_ejecutiva: item.id_ejecutiva,
            ejecutiva: item.ejecutiva?.split(' ')[0] || item.ejecutiva || 'Sin nombre',
            total_actividades: parseInt(item.total_actividades) || 0,
            reuniones_agendadas: parseInt(item.reuniones_agendadas) || 0,
            ventas_ganadas: parseInt(item.ventas_ganadas) || 0,
            monto_total: parseFloat(item.monto_total) || 0
        }));
    }
    async getEmbudoVentas(filters) {
        const query = this.trazabilidadRepository.createQueryBuilder('t')
            .select('t.etapa_oportunidad as etapa')
            .addSelect('COUNT(t.id_trazabilidad) as cantidad')
            .addSelect('SUM(t.monto_total_sin_imp) as monto_total')
            .where('t.pasa_embudo_ventas = true')
            .andWhere('t.etapa_oportunidad IS NOT NULL')
            .andWhere('t.etapa_oportunidad != :perdida', { perdida: 'Venta perdida' })
            .groupBy('t.etapa_oportunidad')
            .orderBy('COUNT(t.id_trazabilidad)', 'DESC');
        if (filters?.ejecutivaId) {
            query.andWhere('t.id_ejecutiva = :ejecutivaId', { ejecutivaId: filters.ejecutivaId });
        }
        const data = await query.getRawMany();
        console.log('📊 [getEmbudoVentas] Datos crudos ordenados:', data);
        const maxCantidad = data.length > 0 ? Math.max(...data.map(d => parseInt(d.cantidad))) : 0;
        const embudo = data.map(d => {
            const cantidad = parseInt(d.cantidad);
            const porcentajeDesdeInicio = maxCantidad > 0 ? Math.round((cantidad / maxCantidad) * 100) : 0;
            return {
                etapa: this.acortarEtapa(d.etapa),
                cantidad: cantidad,
                monto_total: parseFloat(d.monto_total) || 0,
                tasa_conversion: porcentajeDesdeInicio,
                perdida: 0
            };
        });
        console.log('📊 [getEmbudoVentas] Embudo final con % correctos:', embudo);
        return embudo;
    }
    acortarEtapa(etapa) {
        const acortamientos = {
            'Prospección': 'Prosp.',
            'Calificación': 'Calif.',
            'Detección de necesidades': 'Detección',
            'Presentación de solución': 'Present. Solución',
            'Manejo de objeciones': 'Objeciones',
            'Presentación de propuesta': 'Present. Propuesta',
            'Negociación': 'Negoc.',
            'Firma de contrato': 'Firma',
            'Venta ganada': 'Venta Ganada'
        };
        return acortamientos[etapa] || etapa;
    }
    async getRankingEjecutivas(filters) {
        const query = this.trazabilidadRepository.createQueryBuilder('t')
            .leftJoin('t.ejecutiva', 'ej')
            .select('ej.id_ejecutiva', 'id_ejecutiva')
            .addSelect('ej.nombre_completo', 'ejecutiva')
            .addSelect(`COUNT(CASE WHEN t.etapa_oportunidad = 'Venta ganada' THEN 1 END) as ventas_ganadas`)
            .addSelect(`SUM(CASE WHEN t.etapa_oportunidad = 'Venta ganada' THEN t.monto_cierre_final ELSE 0 END) as monto_total`)
            .addSelect(`COUNT(CASE WHEN t.pasa_embudo_ventas = true AND t.etapa_oportunidad != 'Venta ganada' THEN 1 END) as clientes_potenciales`)
            .where('t.pasa_embudo_ventas = true')
            .groupBy('ej.id_ejecutiva, ej.nombre_completo')
            .orderBy('ventas_ganadas', 'DESC')
            .addOrderBy('monto_total', 'DESC');
        if (filters?.fechaDesde) {
            query.andWhere('t.fecha_contacto >= :fechaDesde', { fechaDesde: filters.fechaDesde });
        }
        if (filters?.fechaHasta) {
            query.andWhere('t.fecha_contacto <= :fechaHasta', { fechaHasta: filters.fechaHasta });
        }
        const data = await query.getRawMany();
        return data.map(item => {
            const ventasGanadas = parseInt(item.ventas_ganadas) || 0;
            const clientesPotenciales = parseInt(item.clientes_potenciales) || 0;
            const totalOportunidades = ventasGanadas + clientesPotenciales;
            return {
                id_ejecutiva: item.id_ejecutiva,
                ejecutiva: item.ejecutiva?.split(' ')[0] || item.ejecutiva,
                ventas_ganadas: ventasGanadas,
                monto_total: parseFloat(item.monto_total) || 0,
                clientes_potenciales: clientesPotenciales,
                efectividad: totalOportunidades > 0 ?
                    Math.round((ventasGanadas / totalOportunidades) * 100) : 0
            };
        });
    }
    async getEtapa1ForReport(filters) {
        console.log('📊 [getEtapa1ForReport] Generando reporte Etapa 1 con filtros:', filters);
        const query = this.trazabilidadRepository.createQueryBuilder('t')
            .leftJoinAndSelect('t.ejecutiva', 'ej')
            .leftJoinAndSelect('t.empresa_proveedora', 'ep')
            .leftJoinAndSelect('t.cliente_final', 'cf')
            .leftJoinAndSelect('t.persona_contacto', 'pc')
            .select([
            't.id_trazabilidad',
            't.fecha_contacto',
            't.tipo_contacto',
            't.resultado_contacto',
            't.pasa_embudo_ventas',
            't.informacion_importante',
            't.reunion_agendada',
            't.fecha_reunion',
            't.participantes',
            't.se_dio_reunion',
            't.resultados_reunion',
            't.observaciones',
            'ej.nombre_completo',
            'ep.razon_social',
            'cf.razon_social',
            'pc.nombre_completo',
            'pc.cargo',
            'pc.correo'
        ]);
        if (filters.ejecutivaId) {
            query.andWhere('t.id_ejecutiva = :ejecutivaId', { ejecutivaId: filters.ejecutivaId });
        }
        if (filters.empresaId) {
            query.andWhere('t.id_empresa_prov = :empresaId', { empresaId: filters.empresaId });
        }
        if (filters.clienteId) {
            query.andWhere('t.id_cliente_final = :clienteId', { clienteId: filters.clienteId });
        }
        if (filters.resultadoContacto) {
            query.andWhere('t.resultado_contacto = :resultado', { resultado: filters.resultadoContacto });
        }
        if (filters.tipoContacto) {
            query.andWhere('t.tipo_contacto = :tipo', { tipo: filters.tipoContacto });
        }
        if (filters.fechaDesde) {
            query.andWhere('t.fecha_contacto >= :fechaDesde', { fechaDesde: filters.fechaDesde });
        }
        if (filters.fechaHasta) {
            query.andWhere('t.fecha_contacto <= :fechaHasta', { fechaHasta: filters.fechaHasta });
        }
        query.orderBy('t.fecha_contacto', 'DESC');
        const data = await query.getMany();
        console.log('📊 [getEtapa1ForReport] Datos encontrados:', data.length);
        return data.map(item => ({
            'ID': item.id_trazabilidad,
            'Cliente Final': item.cliente_final?.razon_social || 'N/A',
            'Persona Contacto': item.persona_contacto?.nombre_completo || 'N/A',
            'Cargo Contacto': item.persona_contacto?.cargo || 'N/A',
            'Email Contacto': item.persona_contacto?.correo || 'N/A',
            'Ejecutiva': item.ejecutiva?.nombre_completo || 'N/A',
            'Empresa Proveedora': item.empresa_proveedora?.razon_social || 'N/A',
            'Tipo Contacto': this.mapTipoContacto(item.tipo_contacto),
            'Fecha Contacto': this.formatDateForCSV(item.fecha_contacto),
            'Resultado': item.resultado_contacto || 'Pendiente',
            'Pasa Embudo': item.pasa_embudo_ventas ? 'Sí' : 'No',
            'Información Importante': item.informacion_importante || '',
            'Reunión Agendada': item.reunion_agendada ? 'Sí' : 'No',
            'Fecha Reunión': this.formatDateForCSV(item.fecha_reunion),
            'Participantes': item.participantes || '',
            'Se Dio Reunión': item.se_dio_reunion ? 'Sí' : (item.se_dio_reunion === false ? 'No' : ''),
            'Resultados Reunión': item.resultados_reunion || '',
            'Observaciones': item.observaciones || ''
        }));
    }
    async getEtapa2ForReport(filters) {
        console.log('📊 [getEtapa2ForReport] Generando reporte Etapa 2 con filtros:', filters);
        const query = this.trazabilidadRepository.createQueryBuilder('t')
            .leftJoinAndSelect('t.ejecutiva', 'ej')
            .leftJoinAndSelect('t.empresa_proveedora', 'ep')
            .leftJoinAndSelect('t.cliente_final', 'cf')
            .where('t.pasa_embudo_ventas = true')
            .andWhere('t.nombre_oportunidad IS NOT NULL')
            .select([
            't.id_trazabilidad',
            't.nombre_oportunidad',
            't.tipo_oportunidad',
            't.etapa_oportunidad',
            't.monto_total_sin_imp',
            't.probabilidad_cierre',
            't.fecha_cierre_esperado',
            't.producto_ofrecido',
            't.observaciones',
            't.monto_cierre_final',
            't.fecha_registro_oportunidad',
            't.fecha_inicio_etapa',
            'ej.nombre_completo',
            'ep.razon_social',
            'cf.razon_social'
        ]);
        if (filters.ejecutivaId) {
            query.andWhere('t.id_ejecutiva = :ejecutivaId', { ejecutivaId: filters.ejecutivaId });
        }
        if (filters.empresaId) {
            query.andWhere('t.id_empresa_prov = :empresaId', { empresaId: filters.empresaId });
        }
        if (filters.clienteId) {
            query.andWhere('t.id_cliente_final = :clienteId', { clienteId: filters.clienteId });
        }
        if (filters.etapaOportunidad && filters.etapaOportunidad !== 'all') {
            query.andWhere('t.etapa_oportunidad = :etapa', { etapa: filters.etapaOportunidad });
        }
        if (filters.fechaDesde) {
            query.andWhere('t.fecha_registro_oportunidad >= :fechaDesde', { fechaDesde: filters.fechaDesde });
        }
        if (filters.fechaHasta) {
            query.andWhere('t.fecha_registro_oportunidad <= :fechaHasta', { fechaHasta: filters.fechaHasta });
        }
        query.orderBy('t.fecha_cierre_esperado', 'ASC');
        const data = await query.getMany();
        console.log('📊 [getEtapa2ForReport] Datos encontrados:', data.length);
        const calcularProbabilidad = (etapa) => {
            const probabilidades = {
                'Prospección': 10,
                'Calificación': 25,
                'Detección de necesidades': 40,
                'Presentación de solución': 50,
                'Manejo de objeciones': 60,
                'Presentación de propuesta': 75,
                'Negociación': 85,
                'Firma de contrato': 95,
                'Venta ganada': 100,
                'Venta perdida': 0,
                'Venta suspendida': 5
            };
            return probabilidades[etapa] || 0;
        };
        return data.map(item => {
            const probabilidadCalculada = calcularProbabilidad(item.etapa_oportunidad);
            return {
                'ID': item.id_trazabilidad,
                'Oportunidad': item.nombre_oportunidad || 'Sin nombre',
                'Cliente Final': item.cliente_final?.razon_social || 'N/A',
                'Ejecutiva': item.ejecutiva?.nombre_completo || 'N/A',
                'Empresa Proveedora': item.empresa_proveedora?.razon_social || 'N/A',
                'Tipo Oportunidad': item.tipo_oportunidad || 'N/A',
                'Etapa': item.etapa_oportunidad || 'Prospección',
                'Probabilidad Calculada': `${probabilidadCalculada}%`,
                'Monto Total': `$${Number(item.monto_total_sin_imp || 0).toLocaleString()}`,
                'Monto Cierre Final': item.monto_cierre_final ? `$${Number(item.monto_cierre_final).toLocaleString()}` : '',
                'Fecha Registro': this.formatDateForCSV(item.fecha_registro_oportunidad),
                'Fecha Inicio Etapa': this.formatDateForCSV(item.fecha_inicio_etapa),
                'Fecha Cierre Esperado': this.formatDateForCSV(item.fecha_cierre_esperado),
                'Producto Ofrecido': item.producto_ofrecido || '',
                'Observaciones': item.observaciones || '',
                'Estado': item.etapa_oportunidad === 'Venta ganada' ? 'GANADA' :
                    item.etapa_oportunidad === 'Venta perdida' ? 'PERDIDA' : 'EN PROCESO'
            };
        });
    }
    async generateReportCSV(filters, reportType) {
        try {
            console.log('🔄 [generateReportCSV] Iniciando con:', { filters, reportType });
            let data;
            if (reportType === 'etapa1') {
                console.log('📋 Obteniendo datos para etapa1...');
                data = await this.getEtapa1ForReport(filters);
            }
            else if (reportType === 'etapa2') {
                console.log('📋 Obteniendo datos para etapa2...');
                data = await this.getEtapa2ForReport(filters);
            }
            else {
                throw new Error(`Tipo de reporte no válido: ${reportType}`);
            }
            console.log('📊 Datos obtenidos:', data.length, 'registros');
            if (data.length === 0) {
                console.log('⚠️ No hay datos para generar el reporte');
                return 'No hay datos para generar el reporte';
            }
            const headers = Object.keys(data[0]);
            const csvRows = [];
            csvRows.push(headers.join(','));
            for (const row of data) {
                const values = headers.map(header => {
                    const value = row[header];
                    if (value === null || value === undefined || value === '')
                        return '';
                    const stringValue = String(value);
                    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                        return `"${stringValue.replace(/"/g, '""')}"`;
                    }
                    return stringValue;
                });
                csvRows.push(values.join(','));
            }
            const csvContent = csvRows.join('\n');
            console.log('✅ CSV generado exitosamente');
            return csvContent;
        }
        catch (error) {
            console.error('❌ [generateReportCSV] Error:', error);
            throw new Error(`Error al generar reporte CSV: ${error.message}`);
        }
    }
    formatDateForCSV(dateValue) {
        if (!dateValue)
            return '';
        try {
            let date;
            if (typeof dateValue === 'string') {
                date = new Date(dateValue);
            }
            else if (dateValue instanceof Date) {
                date = dateValue;
            }
            else {
                return String(dateValue);
            }
            if (isNaN(date.getTime())) {
                return String(dateValue);
            }
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
        catch (error) {
            console.warn('⚠️ Error formateando fecha para CSV:', dateValue, error);
            return String(dateValue);
        }
    }
};
exports.TrazabilidadService = TrazabilidadService;
exports.TrazabilidadService = TrazabilidadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Trazabilidad_entity_1.Trazabilidad)),
    __param(1, (0, typeorm_1.InjectRepository)(Ejecutiva_entity_1.Ejecutiva)),
    __param(2, (0, typeorm_1.InjectRepository)(EmpresaProveedora_entity_1.EmpresaProveedora)),
    __param(3, (0, typeorm_1.InjectRepository)(ClienteFinal_entity_1.ClienteFinal)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TrazabilidadService);
//# sourceMappingURL=trazabilidad.service.js.map