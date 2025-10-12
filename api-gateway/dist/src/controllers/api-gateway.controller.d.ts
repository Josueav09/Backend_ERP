import { HttpService } from '@nestjs/axios';
export declare class ApiGatewayController {
    private readonly httpService;
    constructor(httpService: HttpService);
    getCaptcha(): Promise<any>;
    login(body: any): Promise<any>;
    verifyEmail(body: any): Promise<any>;
    getPerfil(): Promise<any>;
    updatePerfil(body: any): Promise<any>;
    updatePassword(body: any): Promise<any>;
    getJefeStats(): Promise<any>;
    getAuditoria(): Promise<any>;
    getClientes(): Promise<any>;
    getEjecutivas(): Promise<any>;
    getEmpresas(): Promise<any>;
    getTrazabilidad(): Promise<any>;
}
