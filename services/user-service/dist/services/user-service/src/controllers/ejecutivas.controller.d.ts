import { EjecutivasService } from '../services/ejecutivas.service';
export declare class EjecutivasController {
    private readonly ejecutivasService;
    constructor(ejecutivasService: EjecutivasService);
    getEjecutivas(): Promise<any[]>;
    getEjecutiva(id: string): Promise<{
        ejecutiva: any;
        empresas: any[];
        clientes: any[];
    }>;
    createEjecutiva(body: any): Promise<any>;
    updateEjecutiva(id: string, body: any): Promise<any>;
    deleteEjecutiva(id: string): Promise<{
        message: string;
    }>;
}
