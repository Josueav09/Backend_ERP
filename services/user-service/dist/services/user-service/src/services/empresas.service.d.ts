export declare class EmpresasService {
    getEmpresas(): Promise<any[]>;
    createEmpresa(data: any): Promise<any>;
    updateEmpresaEstado(empresaId: number, activo: boolean): Promise<{
        empresa: any;
        clientesActualizados: number;
        message: string;
    }>;
    getEmpresaEjecutivas(empresaId: number): Promise<any>;
    addEjecutivaToEmpresa(empresaId: number, ejecutivaId: number): Promise<any>;
    removeEjecutivaFromEmpresa(empresaId: number, ejecutivaId: number): Promise<{
        message: string;
    }>;
}
