import { ClientesService } from '../../services/jefe/clientes.service';
export declare class ClientesController {
    private readonly clientesService;
    constructor(clientesService: ClientesService);
    getClientes(): Promise<any[]>;
    getCliente(id: string): Promise<any>;
    createCliente(body: any): Promise<any>;
    updateCliente(id: string, body: any): Promise<any>;
    deleteCliente(id: string): Promise<{
        message: string;
    }>;
}
