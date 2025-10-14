import { ClienteDashboardService } from '../../services/cliente/dashboard.service';
export declare class ClienteDashboardController {
    private readonly dashboardService;
    constructor(dashboardService: ClienteDashboardService);
    getStats(clienteUsuarioId: string): Promise<{
        cliente: any;
        totalActividades: number;
        completadas: number;
        enProceso: number;
        rendimiento: number;
    }>;
}
