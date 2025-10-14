export declare class EjecutivasService {
    getEjecutivas(): Promise<any[]>;
    getEjecutivaById(id: number): Promise<{
        ejecutiva: any;
        empresas: any[];
        clientes: any[];
    }>;
    createEjecutiva(data: any): Promise<any>;
    updateEjecutiva(id: number, data: any): Promise<any>;
    deleteEjecutiva(id: number): Promise<any>;
}
