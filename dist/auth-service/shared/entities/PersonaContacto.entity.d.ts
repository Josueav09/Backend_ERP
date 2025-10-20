import { ClienteFinal } from './ClienteFinal.entity';
import { Trazabilidad } from './Trazabilidad.entity';
export declare class PersonaContacto {
    id_contacto: number;
    dni: string;
    nombre_completo: string;
    cargo: string;
    correo: string;
    telefono: string;
    linkedin: string;
    cliente_final: ClienteFinal;
    trazabilidades: Trazabilidad[];
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}
