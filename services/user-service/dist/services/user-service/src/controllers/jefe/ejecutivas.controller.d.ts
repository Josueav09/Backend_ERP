import { EjecutivasService } from '../../services/jefe/ejecutivas.service';
export declare class EjecutivasController {
    private readonly ejecutivasService;
    constructor(ejecutivasService: EjecutivasService);
    getEjecutivas(): Promise<{
        total_clientes: number;
        total_actividades: number;
        empresa_asignada: string;
        id_ejecutiva: number;
        dni: string;
        nombre_completo: string;
        correo: string;
        contraseña: string;
        telefono: string;
        linkedin: string;
        estado_ejecutiva: string;
        jefe: import("shared/entities/Jefe.entity").Jefe;
        empresa_proveedora: import("shared/entities/EmpresaProveedora.entity").EmpresaProveedora;
        clientes_finales: import("shared/entities/ClienteFinal.entity").ClienteFinal[];
        trazabilidades: import("shared/entities/Trazabilidad.entity").Trazabilidad[];
        fecha_creacion: Date;
        fecha_actualizacion: Date;
    }[]>;
    getEjecutiva(id: string): Promise<{
        ejecutiva: import("shared/entities/Ejecutiva.entity").Ejecutiva;
        estadisticas: {
            total_clientes: number;
            total_actividades: number;
            actividades_recientes: import("shared/entities/Trazabilidad.entity").Trazabilidad[];
        };
    }>;
    createEjecutiva(body: any): Promise<import("shared/entities/Ejecutiva.entity").Ejecutiva>;
    updateEjecutiva(id: string, body: any): Promise<import("shared/entities/Ejecutiva.entity").Ejecutiva>;
    deleteEjecutiva(id: string): Promise<{
        message: string;
    }>;
}
