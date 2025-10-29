import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, Not, In, IsNull } from 'typeorm'; // ✅ Importar MoreThanOrEqual
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
        email: jefe.correo,
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
      console.log('📊 [JefeService] === INICIANDO getStats CON VISTAS ===');

      // ✅ Obtener datos de TODAS las vistas en paralelo
      const [statsData, dashboardData, pipelineData, topEjecutivas, topEmpresas, topClientes] = await Promise.all([
        // Vistas principales
        this.trazabilidadRepository.query('SELECT * FROM vista_dashboard_stats LIMIT 1'),
        this.trazabilidadRepository.query('SELECT * FROM vista_dashboard_ejecutiva'),
        this.trazabilidadRepository.query('SELECT * FROM vista_pipeline_ventas'),

        // ✅ NUEVAS VISTAS: Tops
        this.trazabilidadRepository.query('SELECT * FROM vista_top_ejecutivas'),
        this.trazabilidadRepository.query('SELECT * FROM vista_top_empresas'),
        this.trazabilidadRepository.query('SELECT * FROM vista_top_clientes')
      ]);

      console.log('✅ [JefeService] Vistas cargadas:', {
        stats: statsData.length,
        dashboard: dashboardData.length,
        pipeline: pipelineData.length,
        topEjecutivas: topEjecutivas.length,
        topEmpresas: topEmpresas.length,
        topClientes: topClientes.length
      });

      const vistaStats = statsData[0];

      // ✅ Construir respuesta usando las vistas
      const stats = {
        totalEmpresas: vistaStats?.total_empresas || 0,
        totalEjecutivas: vistaStats?.total_ejecutivas || 0,
        totalClientes: vistaStats?.total_clientes || 0,
        clientesEsteMes: vistaStats?.clientes_este_mes || 0,
        revenueTotal: parseFloat(vistaStats?.revenue_total) || 0,
        pipelineOportunidades: vistaStats?.pipeline_oportunidades || 0,
        dashboardEjecutivas: dashboardData,

        // ✅ NUEVO: Datos para los tops
        topEjecutivas: topEjecutivas,
        topEmpresas: topEmpresas,
        topClientes: topClientes,

        kpis: {
          tasaConversion: this.calcularTasaConversion(dashboardData),
          clientesNuevosMes: vistaStats?.clientes_este_mes || 0,
          actividadesMes: vistaStats?.actividades_mes || 0
        },
        pipeline: pipelineData
      };

      console.log('✅ [JefeService] Estadísticas completas cargadas');
      return stats;

    } catch (error) {
      console.error('❌ [JefeService] ERROR en getStats:', error);
      return await this.getStatsFallback();
    }
  }

  private async getStatsFallback() {
    console.log('🔄 [JefeService] Usando método de respaldo...');

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      totalEmpresas,
      totalEjecutivas,
      totalClientes,
      actividadesMes
    ] = await Promise.all([
      this.empresaRepository.count({ where: { estado: 'Activo' } }),
      this.ejecutivaRepository.count({ where: { estado_ejecutiva: 'Activo' } }),
      this.clienteRepository.count(),
      this.trazabilidadRepository.count({
        where: { fecha_contacto: MoreThanOrEqual(startOfMonth) }
      })
    ]);

    return {
      totalEmpresas,
      totalEjecutivas,
      totalClientes,
      clientesEsteMes: 0,
      revenueTotal: 0,
      pipelineOportunidades: 0,
      dashboardEjecutivas: [],
      kpis: {
        tasaConversion: '0%',
        clientesNuevosMes: 0,
        actividadesMes
      },
      pipeline: []
    };
  }

  // ✅ Calcular tasa de conversión
  private calcularTasaConversion(dashboardData: any[]): string {
    if (!dashboardData || !dashboardData.length) return '0%';

    try {
      const totalVentasGanadas = dashboardData.reduce((sum, item) =>
        sum + (parseInt(item.ventas_ganadas) || 0), 0
      );

      const totalClientes = dashboardData.reduce((sum, item) =>
        sum + (parseInt(item.total_clientes) || 0), 0
      );

      const tasa = totalClientes > 0
        ? ((totalVentasGanadas / totalClientes) * 100)
        : 0;

      return tasa.toFixed(1) + '%';
    } catch (error) {
      console.warn('⚠️ Error calculando tasa de conversión:', error);
      return '0%';
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

  // ========================================
  // MÉTODOS PARA GESTIÓN DE CLIENTES FINALES
  // ========================================

  /**
   * Obtener todos los clientes finales con información completa
   */
  async getClientes() {
    try {
      console.log('📋 [ClientesService] Obteniendo todos los clientes finales...');

      const clientes = await this.clienteRepository
        .createQueryBuilder('cf')
        .leftJoinAndSelect('cf.ejecutiva', 'ejecutiva')
        .leftJoinAndSelect('cf.empresaProveedora', 'empresa') // ✅ AGREGAR ESTA LÍNEA
        .leftJoin('cf.trazabilidades', 'trazabilidad')
        .select([
          'cf.id_cliente_final',
          'cf.ruc',
          'cf.razon_social',
          'cf.pagina_web',
          'cf.correo',
          'cf.telefono',
          'cf.pais',
          'cf.departamento',
          'cf.provincia',
          'cf.direccion',
          'cf.linkedin',
          'cf.grupo_economico',
          'cf.rubro',
          'cf.sub_rubro',
          'cf.tamanio_empresa',
          'cf.facturacion_anual',
          'cf.cantidad_empleados',
          'cf.logo',
          'cf.fecha_creacion',
          'cf.fecha_actualizacion',
          'cf.estado',
          'ejecutiva.id_ejecutiva',
          'ejecutiva.nombre_completo',
          'empresa.id_empresa_prov', // ✅ AGREGAR CAMPOS DE EMPRESA
          'empresa.razon_social',
          'empresa.nombre_empresa'
        ])
        .addSelect('COUNT(trazabilidad.id_trazabilidad)', 'total_actividades')
        .groupBy('cf.id_cliente_final, ejecutiva.id_ejecutiva, ejecutiva.nombre_completo, empresa.id_empresa_prov, empresa.razon_social, empresa.nombre_empresa')
        .orderBy('cf.fecha_creacion', 'DESC')
        .getRawMany();

      // Formatear respuesta para el frontend
      const clientesFormateados = clientes.map(cliente => ({
        id_cliente_final: cliente.cf_id_cliente_final,
        ruc: cliente.cf_ruc,
        razon_social: cliente.cf_razon_social,
        pagina_web: cliente.cf_pagina_web,
        correo: cliente.cf_correo,
        telefono: cliente.cf_telefono,
        pais: cliente.cf_pais,
        departamento: cliente.cf_departamento,
        provincia: cliente.cf_provincia,
        direccion: cliente.cf_direccion,
        linkedin: cliente.cf_linkedin,
        grupo_economico: cliente.cf_grupo_economico,
        rubro: cliente.cf_rubro,
        sub_rubro: cliente.cf_sub_rubro,
        tamanio_empresa: cliente.cf_tamanio_empresa,
        facturacion_anual: cliente.cf_facturacion_anual ? parseFloat(cliente.cf_facturacion_anual) : null,
        cantidad_empleados: cliente.cf_cantidad_empleados,
        logo: cliente.cf_logo,
        id_ejecutiva: cliente.ejecutiva_id_ejecutiva,
        ejecutiva_nombre: cliente.ejecutiva_nombre_completo,
        id_empresa_prov: cliente.empresa_id_empresa_prov, // ✅ AGREGAR
        empresa_nombre: cliente.empresa_razon_social || cliente.empresa_nombre_empresa, // ✅ AGREGAR
        fecha_creacion: cliente.cf_fecha_creacion,
        fecha_actualizacion: cliente.cf_fecha_actualizacion,
        total_actividades: parseInt(cliente.total_actividades) || 0,
        estado: cliente.cf_estado || 'Activo'
      }));

      console.log(`✅ [ClientesService] ${clientesFormateados.length} clientes encontrados`);
      console.log('📊 Ejemplo de cliente:', clientesFormateados[0]); // Para debug
      return clientesFormateados;

    } catch (error) {
      console.error('❌ [ClientesService] Error al obtener clientes:', error);
      throw new HttpException(
        'Error al obtener clientes finales',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getClienteById(id: number) {
    try {
      console.log(`🔍 [JefeService] Buscando cliente con ID: ${id}`);

      const cliente = await this.clienteRepository.findOne({
        where: { id_cliente_final: id },
        relations: ['ejecutiva', 'ejecutiva.empresaProveedora']
      });

      if (!cliente) {
        throw new HttpException(`Cliente con ID ${id} no encontrado`, HttpStatus.NOT_FOUND);
      }

      console.log(`✅ [JefeService] Cliente encontrado: ${cliente.razon_social}`);
      return cliente;

    } catch (error) {
      console.error('❌ [JefeService] Error al obtener cliente:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener el cliente', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createCliente(data: any) {
    try {
      console.log('➕ [JefeService] Creando nuevo cliente:', data.razon_social);

      if (!data.razon_social) {
        throw new HttpException('La razón social es obligatoria', HttpStatus.BAD_REQUEST);
      }

      if (!data.id_ejecutiva) {
        throw new HttpException('Debe asignar una ejecutiva', HttpStatus.BAD_REQUEST);
      }

      const ejecutiva = await this.ejecutivaRepository.findOne({
        where: { id_ejecutiva: data.id_ejecutiva }
      });

      if (!ejecutiva) {
        throw new HttpException('La ejecutiva seleccionada no existe', HttpStatus.BAD_REQUEST);
      }

      if (ejecutiva.estado_ejecutiva !== 'Activo') {
        throw new HttpException('La ejecutiva seleccionada no está activa', HttpStatus.BAD_REQUEST);
      }

      if (data.ruc) {
        const existeRuc = await this.clienteRepository.findOne({
          where: { ruc: data.ruc }
        });

        if (existeRuc) {
          throw new HttpException('Ya existe un cliente con ese RUC', HttpStatus.CONFLICT);
        }
      }

      const nuevoCliente = this.clienteRepository.create({
        ruc: data.ruc || null,
        razon_social: data.razon_social,
        pagina_web: data.pagina_web || null,
        correo: data.correo || null,
        telefono: data.telefono || null,
        pais: data.pais || 'Perú',
        departamento: data.departamento || null,
        provincia: data.provincia || null,
        direccion: data.direccion || null,
        linkedin: data.linkedin || null,
        grupo_economico: data.grupo_economico || null,
        rubro: data.rubro || null,
        sub_rubro: data.sub_rubro || null,
        tamanio_empresa: data.tamanio_empresa || null,
        facturacion_anual: data.facturacion_anual || null,
        cantidad_empleados: data.cantidad_empleados || null,
        logo: data.logo || null,
        ejecutiva: ejecutiva
      });

      const clienteGuardado = await this.clienteRepository.save(nuevoCliente);

      console.log(`✅ [JefeService] Cliente creado con ID: ${clienteGuardado.id_cliente_final}`);
      return await this.getClienteById(clienteGuardado.id_cliente_final);

    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('❌ [JefeService] Error al crear cliente:', error);
      throw new HttpException(
        error.message || 'Error al crear el cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateCliente(id: number, data: any) {
    try {
      console.log(`📝 [JefeService] Actualizando cliente ID: ${id}`);

      const cliente = await this.getClienteById(id);

      if (data.id_ejecutiva && data.id_ejecutiva !== cliente.ejecutiva.id_ejecutiva) {
        const ejecutiva = await this.ejecutivaRepository.findOne({
          where: { id_ejecutiva: data.id_ejecutiva }
        });

        if (!ejecutiva) {
          throw new HttpException('La ejecutiva seleccionada no existe', HttpStatus.BAD_REQUEST);
        }

        if (ejecutiva.estado_ejecutiva !== 'Activo') {
          throw new HttpException('La ejecutiva seleccionada no está activa', HttpStatus.BAD_REQUEST);
        }
      }

      if (data.ruc && data.ruc !== cliente.ruc) {
        const existeRuc = await this.clienteRepository.findOne({
          where: { ruc: data.ruc }
        });

        if (existeRuc && existeRuc.id_cliente_final !== id) {
          throw new HttpException('Ya existe un cliente con ese RUC', HttpStatus.CONFLICT);
        }
      }

      const updateData: any = { fecha_actualizacion: new Date() };

      if (data.ruc !== undefined) updateData.ruc = data.ruc;
      if (data.razon_social) updateData.razon_social = data.razon_social;
      if (data.pagina_web !== undefined) updateData.pagina_web = data.pagina_web;
      if (data.correo !== undefined) updateData.correo = data.correo;
      if (data.telefono !== undefined) updateData.telefono = data.telefono;
      if (data.pais !== undefined) updateData.pais = data.pais;
      if (data.departamento !== undefined) updateData.departamento = data.departamento;
      if (data.provincia !== undefined) updateData.provincia = data.provincia;
      if (data.direccion !== undefined) updateData.direccion = data.direccion;
      if (data.linkedin !== undefined) updateData.linkedin = data.linkedin;
      if (data.grupo_economico !== undefined) updateData.grupo_economico = data.grupo_economico;
      if (data.rubro !== undefined) updateData.rubro = data.rubro;
      if (data.sub_rubro !== undefined) updateData.sub_rubro = data.sub_rubro;
      if (data.tamanio_empresa !== undefined) updateData.tamanio_empresa = data.tamanio_empresa;
      if (data.facturacion_anual !== undefined) updateData.facturacion_anual = data.facturacion_anual;
      if (data.cantidad_empleados !== undefined) updateData.cantidad_empleados = data.cantidad_empleados;
      if (data.logo !== undefined) updateData.logo = data.logo;

      await this.clienteRepository.update(id, updateData);

      const clienteActualizado = await this.getClienteById(id);

      console.log(`✅ [JefeService] Cliente actualizado: ${clienteActualizado.razon_social}`);
      return clienteActualizado;

    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('❌ [JefeService] Error al actualizar cliente:', error);
      throw new HttpException(
        'Error al actualizar el cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteCliente(id: number) {
    try {
      console.log(`🗑️ [JefeService] Eliminando cliente ID: ${id}`);

      const cliente = await this.getClienteById(id);

      await this.clienteRepository.delete(id);

      console.log(`✅ [JefeService] Cliente eliminado: ${cliente.razon_social}`);
      return { message: 'Cliente eliminado exitosamente' };

    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('❌ [JefeService] Error al eliminar cliente:', error);
      throw new HttpException(
        'Error al eliminar el cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

}