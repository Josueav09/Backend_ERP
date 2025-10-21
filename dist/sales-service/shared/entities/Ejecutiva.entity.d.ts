import { Jefe } from './Jefe.entity';
import { EmpresaProveedora } from './EmpresaProveedora.entity';
import { ClienteFinal } from './ClienteFinal.entity';
import { Trazabilidad } from './Trazabilidad.entity';
export declare class Ejecutiva {
    id_ejecutiva: number;
    dni: string;
    nombre_completo: string;
    correo: string;
    contraseña: string;
    telefono: string;
    linkedin: string;
    estado_ejecutiva: string;
    jefe: Jefe;
    id_empresa_prov: number;
    empresa_proveedora: EmpresaProveedora;
    clientes_finales: ClienteFinal[];
    trazabilidades: Trazabilidad[];
    empresas_registradas: EmpresaProveedora[];
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}
