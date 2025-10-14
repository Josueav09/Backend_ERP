export declare class ClienteDashboardService {
    getStats(clienteUsuarioId: string): Promise<{
        cliente: any;
        totalActividades: number;
        completadas: number;
        enProceso: number;
        rendimiento: number;
    }>;
}
