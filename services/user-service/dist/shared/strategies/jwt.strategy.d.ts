import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
interface JwtPayload {
    sub: number;
    email: string;
    rol: string;
    userType: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): Promise<{
        id: number;
        email: string;
        rol: string;
        userType: string;
        id_jefe: number;
        id_empresa_prov: number;
        id_ejecutiva: number;
    }>;
}
export {};
