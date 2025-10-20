// // backend/shared/guards/jwt-auth.guard.ts
// import { Injectable, ExecutionContext } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { Reflector } from '@nestjs/core';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
//   constructor(private reflector: Reflector) {
//     super();
//   }

//   canActivate(context: ExecutionContext) {
//     // Verificar si la ruta es pública
//     const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
//     if (isPublic) {
//       return true;
//     }

//     return super.canActivate(context);
//   }
// }

import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log('🔐 [Shared JwtAuthGuard] Authorization header recibido:', 
      request.headers?.authorization ? 'SÍ' : 'NO');
    
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('🔐 [Shared JwtAuthGuard] Resultado validación - Error:', err?.message);
    console.log('🔐 [Shared JwtAuthGuard] Resultado validación - Info:', info?.message);
    console.log('🔐 [Shared JwtAuthGuard] Resultado validación - User:', user ? 'VÁLIDO' : 'INVÁLIDO');
    
    if (err || !user) {
      console.log('❌ [Shared JwtAuthGuard] FALLA AUTENTICACIÓN:', {
        error: err?.message,
        info: info?.message,
        user: user
      });
      throw err || new UnauthorizedException('Token inválido o expirado');
    }
    
    console.log('✅ [Shared JwtAuthGuard] AUTENTICACIÓN EXITOSA');
    return user;
  }
}