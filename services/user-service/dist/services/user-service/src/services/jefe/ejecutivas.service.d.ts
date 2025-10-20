import { Repository } from 'typeorm';
import { Ejecutiva } from '../../../../../shared/entities/Ejecutiva.entity';
import { EmpresaProveedora } from '../../../../../shared/entities/EmpresaProveedora.entity';
import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
import { Trazabilidad } from '../../../../../shared/entities/Trazabilidad.entity';
import { Jefe } from 'shared/entities/Jefe.entity';
export declare class EjecutivasService {
    private ejecutivaRepository;
    private empresaRepository;
    private clienteRepository;
    private trazabilidadRepository;
    private jefeRepository;
    constructor(ejecutivaRepository: Repository<Ejecutiva>, empresaRepository: Repository<EmpresaProveedora>, clienteRepository: Repository<ClienteFinal>, trazabilidadRepository: Repository<Trazabilidad>, jefeRepository: Repository<Jefe>);
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
        jefe: Jefe;
        empresa_proveedora: EmpresaProveedora;
        clientes_finales: ClienteFinal[];
        trazabilidades: Trazabilidad[];
        fecha_creacion: Date;
        fecha_actualizacion: Date;
    }[]>;
    getEjecutivaById(id: number): Promise<{
        ejecutiva: Ejecutiva;
        estadisticas: {
            total_clientes: number;
            total_actividades: number;
            actividades_recientes: Trazabilidad[];
        };
    }>;
    createEjecutiva(data: any): Promise<Ejecutiva>;
    updateEjecutiva(id: number, data: any): Promise<Ejecutiva>;
    deleteEjecutiva(id: number): Promise<Ejecutiva>;
}
