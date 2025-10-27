import { EjecutivaService } from '../../services/ejecutiva/ejecutiva.service';
import { Response } from 'express';
export declare class EjecutivaController {
    private readonly ejecutivaService;
    constructor(ejecutivaService: EjecutivaService);
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
        id_ejecutiva_registro: number;
        ejecutiva_registro: import("shared/entities/Ejecutiva.entity").Ejecutiva;
        fecha_creacion: Date;
        fecha_actualizacion: Date;
        ejecutivas: import("shared/entities/Ejecutiva.entity").Ejecutiva[];
        trazabilidades: import("shared/entities/Trazabilidad.entity").Trazabilidad[];
        clientes_finales: import("shared/entities/ClienteFinal.entity").ClienteFinal[];
    }[]>;
    registrarEmpresa(body: any): Promise<import("shared/entities/EmpresaProveedora.entity").EmpresaProveedora>;
    getEmpresasRegistradas(ejecutivaId: string): Promise<{
        id_empresa_prov: number;
        ruc: string;
        razon_social: string;
        correo: string;
        telefono: string;
        estado: string;
        fecha_creacion: Date;
        esta_asignada: boolean;
        puede_crear_clientes: boolean;
    }[]>;
    getClientes(ejecutivaId: string): Promise<{
        total_actividades: number;
        contacto_principal: import("shared/entities/PersonaContacto.entity").PersonaContacto;
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
        empresa_proveedora: import("shared/entities/EmpresaProveedora.entity").EmpresaProveedora;
        id_ejecutiva: number;
        ejecutiva: import("shared/entities/Ejecutiva.entity").Ejecutiva;
        personas_contacto: import("shared/entities/PersonaContacto.entity").PersonaContacto[];
        trazabilidades: import("shared/entities/Trazabilidad.entity").Trazabilidad[];
        fecha_creacion: Date;
        fecha_actualizacion: Date;
    }[]>;
    createCliente(body: any): Promise<import("shared/entities/ClienteFinal.entity").ClienteFinal>;
    createContacto(body: any): Promise<import("shared/entities/PersonaContacto.entity").PersonaContacto>;
    getContactos(clienteId: string, ejecutivaId: string): Promise<import("shared/entities/PersonaContacto.entity").PersonaContacto[]>;
    getPipeline(ejecutivaId: string): Promise<{
        oportunidades: import("shared/entities/Trazabilidad.entity").Trazabilidad[];
        agrupado_por_etapa: {};
        metricas: {
            total_oportunidades: number;
            total_monto_pipeline: number;
            promedio_probabilidad: number;
        };
    }>;
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
    getKPIsSemanales(ejecutivaId: string): Promise<{
        actividades_semana: number;
        nuevas_oportunidades: number;
        reuniones_agendadas: number;
        inicio_semana: Date;
    }>;
    bulkCreateClientes(file: any, ejecutivaId: string): Promise<{
        total: number;
        creados: number;
        duplicados_en_archivo: number;
        invalidos: number;
        resumen: {
            exitosos: number;
            con_errores: number;
        };
    }>;
    downloadPlantilla(_ejecutivaId: string, res: Response): Promise<void>;
}
