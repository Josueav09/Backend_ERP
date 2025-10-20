"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        console.log('🔐 [Shared JwtAuthGuard] Authorization header recibido:', request.headers?.authorization ? 'SÍ' : 'NO');
        return super.canActivate(context);
    }
    handleRequest(err, user, info) {
        console.log('🔐 [Shared JwtAuthGuard] Resultado validación - Error:', err?.message);
        console.log('🔐 [Shared JwtAuthGuard] Resultado validación - Info:', info?.message);
        console.log('🔐 [Shared JwtAuthGuard] Resultado validación - User:', user ? 'VÁLIDO' : 'INVÁLIDO');
        if (err || !user) {
            console.log('❌ [Shared JwtAuthGuard] FALLA AUTENTICACIÓN:', {
                error: err?.message,
                info: info?.message,
                user: user
            });
            throw err || new common_1.UnauthorizedException('Token inválido o expirado');
        }
        console.log('✅ [Shared JwtAuthGuard] AUTENTICACIÓN EXITOSA');
        return user;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map