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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService) {
        const jwtSecret = configService.get('JWT_SECRET');
        console.log('🔐 [Shared JwtStrategy] JWT_SECRET configurado:', jwtSecret ? 'SÍ' : 'NO');
        console.log('🔐 [Shared JwtStrategy] JWT_SECRET length:', jwtSecret?.length);
        console.log('🔐 [Shared JwtStrategy] JWT_SECRET primeros 10 chars:', jwtSecret?.substring(0, 10) + '...');
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret || 'fallback-secret',
        });
        this.configService = configService;
    }
    async validate(payload) {
        console.log('🔐 [Shared JwtStrategy] Validando payload:', payload);
        if (!payload.sub || !payload.email || !payload.userType) {
            console.log('❌ [Shared JwtStrategy] Payload incompleto:', {
                sub: payload.sub,
                email: payload.email,
                userType: payload.userType
            });
            throw new common_1.UnauthorizedException('Token inválido: estructura incorrecta');
        }
        const user = {
            id: payload.sub,
            email: payload.email,
            rol: payload.rol,
            userType: payload.userType,
            id_jefe: payload.userType === 'jefe' ? payload.sub : null,
            id_empresa_prov: payload.userType === 'empresa' ? payload.sub : null,
            id_ejecutiva: payload.userType === 'ejecutiva' ? payload.sub : null,
        };
        console.log('✅ [Shared JwtStrategy] User validado exitosamente:', user);
        return user;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map