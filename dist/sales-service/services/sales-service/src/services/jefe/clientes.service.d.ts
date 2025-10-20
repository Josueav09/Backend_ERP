import { Repository } from 'typeorm';
import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
import { Ejecutiva } from '../../../../../shared/entities/Ejecutiva.entity';
import { EmpresaProveedora } from '../../../../../shared/entities/EmpresaProveedora.entity';
import { PersonaContacto } from '../../../../../shared/entities/PersonaContacto.entity';
import { Trazabilidad } from '../../../../../shared/entities/Trazabilidad.entity';
export declare class ClientesService {
    private clienteRepository;
    private ejecutivaRepository;
    private empresaRepository;
    private contactoRepository;
    private trazabilidadRepository;
    constructor(clienteRepository: Repository<ClienteFinal>, ejecutivaRepository: Repository<Ejecutiva>, empresaRepository: Repository<EmpresaProveedora>, contactoRepository: Repository<PersonaContacto>, trazabilidadRepository: Repository<Trazabilidad>);
    getClientes(): Promise<{
        total_actividades: number;
        ultima_actividad: Date;
        ejecutiva_asignada: string;
        empresa_proveedora: string;
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
        ejecutiva: Ejecutiva;
        personas_contacto: PersonaContacto[];
        trazabilidades: Trazabilidad[];
        fecha_creacion: Date;
        fecha_actualizacion: Date;
    }[]>;
    getClienteById(id: number): Promise<{
        cliente: ClienteFinal;
        actividades_recientes: Trazabilidad[];
        total_actividades: number;
        personas_contacto: PersonaContacto[];
    }>;
    createCliente(data: any): Promise<ClienteFinal>;
    updateCliente(id: number, data: any): Promise<ClienteFinal>;
    deleteCliente(id: number): Promise<{
        message: string;
    }>;
}
