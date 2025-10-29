import { Response } from 'express';
import { TrazabilidadService } from '../../services/jefe/trazabilidad.service';
export declare class TrazabilidadController {
    private readonly trazabilidadService;
    constructor(trazabilidadService: TrazabilidadService);
    getTrazabilidad(req: any, empresaId?: string, ejecutivaId?: string, clienteId?: string, fechaInicio?: string, fechaFin?: string, tipoContacto?: string, etapaOportunidad?: string, etapa?: string): Promise<import("shared/entities/Trazabilidad.entity").Trazabilidad[]>;
    getDashboardTrazabilidad(req: any): Promise<{
        etapa1_generacion: any;
        etapa2_embudo: any;
        kpis_semanales: any;
        dashboard_ejecutivas: any;
        estadisticas: {
            total_gestiones: number;
            revenue_total: number;
            gestiones_por_tipo: any[];
            oportunidades_por_etapa: any[];
            por_etapa: any;
        };
    }>;
    getEstadisticasPorEtapa(req: any, empresaId?: string, fechaInicio?: string, fechaFin?: string): Promise<any>;
    createTrazabilidad(req: any, body: any): Promise<import("shared/entities/Trazabilidad.entity").Trazabilidad>;
    updateTrazabilidad(req: any, id: string, body: any): Promise<import("shared/entities/Trazabilidad.entity").Trazabilidad>;
    getKPIs(req: any, ejecutivaId?: string, empresaId?: string, clienteId?: string, fechaDesde?: string, fechaHasta?: string): Promise<{
        totalOportunidades: number;
        enProceso: number;
        ventasGanadas: number;
        ventasPerdidas: number;
        montoTotal: number;
        tasaConversion: number;
    }>;
    getNuevosClientes(req: any, meses?: string, ejecutivaId?: string): Promise<{
        mes: string;
        contactos: number;
    }[]>;
    getContactosPorTipo(req: any, ejecutivaId?: string, fechaDesde?: string, fechaHasta?: string): Promise<{
        name: string;
        value: number;
        color: string;
    }[]>;
    getMontosPorEtapa(req: any, ejecutivaId?: string, fechaDesde?: string, fechaHasta?: string): Promise<{
        etapa: any;
        monto: number;
    }[]>;
    getTasaConversion(req: any, fechaDesde?: string, fechaHasta?: string): Promise<{
        id_ejecutiva: any;
        ejecutiva: any;
        ventas_ganadas: number;
        ventas_perdidas: number;
        total_oportunidades: number;
        monto_total_ganado: number;
        tasa: number;
    }[]>;
    getEtapa1(req: any, ejecutivaId?: string, empresaId?: string, clienteId?: string, resultadoContacto?: string, tipoContacto?: string, fechaDesde?: string, fechaHasta?: string, page?: string, limit?: string): Promise<{
        data: {
            id: number;
            clienteFinal: string;
            personaContacto: string;
            ejecutiva: string;
            tipoContacto: string;
            fechaContacto: string;
            resultadoContacto: string;
            pasaEmbudo: boolean;
            informacionImportante: string;
            fechaReunion: string;
            participantes: string;
            resultadosReunion: string;
            observaciones: string;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getEtapa2(req: any, ejecutivaId?: string, empresaId?: string, clienteId?: string, etapaOportunidad?: string, fechaDesde?: string, fechaHasta?: string, page?: string, limit?: string): Promise<{
        data: {
            id: number;
            nombreOportunidad: string;
            ejecutiva: string;
            clienteFinal: string;
            tipoOportunidad: string;
            etapaOportunidad: string;
            montoTotal: number;
            probabilidad_cierre: number;
            fechaCierreEsperado: string;
            productoOfrecido: string;
            observaciones: string;
            montoCierreFinal: number;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getFilterOptions(req: any): Promise<{
        ejecutivas: {
            id: number;
            nombre_completo: string;
        }[];
        empresas: {
            id: number;
            razon_social: string;
        }[];
        clientes: {
            id: number;
            razon_social: string;
        }[];
    }>;
    getNuevasReuniones(req: any, meses?: string, ejecutivaId?: string): Promise<{
        mes: string;
        reuniones: number;
    }[]>;
    getNuevasVentas(req: any, meses?: string, ejecutivaId?: string): Promise<{
        mes: string;
        ventas: number;
    }[]>;
    getEfectividadCanales(req: any, ejecutivaId?: string, fechaDesde?: string, fechaHasta?: string): Promise<{
        canal: string;
        total_contactos: number;
        positivos: number;
        negativos: number;
        pendientes: number;
        neutros: number;
        efectividad: number;
    }[]>;
    getResumenSemanal(req: any): Promise<{
        id_ejecutiva: any;
        ejecutiva: any;
        total_actividades: number;
        reuniones_agendadas: number;
        ventas_ganadas: number;
        monto_total: number;
    }[]>;
    getEmbudoVentas(req: any, ejecutivaId?: string, fechaDesde?: string, fechaHasta?: string): Promise<{
        etapa: string;
        cantidad: number;
        monto_total: number;
        tasa_conversion: number;
        perdida: number;
    }[]>;
    getRankingEjecutivas(req: any, fechaDesde?: string, fechaHasta?: string): Promise<{
        id_ejecutiva: any;
        ejecutiva: any;
        ventas_ganadas: number;
        monto_total: number;
        clientes_potenciales: number;
        efectividad: number;
    }[]>;
    generateReport(reportDto: {
        filters: any;
        reportType: 'etapa1' | 'etapa2';
        format?: 'csv';
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    private convertToCSV;
}
