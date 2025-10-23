import { Repository } from 'typeorm';
import { Jefe } from '../../../../../shared/entities/Jefe.entity';
import { EmpresaProveedora } from '../../../../../shared/entities/EmpresaProveedora.entity';
import { Ejecutiva } from '../../../../../shared/entities/Ejecutiva.entity';
import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
import { Trazabilidad } from '../../../../../shared/entities/Trazabilidad.entity';
export declare class JefeService {
    private jefeRepository;
    private empresaRepository;
    private ejecutivaRepository;
    private clienteRepository;
    private trazabilidadRepository;
    constructor(jefeRepository: Repository<Jefe>, empresaRepository: Repository<EmpresaProveedora>, ejecutivaRepository: Repository<Ejecutiva>, clienteRepository: Repository<ClienteFinal>, trazabilidadRepository: Repository<Trazabilidad>);
    getPerfil(userId: number): Promise<{
        id_jefe: number;
        dni: string;
        nombre_completo: string;
        email: string;
        telefono: string;
        linkedin: string;
        rol: string;
        fecha_creacion: Date;
        fecha_actualizacion: Date;
    }>;
    updatePerfil(userId: number, data: any): Promise<Jefe>;
    updatePassword(userId: number, password_actual: string, password_nueva: string): Promise<{
        message: string;
    }>;
    getStats(): Promise<{
        totalEmpresas: any;
        totalEjecutivas: any;
        totalClientes: any;
        clientesEsteMes: any;
        revenueTotal: number;
        pipelineOportunidades: any;
        dashboardEjecutivas: any;
        topEjecutivas: any;
        topEmpresas: any;
        topClientes: any;
        kpis: {
            tasaConversion: string;
            clientesNuevosMes: any;
            actividadesMes: any;
        };
        pipeline: any;
    } | {
        totalEmpresas: number;
        totalEjecutivas: number;
        totalClientes: number;
        clientesEsteMes: number;
        revenueTotal: number;
        pipelineOportunidades: number;
        dashboardEjecutivas: any[];
        kpis: {
            tasaConversion: string;
            clientesNuevosMes: number;
            actividadesMes: number;
        };
        pipeline: any[];
    }>;
    private getStatsFallback;
    private calcularTasaConversion;
    private getClientesNuevosMes;
    private getActividadesMes;
    getClientes(): Promise<{
        id_cliente_final: any;
        ruc: any;
        razon_social: any;
        pagina_web: any;
        correo: any;
        telefono: any;
        pais: any;
        departamento: any;
        provincia: any;
        direccion: any;
        linkedin: any;
        grupo_economico: any;
        rubro: any;
        sub_rubro: any;
        tamanio_empresa: any;
        facturacion_anual: number;
        cantidad_empleados: any;
        logo: any;
        id_ejecutiva: any;
        ejecutiva_nombre: any;
        id_empresa_prov: any;
        empresa_nombre: any;
        fecha_creacion: any;
        fecha_actualizacion: any;
        total_actividades: number;
        estado: any;
    }[]>;
    getClienteById(id: number): Promise<ClienteFinal>;
    createCliente(data: any): Promise<ClienteFinal>;
    updateCliente(id: number, data: any): Promise<ClienteFinal>;
    deleteCliente(id: number): Promise<{
        message: string;
    }>;
}
