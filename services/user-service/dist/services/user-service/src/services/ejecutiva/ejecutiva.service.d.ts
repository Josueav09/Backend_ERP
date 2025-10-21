import { Repository } from 'typeorm';
import { Ejecutiva } from '../../../../../shared/entities/Ejecutiva.entity';
import { EmpresaProveedora } from '../../../../../shared/entities/EmpresaProveedora.entity';
import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
import { Trazabilidad } from '../../../../../shared/entities/Trazabilidad.entity';
import { PersonaContacto } from '../../../../../shared/entities/PersonaContacto.entity';
export declare class EjecutivaService {
    private ejecutivaRepository;
    private empresaRepository;
    private clienteRepository;
    private trazabilidadRepository;
    private contactoRepository;
    constructor(ejecutivaRepository: Repository<Ejecutiva>, empresaRepository: Repository<EmpresaProveedora>, clienteRepository: Repository<ClienteFinal>, trazabilidadRepository: Repository<Trazabilidad>, contactoRepository: Repository<PersonaContacto>);
    getStats(ejecutivaId: string): Promise<{
        totalEmpresas: number;
        totalClientes: number;
        actividadesMes: number;
        pipelineCount: number;
        revenueGenerado: number;
        empresaAsignada: boolean;
    }>;
    getEmpresas(ejecutivaId: string): Promise<{
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
        ejecutiva_registro: Ejecutiva;
        fecha_creacion: Date;
        fecha_actualizacion: Date;
        ejecutivas: Ejecutiva[];
        trazabilidades: Trazabilidad[];
        clientes_finales: ClienteFinal[];
    }[]>;
    createEmpresa(data: {
        razon_social: string;
        ruc: string;
        direccion: string;
        telefono: string;
        correo: string;
        ejecutivaId: string;
    }): Promise<EmpresaProveedora>;
    getClientes(ejecutivaId: string): Promise<{
        total_actividades: number;
        contacto_principal: PersonaContacto;
        ultima_actividad: {
            fecha: Date;
            tipo: string;
            resultado: string;
            persona_contacto: {
                id: number;
                nombre_completo: string;
                email: string;
                telefono: string;
            };
        };
        id_cliente_final: number;
        ruc: string;
        razon_social: string;
        pagina_web: string;
        correo: string;
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
        id_empresa_prov: number;
        empresa_proveedora: EmpresaProveedora;
        id_ejecutiva: number;
        ejecutiva: Ejecutiva;
        personas_contacto: PersonaContacto[];
        trazabilidades: Trazabilidad[];
        fecha_creacion: Date;
        fecha_actualizacion: Date;
    }[]>;
    createCliente(data: {
        id_empresa: string;
        id_ejecutiva: string;
        razon_social: string;
        ruc: string;
        direccion: string;
        telefono: string;
        correo: string;
    }): Promise<ClienteFinal>;
    getPipeline(ejecutivaId: string): Promise<{
        oportunidades: Trazabilidad[];
        agrupado_por_etapa: {};
        metricas: {
            total_oportunidades: number;
            total_monto_pipeline: number;
            promedio_probabilidad: number;
        };
    }>;
    getActividadesRecientes(ejecutivaId: string, limit?: number): Promise<{
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
    getKPIsSemanales(ejecutivaId: string): Promise<{
        actividades_semana: number;
        nuevas_oportunidades: number;
        reuniones_agendadas: number;
        inicio_semana: Date;
    }>;
}
