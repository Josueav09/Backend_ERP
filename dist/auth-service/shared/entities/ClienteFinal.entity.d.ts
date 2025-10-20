import { Ejecutiva } from './Ejecutiva.entity';
import { PersonaContacto } from './PersonaContacto.entity';
import { Trazabilidad } from './Trazabilidad.entity';
export declare class ClienteFinal {
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
}
