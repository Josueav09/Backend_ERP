import { Repository } from 'typeorm';
import { Trazabilidad } from '../../../../../shared/entities/Trazabilidad.entity';
export declare class TrazabilidadService {
    private trazabilidadRepository;
    constructor(trazabilidadRepository: Repository<Trazabilidad>);
    getTrazabilidad(filters?: any): Promise<Trazabilidad[]>;
    getDashboardTrazabilidad(): Promise<{
        pipeline_ventas: any;
        dashboard_ejecutivas: any;
        estadisticas: {
            total_gestiones: number;
            revenue_total: any;
            gestiones_por_tipo: any[];
            oportunidades_por_etapa: any[];
        };
    }>;
    createTrazabilidad(data: any): Promise<Trazabilidad>;
}
