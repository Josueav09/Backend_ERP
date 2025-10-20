import { Ejecutiva } from './Ejecutiva.entity';
export declare class Jefe {
    id_jefe: number;
    dni: string;
    nombre_completo: string;
    correo: string;
    contraseña: string;
    telefono: string;
    linkedin: string;
    rol: string;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
    ejecutivas: Ejecutiva[];
}
