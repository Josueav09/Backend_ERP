"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Jefe_entity_1 = require("../../../../shared/entities/Jefe.entity");
const EmpresaProveedora_entity_1 = require("../../../../shared/entities/EmpresaProveedora.entity");
const Ejecutiva_entity_1 = require("../../../../shared/entities/Ejecutiva.entity");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(jefeRepository, empresaRepository, ejecutivaRepository, configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET') || 'your-secret-key-change-in-production',
        });
        this.jefeRepository = jefeRepository;
        this.empresaRepository = empresaRepository;
        this.ejecutivaRepository = ejecutivaRepository;
        this.configService = configService;
    }
    async validate(payload) {
        console.log('🔐 JWR.STRATEGY.TS Payload recibido:', payload);
        console.log('🔐 Buscando userType:', payload.userType);
        console.log('🔐 Sub (ID):', payload.sub);
        const { sub, email, rol, userType } = payload;
        let user = null;
        switch (userType) {
            case 'jefe':
                user = await this.jefeRepository.findOne({
                    where: { id_jefe: sub, correo: email }
                });
                break;
            case 'empresa':
                user = await this.empresaRepository.findOne({
                    where: {
                        id_empresa_prov: sub,
                        correo: email,
                        estado: 'Activo'
                    }
                });
                break;
            case 'ejecutiva':
                user = await this.ejecutivaRepository.findOne({
                    where: {
                        id_ejecutiva: sub,
                        correo: email,
                        estado_ejecutiva: 'Activo'
                    }
                });
                break;
            default:
                throw new common_1.UnauthorizedException('Tipo de usuario no válido');
        }
        if (!user) {
            throw new common_1.UnauthorizedException('Usuario no válido o inactivo');
        }
        return {
            id_jefe: user.id_jefe,
            id_empresa_prov: user.id_empresa_prov,
            id_ejecutiva: user.id_ejecutiva,
            userType: userType,
            correo: user.correo,
            rol: user.rol,
            userEntity: user
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Jefe_entity_1.Jefe)),
    __param(1, (0, typeorm_1.InjectRepository)(EmpresaProveedora_entity_1.EmpresaProveedora)),
    __param(2, (0, typeorm_1.InjectRepository)(Ejecutiva_entity_1.Ejecutiva)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map