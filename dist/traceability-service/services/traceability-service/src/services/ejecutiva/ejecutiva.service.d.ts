import { Repository } from 'typeorm';
import { Trazabilidad } from '../../../../../shared/entities/Trazabilidad.entity';
import { Ejecutiva } from '../../../../../shared/entities/Ejecutiva.entity';
import { EmpresaProveedora } from '../../../../../shared/entities/EmpresaProveedora.entity';
import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
import { PersonaContacto } from '../../../../../shared/entities/PersonaContacto.entity';
export declare class EjecutivaTraceabilityService {
    private trazabilidadRepository;
    private ejecutivaRepository;
    private empresaRepository;
    private clienteRepository;
    private contactoRepository;
    constructor(trazabilidadRepository: Repository<Trazabilidad>, ejecutivaRepository: Repository<Ejecutiva>, empresaRepository: Repository<EmpresaProveedora>, clienteRepository: Repository<ClienteFinal>, contactoRepository: Repository<PersonaContacto>);
    getTrazabilidad(ejecutivaId: string): Promise<{
        id_trazabilidad: number;
        fecha_contacto: Date;
        tipo_contacto: string;
        resultado_contacto: string;
        empresa_proveedora: string;
        cliente_final: string;
        persona_contacto: string;
        reunion_agendada: boolean;
        fecha_reunion: Date;
        pasa_embudo_ventas: boolean;
        nombre_oportunidad: string;
        etapa_oportunidad: string;
        monto_total_sin_imp: number;
        observaciones: string;
        informacion_importante: string;
    }[]>;
    createTrazabilidad(data: {
        id_ejecutiva: string;
        id_empresa_prov: string;
        id_cliente_final: string;
        id_contacto: string;
        tipo_contacto: string;
        fecha_contacto: Date;
        resultado_contacto: string;
        informacion_importante?: string;
        reunion_agendada?: boolean;
        fecha_reunion?: Date;
        participantes?: string;
        se_dio_reunion?: boolean;
        resultados_reunion?: string;
        pasa_embudo_ventas?: boolean;
        nombre_oportunidad?: string;
        etapa_oportunidad?: string;
        producto_ofrecido?: string;
        monto_total_sin_imp?: number;
        probabilidad_cierre?: number;
        observaciones?: string;
    }): Promise<{
        id: number;
        fecha_contacto: Date;
        tipo_contacto: string;
        resultado: string;
        cliente: string;
        persona_contacto: string;
        oportunidad: string;
        etapa: string;
    }>;
    getPipeline(ejecutivaId: string): Promise<{
        id: number;
        nombre_oportunidad: string;
        cliente: string;
        persona_contacto: string;
        etapa: string;
        monto: number;
        probabilidad: number;
        fecha_cierre_esperado: Date;
        producto_ofrecido: string;
        fecha_inicio_etapa: Date;
    }[]>;
    getActividadesRecientes(ejecutivaId: string, limit?: number): Promise<{
        id: number;
        fecha: Date;
        tipo_contacto: string;
        resultado: string;
        cliente: string;
        persona_contacto: string;
        oportunidad: string;
        etapa: string;
        observaciones: string;
    }[]>;
    updateEtapaOportunidad(trazabilidadId: string, nuevaEtapa: string, ejecutivaId: string): Promise<{
        message: string;
        nueva_etapa: string;
    }>;
}
