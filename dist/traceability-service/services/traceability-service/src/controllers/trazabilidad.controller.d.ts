import { TrazabilidadService } from '../services/trazabilidad.service';
export declare class TrazabilidadController {
    private readonly trazabilidadService;
    constructor(trazabilidadService: TrazabilidadService);
    getTrazabilidad(empresaId?: string, ejecutivaId?: string, clienteId?: string): Promise<any[]>;
}
