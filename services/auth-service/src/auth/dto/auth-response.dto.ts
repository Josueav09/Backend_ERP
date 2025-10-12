export class AuthResponseDto {
  success: boolean;
  requiresEmailVerification?: boolean;
  email?: string;
  userId?: number;
  rol?: string;
  name?: string;
  error?: string;
  accessToken?: string;
}