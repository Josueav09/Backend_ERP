import { Repository } from 'typeorm';
import { EmpresaProveedora } from '../../../../../shared/entities/EmpresaProveedora.entity';
import { Ejecutiva } from '../../../../../shared/entities/Ejecutiva.entity';
import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
import { Trazabilidad } from '../../../../../shared/entities/Trazabilidad.entity';
export declare class EmpresaDashboardService {
    private empresaRepository;
    private ejecutivaRepository;
    private clienteRepository;
    private trazabilidadRepository;
    constructor(empresaRepository: Repository<EmpresaProveedora>, ejecutivaRepository: Repository<Ejecutiva>, clienteRepository: Repository<ClienteFinal>, trazabilidadRepository: Repository<Trazabilidad>);
    getStats(empresaId: number): Promise<{
        cliente: {
            nombre_cliente: string;
            nombre_empresa: string;
            ejecutiva_nombre: string;
            ejecutiva_email: string;
        };
        totalActividades: number;
        completadas: number;
        enProceso: number;
        rendimiento: number;
        totalClientes: number;
        totalEjecutivas: number;
        actividadesEsteMes: number;
        clientesEsteMes: number;
        revenueTotal: number;
        pipelineOportunidades: number;
        tasaConversion: string;
        ventasGanadas: number;
    }>;
    getTrazabilidad(empresaId: number): Promise<{
        id_trazabilidad: any;
        tipo_actividad: any;
        descripcion: any;
        fecha_actividad: any;
        resultado_contacto: string;
        notas: any;
        informacion_importante: any;
        resultados_reunion: any;
        ejecutiva_nombre: any;
        nombre_empresa: any;
        cliente_nombre: any;
        contacto_nombre: any;
    }[]>;
    getEjecutivaInfo(empresaId: number): Promise<{
        ejecutiva_nombre: string;
        ejecutiva_email: string;
        telefono: string;
        linkedin?: undefined;
    } | {
        ejecutiva_nombre: string;
        ejecutiva_email: string;
        telefono: string;
        linkedin: string;
    }>;
    private getTotalClientes;
    private getTotalEjecutivas;
    private getTotalActividades;
    private getActividadesEsteMes;
    private getClientesEsteMes;
    private getRevenueTotal;
    private getPipelineOportunidades;
    private getVentasGanadas;
    private mapEstadoTrazabilidad;
    private getEmptyStats;
}
