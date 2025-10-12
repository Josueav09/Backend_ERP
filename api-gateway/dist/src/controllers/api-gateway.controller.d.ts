import { HttpService } from '@nestjs/axios';
export declare class ApiGatewayController {
    private readonly httpService;
    constructor(httpService: HttpService);
    getJefeStats(): Promise<any>;
    getAuditoria(): Promise<any>;
    getClientes(): Promise<any>;
    getEjecutivas(): Promise<any>;
    getEmpresas(): Promise<any>;
    getTrazabilidad(): Promise<any>;
}
