import { EjecutivaService } from '../../services/ejecutiva/ejecutiva.service';
export declare class EjecutivaController {
    private readonly ejecutivaService;
    constructor(ejecutivaService: EjecutivaService);
    getStats(ejecutivaId: string): Promise<{
        totalEmpresas: number;
        totalClientes: number;
        actividadesMes: number;
    }>;
    getEmpresas(ejecutivaId: string): Promise<any[]>;
    createEmpresa(body: any): Promise<any>;
    getClientes(ejecutivaId: string): Promise<any[]>;
    createCliente(body: any): Promise<any>;
}
