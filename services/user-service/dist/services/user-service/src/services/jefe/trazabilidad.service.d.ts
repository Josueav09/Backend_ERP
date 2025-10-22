import { Repository } from 'typeorm';
import { Trazabilidad } from '../../../../../shared/entities/trazabilidad.entity';
import { Ejecutiva } from '../../../../../shared/entities/ejecutiva.entity';
import { EmpresaProveedora } from '../../../../../shared/entities/EmpresaProveedora.entity';
import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
export declare class TrazabilidadService {
    private readonly trazabilidadRepo;
    private readonly ejecutivaRepo;
    private readonly empresaRepo;
    private readonly clienteRepo;
    constructor(trazabilidadRepo: Repository<Trazabilidad>, ejecutivaRepo: Repository<Ejecutiva>, empresaRepo: Repository<EmpresaProveedora>, clienteRepo: Repository<ClienteFinal>);
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
    private formatDate;
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
    getTrazabilidadDetail(id: number): Promise<Trazabilidad>;
    private mapTipoContacto;
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
