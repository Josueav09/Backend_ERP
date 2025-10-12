"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const users_entity_1 = require("../users/entities/users.entity");
const email_service_1 = require("../email/email.service");
let AuthService = class AuthService {
    constructor(userRepository, jwtService, emailService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.captchaMap = new Map();
        this.tempEmailCodes = new Map();
        this.userAttempts = new Map();
        this.ipAttempts = new Map();
        this.MAX_USER_ATTEMPTS = 7;
        this.MAX_IP_ATTEMPTS = 5;
        this.BLOCK_DURATION = 30 * 60 * 1000;
        this.CAPTCHA_EXPIRY = 5 * 60 * 1000;
    }
    generateCaptcha() {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let result = "";
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
        this.captchaMap.set(token, result);
        setTimeout(() => {
            this.captchaMap.delete(token);
        }, this.CAPTCHA_EXPIRY);
        console.log(`🔐 Captcha generado: ${result} (token: ${token})`);
        return { captchaText: result, captchaToken: token };
    }
    validateCaptcha(token, userInput) {
        const expected = this.captchaMap.get(token);
        if (!expected) {
            throw new common_1.BadRequestException('Captcha expirado o inválido. Genere uno nuevo.');
        }
        if (expected.toUpperCase() !== userInput.toUpperCase()) {
            this.captchaMap.delete(token);
            throw new common_1.BadRequestException('Captcha incorrecto. Intente nuevamente.');
        }
        this.captchaMap.delete(token);
        console.log(`✅ Captcha validado correctamente`);
    }
    async login(loginDto, clientIp) {
        const { email, password, captchaToken, captchaResponse } = loginDto;
        if (!captchaToken || !captchaResponse) {
            throw new common_1.BadRequestException('Por favor complete el captcha');
        }
        this.validateCaptcha(captchaToken, captchaResponse);
        this.checkBlockedAttempts(email, clientIp);
        const user = await this.userRepository.findOne({
            where: { email, activo: true },
        });
        if (!user) {
            this.recordFailedAttempt(email, clientIp);
            throw new common_1.UnauthorizedException('Usuario no encontrado o inactivo');
        }
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            this.recordFailedAttempt(email, clientIp);
            const remaining = this.getRemainingAttempts(email, clientIp);
            throw new common_1.UnauthorizedException(`Contraseña incorrecta. ${remaining.user} intentos restantes para el usuario. ${remaining.ip} intentos restantes para esta IP.`);
        }
        this.clearFailedAttempts(email, clientIp);
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        this.tempEmailCodes.set(user.email, code);
        setTimeout(() => {
            this.tempEmailCodes.delete(user.email);
        }, this.CAPTCHA_EXPIRY);
        try {
            await this.emailService.sendVerificationCode(user.email, code);
            console.log(`✅ Código enviado a ${user.email}: ${code}`);
        }
        catch (error) {
            console.error('❌ Error enviando email:', error);
            throw new common_1.HttpException('No se pudo enviar el código de verificación', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return {
            success: true,
            requiresEmailVerification: true,
            email: user.email,
            userId: user.id_usuario,
            rol: user.rol,
            name: `${user.nombre} ${user.apellido}`.trim(),
        };
    }
    async verifyEmailCode(verifyDto) {
        const { email, code } = verifyDto;
        const expectedCode = this.tempEmailCodes.get(email);
        if (!expectedCode || expectedCode !== code) {
            throw new common_1.UnauthorizedException('Código inválido o expirado');
        }
        this.tempEmailCodes.delete(email);
        const user = await this.userRepository.findOne({
            where: { email, activo: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
        user.ultima_conexion = new Date();
        await this.userRepository.save(user);
        const payload = {
            sub: user.id_usuario,
            email: user.email,
            rol: user.rol,
        };
        const accessToken = this.jwtService.sign(payload);
        return {
            success: true,
            userId: user.id_usuario,
            email: user.email,
            rol: user.rol,
            name: `${user.nombre} ${user.apellido}`.trim(),
            accessToken,
        };
    }
    checkBlockedAttempts(email, ip) {
        const now = Date.now();
        const userAttempt = this.userAttempts.get(email);
        const ipAttempt = this.ipAttempts.get(ip);
        if (userAttempt && now - userAttempt.lastAttempt > this.BLOCK_DURATION) {
            this.userAttempts.delete(email);
        }
        if (ipAttempt && now - ipAttempt.lastAttempt > this.BLOCK_DURATION) {
            this.ipAttempts.delete(ip);
        }
        const userCount = this.userAttempts.get(email)?.count || 0;
        const ipCount = this.ipAttempts.get(ip)?.count || 0;
        if (userCount >= this.MAX_USER_ATTEMPTS) {
            throw new common_1.HttpException('Cuenta bloqueada por múltiples intentos fallidos. Intente nuevamente en 30 minutos.', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        if (ipCount >= this.MAX_IP_ATTEMPTS) {
            throw new common_1.HttpException('IP bloqueada por múltiples intentos fallidos. Intente nuevamente en 30 minutos.', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
    }
    recordFailedAttempt(email, ip) {
        const now = Date.now();
        const userAttempt = this.userAttempts.get(email) || { count: 0, lastAttempt: now };
        userAttempt.count += 1;
        userAttempt.lastAttempt = now;
        this.userAttempts.set(email, userAttempt);
        const ipAttempt = this.ipAttempts.get(ip) || { count: 0, lastAttempt: now };
        ipAttempt.count += 1;
        ipAttempt.lastAttempt = now;
        this.ipAttempts.set(ip, ipAttempt);
    }
    clearFailedAttempts(email, ip) {
        this.userAttempts.delete(email);
        this.ipAttempts.delete(ip);
    }
    getRemainingAttempts(email, ip) {
        const userCount = this.userAttempts.get(email)?.count || 0;
        const ipCount = this.ipAttempts.get(ip)?.count || 0;
        return {
            user: this.MAX_USER_ATTEMPTS - userCount,
            ip: this.MAX_IP_ATTEMPTS - ipCount,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map