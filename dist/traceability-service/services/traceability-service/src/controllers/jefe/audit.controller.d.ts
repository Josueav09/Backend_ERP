import { AuditService } from '../../services/jefe/audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    getAuditoriaContratos(): Promise<any[]>;
}
