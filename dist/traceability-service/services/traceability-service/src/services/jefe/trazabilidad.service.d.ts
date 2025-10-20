import { Repository } from 'typeorm';
import { Trazabilidad } from '../../../../../shared/entities/Trazabilidad.entity';
export declare class TrazabilidadService {
    private trazabilidadRepository;
    constructor(trazabilidadRepository: Repository<Trazabilidad>);
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
}
