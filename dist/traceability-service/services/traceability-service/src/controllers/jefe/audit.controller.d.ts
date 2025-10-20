import { AuditService } from '../../services/jefe/audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    getAuditoriaContratos(req: any, fechaInicio?: string, fechaFin?: string, accion?: string, usuario?: string): Promise<{
        id_auditoria: number;
        accion: string;
        detalles: string;
        fecha_accion: Date;
        usuario_responsable: string;
        empresa: string;
        cliente: string;
        ejecutiva: string;
        ejecutiva_anterior: string;
        ejecutiva_nueva: string;
        estado_anterior: string;
        estado_nuevo: string;
        motivo_desvinculacion: string;
        observaciones_adicionales: string;
    }[]>;
    getEstadisticasAuditoria(req: any): Promise<{
        total_registros: number;
        acciones_por_tipo: any[];
        top_usuarios: any[];
        auditorias_recientes: {
            id_auditoria: number;
            accion: string;
            fecha_accion: Date;
            usuario_responsable: string;
            empresa: string;
            cliente: string;
            ejecutiva: string;
        }[];
        estadisticas_por_entidad: any[];
        resumen: {
            total_acciones: number;
            accion_mas_comun: any;
            usuario_mas_activo: any;
        };
    }>;
    getAuditoriaResumenMensual(req: any): Promise<any[]>;
}
