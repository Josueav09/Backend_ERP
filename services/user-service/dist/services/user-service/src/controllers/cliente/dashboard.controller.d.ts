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
        id_trazabilidad: number;
        tipo_actividad: string;
        descripcion: string;
        fecha_actividad: Date;
        resultado_contacto: string;
        notas: string;
        informacion_importante: string;
        resultados_reunion: string;
        ejecutiva_nombre: string;
        nombre_empresa: string;
        cliente_nombre: string;
        contacto_nombre: string;
    }[]>;
    getEjecutivaInfo(clienteUsuarioId: string): Promise<{
        ejecutiva_nombre: string;
        ejecutiva_email: string;
        telefono: string;
        linkedin: any;
        estadisticas?: undefined;
    } | {
        ejecutiva_nombre: string;
        ejecutiva_email: string;
        telefono: string;
        linkedin: string;
        estadisticas: {
            clientes_activos: number;
            tasa_conversion: string;
            ventas_ganadas: number;
            tiempo_respuesta: string;
        };
    }>;
    getClientesRecientes(clienteUsuarioId: string): Promise<{
        id_cliente_final: number;
        razon_social: string;
        ruc: string;
        correo: string;
        telefono: string;
        pais: string;
        rubro: string;
        estado: string;
        fecha_creacion: Date;
        ejecutiva_nombre: string;
        actividades_completadas: number;
        actividades_en_proceso: number;
        total_actividades: number;
    }[]>;
    getActividades(clienteUsuarioId: string, req: any): Promise<{
        id_trazabilidad: number;
        tipo_actividad: string;
        descripcion: string;
        fecha_actividad: Date;
        resultado_contacto: string;
        notas: string;
        informacion_importante: string;
        resultados_reunion: string;
        ejecutiva_nombre: string;
        nombre_empresa: string;
        cliente_nombre: string;
        contacto_nombre: string;
    }[]>;
    private getEmpresaId;
    getEjecutivasByEmpresa(empresaId: string, req: any): Promise<any[]>;
    getEquipoStats(empresaId: string, req: any): Promise<any>;
    getEjecutivaEmbudo(ejecutivaId: string, empresaId: string, req: any): Promise<any[]>;
    getEjecutivaEstadisticas(ejecutivaId: string, empresaId: string, req: any): Promise<any>;
    getEmpresaEjecutivaClientes(ejecutivaId: string, empresaId: string, req: any): Promise<any[]>;
}
