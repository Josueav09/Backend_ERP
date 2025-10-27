import { EmpresaDashboardService } from '../../services/cliente/dashboard.service';
export declare class EmpresaDashboardController {
    private readonly dashboardService;
    constructor(dashboardService: EmpresaDashboardService);
    getStats(clienteUsuarioId: string, req: any): Promise<{
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
    getTrazabilidad(clienteUsuarioId: string, req: any): Promise<{
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
    getEjecutivaInfo(clienteUsuarioId: string, req: any): Promise<{
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
    getActividades(clienteUsuarioId: string, req: any): Promise<{
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
    private getEmpresaId;
}
