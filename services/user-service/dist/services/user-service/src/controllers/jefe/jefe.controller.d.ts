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
        totalEmpresas: number;
        totalEjecutivas: number;
        totalClientes: number;
        clientesEsteMes: number;
        revenueTotal: number;
        pipelineOportunidades: number;
        ventasGanadas: number;
        dashboardEjecutivas: any[];
        kpis: {
            tasaConversion: string;
            clientesNuevosMes: number;
            actividadesMes: number;
        };
    }>;
}
