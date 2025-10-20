import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Jefe } from '../../../../shared/entities/Jefe.entity';
import { EmpresaProveedora } from '../../../../shared/entities/EmpresaProveedora.entity';
import { Ejecutiva } from '../../../../shared/entities/Ejecutiva.entity';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { EmailService } from '../email/email.service';
export declare class AuthService {
    private jefeRepository;
    private empresaRepository;
    private ejecutivaRepository;
    private jwtService;
    private emailService;
    private captchaMap;
    private tempEmailCodes;
    private userAttempts;
    private ipAttempts;
    private readonly MAX_USER_ATTEMPTS;
    private readonly MAX_IP_ATTEMPTS;
    private readonly BLOCK_DURATION;
    private readonly CAPTCHA_EXPIRY;
    constructor(jefeRepository: Repository<Jefe>, empresaRepository: Repository<EmpresaProveedora>, ejecutivaRepository: Repository<Ejecutiva>, jwtService: JwtService, emailService: EmailService);
    login(loginDto: LoginDto, clientIp: string): Promise<{
        success: boolean;
        requiresEmailVerification: boolean;
        email: string;
        userId: number;
        rol: any;
        name: any;
        userType: string;
    }>;
    verifyEmailCode(verifyDto: VerifyEmailDto): Promise<{
        success: boolean;
        userId: number;
        email: string;
        rol: any;
        name: any;
        userType: string;
        accessToken: string;
    }>;
    private getUserId;
    private validateCaptcha;
    private checkBlockedAttempts;
    private recordFailedAttempt;
    private clearFailedAttempts;
    private getRemainingAttempts;
    generateCaptcha(): {
        captchaText: string;
        captchaToken: string;
    };
}
