import { Repository } from 'typeorm';
import { EmpresaProveedora } from '../../../../../shared/entities/EmpresaProveedora.entity';
import { Ejecutiva } from '../../../../../shared/entities/Ejecutiva.entity';
import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
import { Trazabilidad } from '../../../../../shared/entities/Trazabilidad.entity';
export declare class EmpresaDashboardService {
    private empresaRepository;
    private ejecutivaRepository;
    private clienteRepository;
    private trazabilidadRepository;
    constructor(empresaRepository: Repository<EmpresaProveedora>, ejecutivaRepository: Repository<Ejecutiva>, clienteRepository: Repository<ClienteFinal>, trazabilidadRepository: Repository<Trazabilidad>);
    getStats(empresaId: number): Promise<{
        cliente: {
            nombre_cliente: string;
            nombre_empresa: string;
            ejecutiva_nombre: string;
            ejecutiva_email: string;
        };
        totalActividades: number;
        completadas: number;
        enProceso: number;
        rendimiento: number;
        totalClientes: number;
        totalEjecutivas: number;
        actividadesEsteMes: number;
        clientesEsteMes: number;
        revenueTotal: number;
        pipelineOportunidades: number;
        tasaConversion: string;
        ventasGanadas: number;
    }>;
    private getActividadesCompletadas;
    private getActividadesEnProceso;
    getTrazabilidad(empresaId: number): Promise<{
        id_trazabilidad: number;
        tipo_actividad: string;
        descripcion: string;
        fecha_actividad: Date;
        resultado_contacto: string;
        notas: string;
        informacion_importante: string;
        resultados_reunion: string;
        ejecutiva_nombre: string;
        nombre_empresa: string;
        cliente_nombre: string;
        contacto_nombre: string;
    }[]>;
    getEjecutivaInfo(empresaId: number): Promise<{
        ejecutiva_nombre: string;
        ejecutiva_email: string;
        telefono: string;
        linkedin?: undefined;
    } | {
        ejecutiva_nombre: string;
        ejecutiva_email: string;
        telefono: string;
        linkedin: string;
    }>;
    private getTotalClientes;
    private getTotalEjecutivas;
    private getTotalActividades;
    private getActividadesEsteMes;
    private getClientesEsteMes;
    private getRevenueTotal;
    private getPipelineOportunidades;
    private getVentasGanadas;
    private getEmptyStats;
    getClientesRecientes(empresaId: number): Promise<{
        id_cliente_final: number;
        razon_social: string;
        ruc: string;
        correo: string;
        telefono: string;
        pais: string;
        rubro: string;
        estado: string;
        fecha_creacion: Date;
        ejecutiva_nombre: string;
        actividades_completadas: number;
        actividades_en_proceso: number;
        total_actividades: number;
    }[]>;
    private getEstadisticasCliente;
    private mapEstadoTrazabilidad;
    getEjecutivaInfoCompleta(empresaId: number): Promise<{
        ejecutiva_nombre: string;
        ejecutiva_email: string;
        telefono: string;
        linkedin: any;
        estadisticas?: undefined;
    } | {
        ejecutiva_nombre: string;
        ejecutiva_email: string;
        telefono: string;
        linkedin: string;
        estadisticas: {
            clientes_activos: number;
            tasa_conversion: string;
            ventas_ganadas: number;
            tiempo_respuesta: string;
        };
    }>;
    private getEstadisticasEjecutiva;
    getEjecutivasByEmpresa(empresaId: number): Promise<any[]>;
    getEquipoStats(empresaId: number): Promise<any>;
    getEmbudoVentasEjecutiva(ejecutivaId: number, empresaId: number): Promise<any[]>;
    private calcularTasaConversion;
    getEstadisticasEjecutivaCompleta(ejecutivaId: number, empresaId: number): Promise<any>;
    private getTotalOportunidadesEjecutiva;
    getClientesPorEjecutiva(ejecutivaId: number, empresaId: number): Promise<any[]>;
    private getClientesActivosEjecutiva;
    private getVentasGanadasEjecutiva;
    private getTotalActividadesEjecutiva;
    private getActividadesEsteMesEjecutiva;
    private getRevenueEjecutiva;
    private getConversionPromedioEquipo;
    private calcularTiempoRespuestaPromedio;
}
