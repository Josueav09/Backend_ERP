import { Controller, Get, Put, Body, HttpException, HttpStatus } from '@nestjs/common';
import { JefeService } from '../services/jefe.service';

@Controller('jefe')
export class JefeController {
  constructor(private readonly jefeService: JefeService) {}

  @Get('perfil')
  async getPerfil() {
    try {
      return await this.jefeService.getPerfil();
    } catch (error) {
      throw new HttpException('Error al obtener perfil', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('perfil')
  async updatePerfil(@Body() body: any) {
    try {
      return await this.jefeService.updatePerfil(body);
    } catch (error) {
      throw new HttpException('Error al actualizar perfil', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('password')
  async updatePassword(@Body() body: any) {
    try {
      const { password_actual, password_nueva } = body;
      return await this.jefeService.updatePassword(password_actual, password_nueva);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al actualizar contraseña', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('stats')
  async getStats() {
    try {
      return await this.jefeService.getStats();
    } catch (error) {
      throw new HttpException('Error al obtener estadísticas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}