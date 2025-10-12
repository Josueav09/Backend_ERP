import { EmpresasService } from '../services/empresas.service';
export declare class EmpresasController {
    private readonly empresasService;
    constructor(empresasService: EmpresasService);
    getEmpresas(): Promise<any[]>;
    createEmpresa(body: any): Promise<any>;
    updateEmpresaEstado(id: string, body: any): Promise<{
        empresa: any;
        clientesActualizados: number;
        message: string;
    }>;
    getEmpresaEjecutivas(id: string): Promise<any>;
    addEjecutivaToEmpresa(id: string, body: any): Promise<any>;
    removeEjecutivaFromEmpresa(id: string, ejecutivaId: string): Promise<{
        message: string;
    }>;
}
