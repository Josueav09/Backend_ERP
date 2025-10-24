import { EjecutivasService } from '../../services/jefe/ejecutivas.service';
export declare class EjecutivasController {
    private readonly ejecutivasService;
    ejecutivaRepository: any;
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
        id_empresa_prov: number;
        empresa_proveedora: import("shared/entities/EmpresaProveedora.entity").EmpresaProveedora;
        clientes_finales: import("shared/entities/ClienteFinal.entity").ClienteFinal[];
        trazabilidades: import("shared/entities/Trazabilidad.entity").Trazabilidad[];
        empresas_registradas: import("shared/entities/EmpresaProveedora.entity").EmpresaProveedora[];
        fecha_creacion: Date;
        fecha_actualizacion: Date;
    }[]>;
    getEjecutiva(id: string): Promise<{
        ejecutiva: {
            empresa_asignada: string;
            empresa_nombre: string;
            id_ejecutiva: number;
            dni: string;
            nombre_completo: string;
            correo: string;
            contraseña: string;
            telefono: string;
            linkedin: string;
            estado_ejecutiva: string;
            jefe: import("shared/entities/Jefe.entity").Jefe;
            id_empresa_prov: number;
            empresa_proveedora: import("shared/entities/EmpresaProveedora.entity").EmpresaProveedora;
            clientes_finales: import("shared/entities/ClienteFinal.entity").ClienteFinal[];
            trazabilidades: import("shared/entities/Trazabilidad.entity").Trazabilidad[];
            empresas_registradas: import("shared/entities/EmpresaProveedora.entity").EmpresaProveedora[];
            fecha_creacion: Date;
            fecha_actualizacion: Date;
        };
        estadisticas: {
            total_clientes: number;
            total_actividades: number;
            actividades_recientes: import("shared/entities/Trazabilidad.entity").Trazabilidad[];
        };
        empresas: {
            id_empresa: number;
            nombre_empresa: string;
            rut: string;
            fecha_asignacion: Date;
            asignacion_activa: boolean;
        }[];
        clientes: {
            id_cliente: number;
            nombre_cliente: string;
            rut_cliente: string;
            email: string;
            telefono: string;
            estado: string;
            nombre_empresa: string;
            fecha_registro: Date;
        }[];
    }>;
    createEjecutiva(body: any): Promise<import("shared/entities/Ejecutiva.entity").Ejecutiva>;
    updateEjecutiva(id: string, body: any): Promise<import("shared/entities/Ejecutiva.entity").Ejecutiva>;
    deleteEjecutiva(id: string): Promise<{
        message: string;
    }>;
    getEjecutivasDisponiblesSimple(): Promise<any>;
}
