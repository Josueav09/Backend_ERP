import { Ejecutiva } from './Ejecutiva.entity';
import { Trazabilidad } from './Trazabilidad.entity';
export declare class EmpresaProveedora {
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
    fecha_creacion: Date;
    fecha_actualizacion: Date;
    ejecutivas: Ejecutiva[];
    trazabilidades: Trazabilidad[];
}
