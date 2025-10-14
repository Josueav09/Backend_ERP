import { ClienteTrazabilidadService } from '../../services/cliente/traceability.service';
export declare class ClienteTrazabilidadController {
    private readonly trazabilidadService;
    constructor(trazabilidadService: ClienteTrazabilidadService);
    getTrazabilidad(clienteUsuarioId: string): Promise<any[]>;
}
