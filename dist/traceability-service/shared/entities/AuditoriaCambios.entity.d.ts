import { EmpresaProveedora } from './EmpresaProveedora.entity';
import { ClienteFinal } from './ClienteFinal.entity';
import { Ejecutiva } from './Ejecutiva.entity';
export declare class AuditoriaCambios {
    id_auditoria: number;
    empresa_proveedora: EmpresaProveedora;
    cliente_final: ClienteFinal;
    ejecutiva: Ejecutiva;
    accion: string;
    detalles: string;
    fecha_accion: Date;
    usuario_responsable: string;
    estado_anterior: string;
    estado_nuevo: string;
    observaciones_adicionales: string;
    motivo_desvinculacion: string;
    ejecutiva_anterior: Ejecutiva;
    ejecutiva_nueva: Ejecutiva;
}
