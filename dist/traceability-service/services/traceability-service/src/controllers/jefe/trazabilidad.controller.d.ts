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
}
