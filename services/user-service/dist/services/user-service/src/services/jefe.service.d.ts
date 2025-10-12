export declare class JefeService {
    private readonly userId;
    getPerfil(): Promise<any>;
    updatePerfil(data: any): Promise<{
        message: string;
        usuario: any;
    }>;
    updatePassword(password_actual: string, password_nueva: string): Promise<{
        message: string;
    }>;
    getStats(): Promise<{
        totalEmpresas: number;
        totalEjecutivas: number;
        totalClientes: number;
        actividadesMes: number;
        trazabilidadPorEstado: any[];
        actividadesPorEjecutiva: any[];
        clientesPorEmpresa: any[];
    }>;
}
