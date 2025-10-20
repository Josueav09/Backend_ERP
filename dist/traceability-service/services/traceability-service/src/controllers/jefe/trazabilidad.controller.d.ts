import { TrazabilidadService } from '../../services/jefe/trazabilidad.service';
export declare class TrazabilidadController {
    private readonly trazabilidadService;
    constructor(trazabilidadService: TrazabilidadService);
    getTrazabilidad(req: any, empresaId?: string, ejecutivaId?: string, clienteId?: string, fechaInicio?: string, fechaFin?: string, tipoContacto?: string, etapaOportunidad?: string): Promise<import("shared/entities/Trazabilidad.entity").Trazabilidad[]>;
    getDashboardTrazabilidad(req: any): Promise<{
        pipeline_ventas: any;
        dashboard_ejecutivas: any;
        estadisticas: {
            total_gestiones: number;
            revenue_total: any;
            gestiones_por_tipo: any[];
            oportunidades_por_etapa: any[];
        };
    }>;
    createTrazabilidad(req: any, body: any): Promise<import("shared/entities/Trazabilidad.entity").Trazabilidad>;
}
