import { EjecutivaTraceabilityService } from '../../services/ejecutiva/ejecutiva.service';
export declare class EjecutivaTraceabilityController {
    private readonly ejecutivaTraceabilityService;
    constructor(ejecutivaTraceabilityService: EjecutivaTraceabilityService);
    getTrazabilidad(ejecutivaId: string): Promise<{
        id_trazabilidad: number;
        fecha_contacto: Date;
        tipo_contacto: string;
        resultado_contacto: string;
        empresa_proveedora: string;
        cliente_final: string;
        persona_contacto: string;
        reunion_agendada: boolean;
        fecha_reunion: Date;
        pasa_embudo_ventas: boolean;
        nombre_oportunidad: string;
        etapa_oportunidad: string;
        monto_total_sin_imp: number;
        probabilidad_cierre: number;
        observaciones: string;
        informacion_importante: string;
    }[]>;
    createTrazabilidad(body: any): Promise<{
        id: number;
        fecha_contacto: Date;
        tipo_contacto: string;
        resultado: string;
        cliente: string;
        persona_contacto: string;
        oportunidad: string;
        etapa: string;
        success: boolean;
    }>;
    getPipeline(ejecutivaId: string): Promise<{
        id: number;
        nombre_oportunidad: string;
        cliente: string;
        persona_contacto: string;
        etapa: string;
        monto: number;
        probabilidad: number;
        fecha_cierre_esperado: Date;
        producto_ofrecido: string;
        fecha_inicio_etapa: Date;
    }[]>;
    getActividadesRecientes(ejecutivaId: string, limit?: string): Promise<{
        id: number;
        fecha: Date;
        tipo_contacto: string;
        resultado: string;
        cliente: string;
        persona_contacto: {
            id: number;
            nombre_completo: string;
            email: string;
            telefono: string;
        };
        oportunidad: string;
        etapa: string;
        observaciones: string;
    }[]>;
    updateEtapaOportunidad(body: {
        trazabilidadId: string;
        nuevaEtapa: string;
        ejecutivaId: string;
    }): Promise<{
        success: boolean;
        message: string;
        nueva_etapa: string;
    }>;
    getStats(ejecutivaId: string): Promise<{
        totalContactos: number;
        oportunidadesGeneradas: number;
        ventasGanadas: number;
        tasaConversion: number;
        montoTotal: number;
        enProceso: number;
    }>;
}
