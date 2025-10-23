import { JefeService } from '../../services/jefe/jefe.service';
export declare class JefeController {
    private readonly jefeService;
    constructor(jefeService: JefeService);
    getPerfil(req: any): Promise<{
        id_jefe: number;
        dni: string;
        nombre_completo: string;
        email: string;
        telefono: string;
        linkedin: string;
        rol: string;
        fecha_creacion: Date;
        fecha_actualizacion: Date;
    }>;
    updatePerfil(req: any, body: any): Promise<import("shared/entities/Jefe.entity").Jefe>;
    updatePassword(req: any, body: any): Promise<{
        message: string;
    }>;
    getStats(req: any): Promise<{
        totalEmpresas: any;
        totalEjecutivas: any;
        totalClientes: any;
        clientesEsteMes: any;
        revenueTotal: number;
        pipelineOportunidades: any;
        dashboardEjecutivas: any;
        topEjecutivas: any;
        topEmpresas: any;
        topClientes: any;
        kpis: {
            tasaConversion: string;
            clientesNuevosMes: any;
            actividadesMes: any;
        };
        pipeline: any;
    } | {
        totalEmpresas: number;
        totalEjecutivas: number;
        totalClientes: number;
        clientesEsteMes: number;
        revenueTotal: number;
        pipelineOportunidades: number;
        dashboardEjecutivas: any[];
        kpis: {
            tasaConversion: string;
            clientesNuevosMes: number;
            actividadesMes: number;
        };
        pipeline: any[];
    }>;
    getClientes(req: any): Promise<{
        id_cliente_final: any;
        ruc: any;
        razon_social: any;
        pagina_web: any;
        correo: any;
        telefono: any;
        pais: any;
        departamento: any;
        provincia: any;
        direccion: any;
        linkedin: any;
        grupo_economico: any;
        rubro: any;
        sub_rubro: any;
        tamanio_empresa: any;
        facturacion_anual: number;
        cantidad_empleados: any;
        logo: any;
        id_ejecutiva: any;
        ejecutiva_nombre: any;
        id_empresa_prov: any;
        empresa_nombre: any;
        fecha_creacion: any;
        fecha_actualizacion: any;
        total_actividades: number;
        estado: any;
    }[]>;
    getClienteById(id: string): Promise<import("shared/entities/ClienteFinal.entity").ClienteFinal>;
    createCliente(body: any): Promise<import("shared/entities/ClienteFinal.entity").ClienteFinal>;
    updateCliente(id: string, body: any): Promise<import("shared/entities/ClienteFinal.entity").ClienteFinal>;
    deleteCliente(id: string): Promise<{
        message: string;
    }>;
}
