import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm'; // ✅ Importar MoreThanOrEqual
import { Jefe } from '../../../../../shared/entities/Jefe.entity';
import { EmpresaProveedora } from '../../../../../shared/entities/EmpresaProveedora.entity';
import { Ejecutiva } from '../../../../../shared/entities/Ejecutiva.entity';
import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
import { Trazabilidad } from '../../../../../shared/entities/Trazabilidad.entity';

@Injectable()
export class JefeService {
  constructor(
    @InjectRepository(Jefe)
    private jefeRepository: Repository<Jefe>,

    @InjectRepository(EmpresaProveedora)
    private empresaRepository: Repository<EmpresaProveedora>,

    @InjectRepository(Ejecutiva)
    private ejecutivaRepository: Repository<Ejecutiva>,

    @InjectRepository(ClienteFinal)
    private clienteRepository: Repository<ClienteFinal>,

    @InjectRepository(Trazabilidad)
    private trazabilidadRepository: Repository<Trazabilidad>,
  ) { }

  // async getPerfil(userId: number) {
  //   const jefe = await this.jefeRepository.findOne({ 
  //     where: { id_jefe: userId } 
  //   });

  //   if (!jefe) {
  //     throw new HttpException('Jefe no encontrado', HttpStatus.NOT_FOUND);
  //   }

  //   return jefe;
  // }
  async getPerfil(userId: number) {
    console.log('🔐 [JefeService] === INICIANDO getPerfil ===');
    console.log('🔐 [JefeService] userId recibido:', userId);
    console.log('🔐 [JefeService] Tipo de userId:', typeof userId);

    try {
      // ✅ VERIFICAR SI EL REPOSITORIO ESTÁ CONECTADO
      console.log('🔐 [JefeService] jefeRepository:', this.jefeRepository ? 'DEFINIDO' : 'NO DEFINIDO');

      // ✅ VERIFICAR TODOS LOS JEFES EN LA BD
      const todosJefes = await this.jefeRepository.find();
      console.log('🔐 [JefeService] Todos los jefes en BD:', todosJefes);
      console.log('🔐 [JefeService] Cantidad de jefes:', todosJefes.length);

      // ✅ BUSCAR JEFE ESPECÍFICO
      console.log('🔐 [JefeService] Buscando jefe con id_jefe:', userId);
      const jefe = await this.jefeRepository.findOne({
        where: { id_jefe: userId }
      });

      console.log('🔐 [JefeService] Resultado de findOne:', jefe);

      if (!jefe) {
        console.log('❌ [JefeService] Jefe NO encontrado para id:', userId);

        // Verificar si hay algún problema con el tipo de dato
        const jefeComoString = await this.jefeRepository.findOne({
          where: { id_jefe: userId.toString() as any }
        });
        console.log('🔐 [JefeService] Búsqueda con string:', jefeComoString);

        return null;
      }

      console.log('✅ [JefeService] Jefe ENCONTRADO:', {
        id_jefe: jefe.id_jefe,
        nombre_completo: jefe.nombre_completo,
        correo: jefe.correo,
        telefono: jefe.telefono,
        fecha_creacion: jefe.fecha_creacion
      });

      // ✅ FORMATEAR DATOS PARA EL FRONTEND
      const nombreParts = jefe.nombre_completo.split(' ');
      const perfilData = {
        id_jefe: jefe.id_jefe,
        dni: jefe.dni,
        nombre_completo: jefe.nombre_completo, // ✅ NO dividir el nombre
        email: jefe.correo,
        telefono: jefe.telefono,
        linkedin: jefe.linkedin,
        rol: jefe.rol, // ✅ INCLUIR EL ROL
        fecha_creacion: jefe.fecha_creacion,
        fecha_actualizacion: jefe.fecha_actualizacion
      };

      console.log('✅ [JefeService] Perfil formateado:', perfilData);
      return perfilData;

    } catch (error) {
      console.error('❌ [JefeService] ERROR en getPerfil:', error);
      console.error('❌ [JefeService] Stack trace:', error.stack);
      throw new HttpException(
        'Error al obtener perfil del jefe',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updatePerfil(userId: number, data: any) {
    const { nombre_completo, telefono, linkedin } = data;

    const result = await this.jefeRepository.update(
      { id_jefe: userId },
      {
        nombre_completo: nombre_completo,
        telefono: telefono,
        linkedin: linkedin,
        fecha_actualizacion: new Date()
      }
    );

    if (result.affected === 0) {
      throw new HttpException('No se pudo actualizar el perfil', HttpStatus.BAD_REQUEST);
    }

    return await this.jefeRepository.findOne({ where: { id_jefe: userId } });
  }

  async updatePassword(userId: number, password_actual: string, password_nueva: string) {
    if (!password_actual || !password_nueva) {
      throw new HttpException('Contraseña actual y nueva son requeridas', HttpStatus.BAD_REQUEST);
    }

    const jefe = await this.jefeRepository.findOne({
      where: { id_jefe: userId }
    });

    if (!jefe) {
      throw new HttpException('Jefe no encontrado', HttpStatus.NOT_FOUND);
    }

    // Verificar contraseña actual
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(password_actual, jefe.contraseña);
    if (!isValidPassword) {
      throw new HttpException('Contraseña actual incorrecta', HttpStatus.UNAUTHORIZED);
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(password_nueva, 10);

    await this.jefeRepository.update(
      { id_jefe: userId },
      {
        contraseña: hashedPassword,
        fecha_actualizacion: new Date()
      }
    );

    return { message: "Contraseña actualizada exitosamente" };
  }

  async getStats() {
    try {
      console.log('📊 Obteniendo estadísticas para jefe...');

      const [
        totalEmpresas,
        totalEjecutivas,
        totalClientes,
        clientesEsteMes,
        actividadesEsteMes,
        pipelineData,
        dashboardData
      ] = await Promise.all([
        this.empresaRepository.count({ where: { estado: 'Activo' } }),
        this.ejecutivaRepository.count({ where: { estado_ejecutiva: 'Activo' } }),
        this.clienteRepository.count(),
        this.getClientesNuevosMes(), // ✅ Ya corregido
        this.getActividadesMes(),    // ✅ Ya corregido
        this.trazabilidadRepository.query('SELECT * FROM vista_pipeline_ventas'),
        this.trazabilidadRepository.query('SELECT * FROM vista_dashboard_ejecutiva')
      ]);

      // Calcular revenue total y tasa de conversión
      const revenueTotal = pipelineData.reduce((sum: number, item: any) => {
        return sum + (Number(item.monto_total_sin_imp) || 0);
      }, 0);

      // Calcular tasa de conversión real
      const ventasGanadas = pipelineData.filter((item: any) =>
        item.etapa_oportunidad === 'Venta ganada'
      ).length;
      const tasaConversion = totalClientes > 0
        ? ((ventasGanadas / totalClientes) * 100).toFixed(1) + '%'
        : '0%';

      const stats = {
        totalEmpresas,
        totalEjecutivas,
        totalClientes,
        clientesEsteMes,
        revenueTotal,
        pipelineOportunidades: pipelineData.length,
        dashboardEjecutivas: dashboardData,
        kpis: {
          tasaConversion,
          clientesNuevosMes: clientesEsteMes,
          actividadesMes: actividadesEsteMes
        }
      };

      console.log('✅ Estadísticas obtenidas:', stats);
      return stats;

    } catch (error) {
      console.error('❌ Error en getStats:', error);
      throw new HttpException('Error al obtener estadísticas del sistema', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async getClientesNuevosMes(): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // ✅ CORREGIDO: Usar MoreThanOrEqual de TypeORM
    return await this.clienteRepository.count({
      where: {
        fecha_creacion: MoreThanOrEqual(startOfMonth)
      }
    });
  }

  private async getActividadesMes(): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // ✅ CORREGIDO: Usar MoreThanOrEqual de TypeORM
    return await this.trazabilidadRepository.count({
      where: {
        fecha_contacto: MoreThanOrEqual(startOfMonth)
      }
    });
  }
}