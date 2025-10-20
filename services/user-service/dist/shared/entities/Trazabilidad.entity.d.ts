import { Ejecutiva } from './Ejecutiva.entity';
import { EmpresaProveedora } from './EmpresaProveedora.entity';
import { ClienteFinal } from './ClienteFinal.entity';
import { PersonaContacto } from './PersonaContacto.entity';
export declare class Trazabilidad {
    id_trazabilidad: number;
    ejecutiva: Ejecutiva;
    empresa_proveedora: EmpresaProveedora;
    cliente_final: ClienteFinal;
    persona_contacto: PersonaContacto;
    fecha_agregado_base: Date;
    tipo_contacto: string;
    fecha_contacto: Date;
    resultado_contacto: string;
    etapa_oportunidad: string;
    fecha_inicio: Date;
    nombre_oportunidad: string;
    tipo_oportunidad: string;
    monto_total_sin_imp: number;
    probabilidad_cierre: number;
    fecha_cierre: Date;
    monto_cierre: number;
    observaciones: string;
    fecha_creacion: Date;
}
