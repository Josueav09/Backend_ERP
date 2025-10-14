import { EjecutivaTraceabilityService } from '../../services/ejecutiva/ejecutiva.service';
export declare class EjecutivaTraceabilityController {
    private readonly ejecutivaTraceabilityService;
    constructor(ejecutivaTraceabilityService: EjecutivaTraceabilityService);
    getTrazabilidad(ejecutivaId: string): Promise<any[]>;
    createTrazabilidad(body: any): Promise<any>;
}
