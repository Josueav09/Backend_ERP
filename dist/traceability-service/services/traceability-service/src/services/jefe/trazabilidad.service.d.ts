import { Repository } from 'typeorm';
import { Trazabilidad } from '../../../../../shared/entities/Trazabilidad.entity';
import { Ejecutiva } from '../../../../../shared/entities/Ejecutiva.entity';
import { EmpresaProveedora } from '../../../../../shared/entities/EmpresaProveedora.entity';
import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
export declare class TrazabilidadService {
    private trazabilidadRepository;
    private ejecutivaRepository;
    private empresaRepository;
    private clienteRepository;
    constructor(trazabilidadRepository: Repository<Trazabilidad>, ejecutivaRepository: Repository<Ejecutiva>, empresaRepository: Repository<EmpresaProveedora>, clienteRepository: Repository<ClienteFinal>);
    getTrazabilidad(filters?: any): Promise<Trazabilidad[]>;
    getDashboardTrazabilidad(): Promise<{
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
    createTrazabilidad(data: any): Promise<Trazabilidad>;
    updateTrazabilidad(id: number, data: any): Promise<Trazabilidad>;
    getEstadisticasPorEtapa(filters?: any): Promise<any>;
    getKPIs(filters: {
        ejecutivaId?: number;
        empresaId?: number;
        clienteId?: number;
        fechaDesde?: string;
        fechaHasta?: string;
    }): Promise<{
        totalOportunidades: number;
        enProceso: number;
        ventasGanadas: number;
        ventasPerdidas: number;
        montoTotal: number;
        tasaConversion: number;
    }>;
    getNuevosClientes(meses?: number, ejecutivaId?: number): Promise<{
        mes: string;
        contactos: number;
    }[]>;
    getContactosPorTipo(filters: {
        ejecutivaId?: number;
        fechaDesde?: string;
        fechaHasta?: string;
    }): Promise<{
        name: string;
        value: number;
        color: string;
    }[]>;
    getMontosPorEtapa(filters: {
        ejecutivaId?: number;
        fechaDesde?: string;
        fechaHasta?: string;
    }): Promise<{
        etapa: any;
        monto: number;
    }[]>;
    getTasaConversion(filters: {
        fechaDesde?: string;
        fechaHasta?: string;
    }): Promise<{
        id_ejecutiva: any;
        ejecutiva: any;
        ventas_ganadas: number;
        ventas_perdidas: number;
        total_oportunidades: number;
        monto_total_ganado: number;
        tasa: number;
    }[]>;
    getEtapa1(filters: {
        ejecutivaId?: number;
        empresaId?: number;
        clienteId?: number;
        resultadoContacto?: string;
        tipoContacto?: string;
        fechaDesde?: string;
        fechaHasta?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: {
            id: number;
            clienteFinal: string;
            ejecutiva: string;
            personaContacto: string;
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
    getEtapa2(filters: {
        ejecutivaId?: number;
        empresaId?: number;
        clienteId?: number;
        etapaOportunidad?: string;
        fechaDesde?: string;
        fechaHasta?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: {
            id: number;
            nombreOportunidad: string;
            ejecutiva: string;
            clienteFinal: string;
            tipoOportunidad: string;
            etapaOportunidad: string;
            montoTotal: number;
            probabilidadCierre: number;
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
    getFilterOptions(): Promise<{
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
    private mapTipoContacto;
    private formatDate;
}
