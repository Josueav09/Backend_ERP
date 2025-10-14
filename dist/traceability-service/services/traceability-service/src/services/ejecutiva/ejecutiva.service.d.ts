export declare class EjecutivaTraceabilityService {
    getTrazabilidad(ejecutivaId: string): Promise<any[]>;
    createTrazabilidad(data: {
        id_ejecutiva: string;
        id_empresa: string;
        id_cliente?: string;
        tipo_actividad: string;
        descripcion: string;
        estado: string;
        notas?: string;
    }): Promise<any>;
}
