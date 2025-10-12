import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/users.entity';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { EmailService } from '../email/email.service';
export declare class AuthService {
    private userRepository;
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
    constructor(userRepository: Repository<User>, jwtService: JwtService, emailService: EmailService);
    generateCaptcha(): {
        captchaText: string;
        captchaToken: string;
    };
    private validateCaptcha;
    login(loginDto: LoginDto, clientIp: string): Promise<{
        success: boolean;
        requiresEmailVerification: boolean;
        email: string;
        userId: number;
        rol: "jefe" | "ejecutiva" | "empresa" | "cliente";
        name: string;
    }>;
    verifyEmailCode(verifyDto: VerifyEmailDto): Promise<{
        success: boolean;
        userId: number;
        email: string;
        rol: "jefe" | "ejecutiva" | "empresa" | "cliente";
        name: string;
        accessToken: string;
    }>;
    private checkBlockedAttempts;
    private recordFailedAttempt;
    private clearFailedAttempts;
    private getRemainingAttempts;
}
