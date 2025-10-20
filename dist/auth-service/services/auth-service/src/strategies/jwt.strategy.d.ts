import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Jefe } from '../../../../shared/entities/Jefe.entity';
import { EmpresaProveedora } from '../../../../shared/entities/EmpresaProveedora.entity';
import { Ejecutiva } from '../../../../shared/entities/Ejecutiva.entity';
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
    private jefeRepository;
    private empresaRepository;
    private ejecutivaRepository;
    private configService;
    constructor(jefeRepository: Repository<Jefe>, empresaRepository: Repository<EmpresaProveedora>, ejecutivaRepository: Repository<Ejecutiva>, configService: ConfigService);
    validate(payload: JwtPayload): Promise<{
        id_jefe: any;
        id_empresa_prov: any;
        id_ejecutiva: any;
        userType: "ejecutiva" | "jefe" | "empresa";
        correo: any;
        rol: any;
        userEntity: any;
    }>;
}
export {};
