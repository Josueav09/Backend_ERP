export declare class ClientesService {
    getClientes(): Promise<any[]>;
    getClienteById(id: number): Promise<any>;
    createCliente(data: any): Promise<any>;
    updateCliente(id: number, data: any): Promise<any>;
    deleteCliente(id: number): Promise<any>;
}
