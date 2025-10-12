import { JefeService } from '../services/jefe.service';
export declare class JefeController {
    private readonly jefeService;
    constructor(jefeService: JefeService);
    getPerfil(): Promise<any>;
    updatePerfil(body: any): Promise<{
        message: string;
        usuario: any;
    }>;
    updatePassword(body: any): Promise<{
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
