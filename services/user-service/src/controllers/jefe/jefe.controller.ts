import { Controller, Get, Put, Body, Request, HttpException, HttpStatus } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
//import { SimpleJwtGuard } from '../../../../../shared/guards/simple-jwt.guard';
import { JefeService } from '../../services/jefe/jefe.service';
import { JwtAuthGuard } from '../../../../../shared/guards/jwt-auth.guard';

@Controller('jefe')

export class JefeController {
  constructor(private readonly jefeService: JefeService) { }

  @Get('perfil')
  @UseGuards(JwtAuthGuard)
  async getPerfil(@Request() req) {
    console.log('🔐 Headers:', req.headers);
    console.log('🔐 Authorization:', req.headers.authorization);
    console.log('🔐 User completo:', req.user); // ← DEBERÍA ESTAR DEFINIDO CON EL GUARD

    // if (!req.user) {
    //   throw new HttpException('Usuario no autenticado', HttpStatus.UNAUTHORIZED);
    // }

    const userId = req.user.id_jefe;
    console.log('🔐 [JefeController] User ID:', userId);
    return await this.jefeService.getPerfil(userId);
  }


  @Put('perfil')
  @UseGuards(JwtAuthGuard)
  async updatePerfil(@Request() req, @Body() body: any) {
    try {
      const userId = req.user.id_jefe;
      return await this.jefeService.updatePerfil(userId, body);
    } catch (error) {
      throw new HttpException('Error al actualizar perfil', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(@Request() req, @Body() body: any) {
    try {
      const userId = req.user.id_jefe;
      const { password_actual, password_nueva } = body;
      return await this.jefeService.updatePassword(userId, password_actual, password_nueva);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al actualizar contraseña', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats(@Request() req) {
    console.log('🔐 [JefeController] Headers:', req.headers);
    console.log('🔐 [JefeController] User:', req.user);
    console.log('🔐 [JefeController] Authorization:', req.headers.authorization);
    console.log('🔐 User para stats:', req.user);
    try {
      return await this.jefeService.getStats();
    } catch (error) {
      const e = error;
      throw new HttpException('Error al obtener estadísticas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}