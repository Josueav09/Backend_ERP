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
        totalEmpresas: number;
        totalEjecutivas: number;
        totalClientes: number;
        clientesEsteMes: number;
        revenueTotal: any;
        pipelineOportunidades: any;
        dashboardEjecutivas: any;
        kpis: {
            tasaConversion: string;
            clientesNuevosMes: number;
            actividadesMes: number;
        };
    }>;
    private getClientesNuevosMes;
    private getActividadesMes;
}
