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
        ejecutiva_registro: import("shared/entities/Ejecutiva.entity").Ejecutiva;
        fecha_creacion: Date;
        fecha_actualizacion: Date;
        ejecutivas: import("shared/entities/Ejecutiva.entity").Ejecutiva[];
        trazabilidades: import("shared/entities/Trazabilidad.entity").Trazabilidad[];
        clientes_finales: import("shared/entities/ClienteFinal.entity").ClienteFinal[];
    }[]>;
    createEmpresa(body: any): Promise<import("shared/entities/EmpresaProveedora.entity").EmpresaProveedora>;
    updateEmpresaEstado(id: string, body: any): Promise<{
        empresa: import("shared/entities/EmpresaProveedora.entity").EmpresaProveedora;
        message: string;
    }>;
    updateEmpresa(id: string, data: any): Promise<import("shared/entities/EmpresaProveedora.entity").EmpresaProveedora>;
    getEmpresaEjecutivas(id: string): Promise<{
        ejecutivas: {
            total_clientes: number;
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
        }[];
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
        ejecutiva_registro: import("shared/entities/Ejecutiva.entity").Ejecutiva;
        fecha_creacion: Date;
        fecha_actualizacion: Date;
        trazabilidades: import("shared/entities/Trazabilidad.entity").Trazabilidad[];
        clientes_finales: import("shared/entities/ClienteFinal.entity").ClienteFinal[];
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
}
