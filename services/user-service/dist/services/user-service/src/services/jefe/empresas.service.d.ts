import { Repository } from 'typeorm';
import { EmpresaProveedora } from '../../../../../shared/entities/EmpresaProveedora.entity';
import { Ejecutiva } from '../../../../../shared/entities/Ejecutiva.entity';
import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
export declare class EmpresasService {
    private empresaRepository;
    private ejecutivaRepository;
    private clienteRepository;
    constructor(empresaRepository: Repository<EmpresaProveedora>, ejecutivaRepository: Repository<Ejecutiva>, clienteRepository: Repository<ClienteFinal>);
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
        ejecutiva_registro: Ejecutiva;
        fecha_creacion: Date;
        fecha_actualizacion: Date;
        ejecutivas: Ejecutiva[];
        trazabilidades: import("shared/entities/Trazabilidad.entity").Trazabilidad[];
        clientes_finales: ClienteFinal[];
    }[]>;
    createEmpresa(data: any): Promise<EmpresaProveedora>;
    updateEmpresaEstado(empresaId: number, activo: boolean): Promise<{
        empresa: EmpresaProveedora;
        message: string;
    }>;
    updateEmpresa(empresaId: number, data: any): Promise<EmpresaProveedora>;
    getEmpresaEjecutivas(empresaId: number): Promise<{
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
    asignarEjecutivaAEmpresa(idEmpresa: number, idEjecutiva: number): Promise<{
        success: boolean;
        message: string;
        empresa: string;
        ejecutiva: string;
    }>;
    addEjecutivaToEmpresa(empresaId: number, ejecutivaId: number): Promise<{
        message: string;
        ejecutiva: {
            id_ejecutiva: number;
            nombre_completo: string;
            correo: string;
        };
    }>;
    removeEjecutivaFromEmpresa(empresaId: number, ejecutivaId: number): Promise<{
        message: string;
    }>;
}
