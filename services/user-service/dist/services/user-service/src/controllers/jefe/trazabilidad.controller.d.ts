import { TrazabilidadService } from '../../services/jefe/trazabilidad.service';
export declare class TrazabilidadController {
    private readonly trazabilidadService;
    constructor(trazabilidadService: TrazabilidadService);
    getKPIs(ejecutivaId?: string, empresaId?: string, clienteId?: string, fechaDesde?: string, fechaHasta?: string): Promise<{
        totalOportunidades: number;
        enProceso: number;
        ventasGanadas: number;
        ventasPerdidas: number;
        montoTotal: number;
        tasaConversion: number;
    }>;
    getEtapa1(ejecutivaId?: string, empresaId?: string, clienteId?: string, resultadoContacto?: string, tipoContacto?: string, fechaDesde?: string, fechaHasta?: string, page?: string, limit?: string): Promise<{
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
    getEtapa2(ejecutivaId?: string, empresaId?: string, clienteId?: string, etapaOportunidad?: string, fechaDesde?: string, fechaHasta?: string, page?: string, limit?: string): Promise<{
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
    getNuevosClientes(meses?: string, ejecutivaId?: string): Promise<{
        mes: string;
        contactos: number;
    }[]>;
    getContactosPorTipo(ejecutivaId?: string, fechaDesde?: string, fechaHasta?: string): Promise<{
        name: string;
        value: number;
        color: string;
    }[]>;
    getMontosPorEtapa(ejecutivaId?: string, fechaDesde?: string, fechaHasta?: string): Promise<{
        etapa: any;
        monto: number;
    }[]>;
    getTasaConversion(fechaDesde?: string, fechaHasta?: string): Promise<{
        id_ejecutiva: any;
        ejecutiva: any;
        ventas_ganadas: number;
        ventas_perdidas: number;
        total_oportunidades: number;
        monto_total_ganado: number;
        tasa: number;
    }[]>;
    getTrazabilidadDetail(id: number): Promise<import("shared/entities/Trazabilidad.entity").Trazabilidad>;
    testEndpoint(): Promise<{
        message: string;
        timestamp: string;
        endpoints: string[];
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
}
