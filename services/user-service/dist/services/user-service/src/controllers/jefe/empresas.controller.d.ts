import { EmpresasService } from '../../services/jefe/empresas.service';
export declare class EmpresasController {
    private readonly empresasService;
    constructor(empresasService: EmpresasService);
    getEmpresas(): Promise<{
        total_ejecutivas: number;
        total_clientes: number;
        id_empresa_prov: number;
        ruc: string;
        razon_social: string;
        pagina_web: string;
        correo: string;
        contraseña: string;
        telefono: string;
        pais: string;
        departamento: string;
        provincia: string;
        direccion: string;
        linkedin: string;
        grupo_economico: string;
        rubro: string;
        sub_rubro: string;
        tamanio_empresa: string;
        facturacion_anual: number;
        cantidad_empleados: number;
        logo: string;
        estado: string;
        id_ejecutiva_registro: number;
        ejecutiva_registro: import("shared/entities/Ejecutiva.entity").Ejecutiva;
        fecha_creacion: Date;
        fecha_actualizacion: Date;
        ejecutivas: import("shared/entities/Ejecutiva.entity").Ejecutiva[];
        trazabilidades: import("shared/entities/Trazabilidad.entity").Trazabilidad[];
        clientes_finales: import("shared/entities/ClienteFinal.entity").ClienteFinal[];
    }[]>;
    getEmpresaEjecutivas(id: string): Promise<{
        id_empresa_prov: number;
        razon_social: string;
        ruc: string;
        ejecutivas: {
            id_usuario: number;
            nombre: string;
            apellido: string;
            email: string;
            fecha_asignacion: Date;
            activo: boolean;
            total_clientes: number;
        }[];
    }>;
    createEmpresa(body: any): Promise<import("shared/entities/EmpresaProveedora.entity").EmpresaProveedora>;
    updateEmpresa(id: string, data: any): Promise<import("shared/entities/EmpresaProveedora.entity").EmpresaProveedora>;
    updateEmpresaEstado(id: string, body: any): Promise<{
        empresa: import("shared/entities/EmpresaProveedora.entity").EmpresaProveedora;
        message: string;
    }>;
    addEjecutivaToEmpresa(id: string, body: any): Promise<{
        message: string;
        ejecutiva: {
            id_ejecutiva: number;
            nombre_completo: string;
            correo: string;
        };
    }>;
    removeEjecutivaFromEmpresa(id: string, ejecutivaId: string): Promise<{
        message: string;
    }>;
    asignarEjecutivaAEmpresa(id: string, body: {
        id_ejecutiva: number;
    }): Promise<{
        success: boolean;
        message: string;
        empresa: string;
        ejecutiva: string;
    }>;
}
