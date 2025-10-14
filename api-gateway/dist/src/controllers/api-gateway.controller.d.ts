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
    getClienteStats(): Promise<any>;
    getClienteTrazabilidad(): Promise<any>;
    getTraceabilityClienteTrazabilidad(): Promise<any>;
    getEjecutivaStats(ejecutivaId: string): Promise<any>;
    getEjecutivaEmpresas(ejecutivaId: string): Promise<any>;
    createEjecutivaEmpresa(body: any): Promise<any>;
    getEjecutivaClientes(ejecutivaId: string): Promise<any>;
    createEjecutivaCliente(body: any): Promise<any>;
    getEjecutivaTrazabilidad(ejecutivaId: string): Promise<any>;
    createEjecutivaTrazabilidad(body: any): Promise<any>;
}
