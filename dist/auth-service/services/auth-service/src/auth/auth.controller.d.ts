import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getCaptcha(): Promise<{
        captchaText: string;
        captchaToken: string;
    }>;
    login(loginDto: LoginDto, clientIp: string): Promise<{
        success: boolean;
        requiresEmailVerification: boolean;
        email: string;
        userId: number;
        rol: any;
        name: any;
        userType: string;
    }>;
    verifyEmail(verifyDto: VerifyEmailDto): Promise<{
        success: boolean;
        userId: number;
        email: string;
        rol: any;
        name: any;
        userType: string;
        accessToken: string;
    }>;
}
