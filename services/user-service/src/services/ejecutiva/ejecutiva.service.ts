// backend/services/user-service/src/services/ejecutiva/ejecutiva.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In, IsNull, MoreThanOrEqual } from 'typeorm';
import { Ejecutiva } from '../../../../../shared/entities/Ejecutiva.entity';
import { EmpresaProveedora } from '../../../../../shared/entities/EmpresaProveedora.entity';
import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
import { Trazabilidad } from '../../../../../shared/entities/Trazabilidad.entity';
import { PersonaContacto } from '../../../../../shared/entities/PersonaContacto.entity';

import csv from 'csv-parser';
import * as stream from 'stream';

@Injectable()
export class EjecutivaService {
  constructor(
    @InjectRepository(Ejecutiva)
    private ejecutivaRepository: Repository<Ejecutiva>,

    @InjectRepository(EmpresaProveedora)
    private empresaRepository: Repository<EmpresaProveedora>,

    @InjectRepository(ClienteFinal)
    private clienteRepository: Repository<ClienteFinal>,

    @InjectRepository(Trazabilidad)
    private trazabilidadRepository: Repository<Trazabilidad>,

    @InjectRepository(PersonaContacto)
    private contactoRepository: Repository<PersonaContacto>,
  ) { }




  async getStats(ejecutivaId: string) {
    try {
      const id = parseInt(ejecutivaId);

      // Verificar que la ejecutiva existe
      const ejecutiva = await this.ejecutivaRepository.findOne({
        where: { id_ejecutiva: id, estado_ejecutiva: 'Activo' },
        relations: ['empresa_proveedora']
      });

      if (!ejecutiva) {
        throw new HttpException('Ejecutiva no encontrada', HttpStatus.NOT_FOUND);
      }

      // Obtener estadísticas usando TypeORM
      const totalClientes = await this.clienteRepository.count({
        where: { ejecutiva: { id_ejecutiva: id } }
      });

      const actividadesMes = await this.trazabilidadRepository.count({
        where: {
          ejecutiva: { id_ejecutiva: id },
          fecha_contacto: MoreThanOrEqual(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
        }
      });

      // Revenue de ventas ganadas
      const revenueResult = await this.trazabilidadRepository
        .createQueryBuilder('t')
        .select('COALESCE(SUM(t.monto_cierre_final), 0)', 'revenue')
        .where('t.id_ejecutiva = :id', { id })
        .andWhere('t.etapa_oportunidad = :etapa', { etapa: 'Venta ganada' })
        .getRawOne();

      // Oportunidades en pipeline
      const pipelineCount = await this.trazabilidadRepository.count({
        where: {
          ejecutiva: { id_ejecutiva: id },
          etapa_oportunidad: Not(In(['Venta ganada', 'Venta perdida', 'Venta suspendida'])),
          nombre_oportunidad: Not(IsNull())
        }
      });

      return {
        totalEmpresas: ejecutiva.empresa_proveedora ? 1 : 0,
        totalClientes,
        actividadesMes,
        pipelineCount,
        revenueGenerado: parseFloat(revenueResult.revenue),
        empresaAsignada: ejecutiva.empresa_proveedora ? true : false
      };
    } catch (error) {
      console.error('Error en getStats:', error);
      throw new HttpException('Error al obtener estadísticas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getEmpresas(ejecutivaId: string) {
    try {
      const id = parseInt(ejecutivaId);

      const ejecutiva = await this.ejecutivaRepository.findOne({
        where: { id_ejecutiva: id },
        relations: ['empresa_proveedora']
      });

      if (!ejecutiva || !ejecutiva.empresa_proveedora) {
        return [];
      }

      // Contar clientes de esta ejecutiva
      const totalClientes = await this.clienteRepository.count({
        where: { ejecutiva: { id_ejecutiva: id } }
      });

      // Retornar empresa con estadísticas
      return [{
        ...ejecutiva.empresa_proveedora,
        total_clientes: totalClientes
      }];
    } catch (error) {
      console.error('Error en getEmpresas:', error);
      throw new HttpException('Error al obtener empresas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ CORREGIDO: Registro de empresa (estado PENDIENTE)
  async createEmpresa(data: {
    razon_social: string;
    ruc: string;
    direccion: string;
    telefono: string;
    correo: string;
    ejecutivaId: string;
    contraseña: string;
    // ✅ AGREGAR TODOS LOS CAMPOS QUE ENVÍA EL FRONTEND
    pagina_web?: string;
    pais?: string;
    departamento?: string;
    provincia?: string;
    linkedin?: string;
    grupo_economico?: string;
    rubro?: string;
    sub_rubro?: string;
    tamanio_empresa?: string;
    facturacion_anual?: string;
    cantidad_empleados?: string;
  }) {
    const id = parseInt(data.ejecutivaId);

    // Verificar que la ejecutiva existe
    const ejecutiva = await this.ejecutivaRepository.findOne({
      where: { id_ejecutiva: id, estado_ejecutiva: 'Activo' }
    });

    if (!ejecutiva) {
      throw new HttpException('Ejecutiva no encontrada', HttpStatus.NOT_FOUND);
    }

    // Verificar RUC único
    const existingRuc = await this.empresaRepository.findOne({
      where: { ruc: data.ruc }
    });

    if (existingRuc) {
      throw new HttpException('Ya existe una empresa con este RUC', HttpStatus.BAD_REQUEST);
    }

    // ✅ CORREGIDO: Crear empresa con TODOS los campos
    const nuevaEmpresa = this.empresaRepository.create({
      ruc: data.ruc,
      razon_social: data.razon_social,
      pagina_web: data.pagina_web,
      correo: data.correo,
      contraseña: data.contraseña, // ✅ Usar la contraseña que viene del frontend
      telefono: data.telefono,
      pais: data.pais || 'Perú',
      departamento: data.departamento,
      provincia: data.provincia,
      direccion: data.direccion,
      linkedin: data.linkedin,
      grupo_economico: data.grupo_economico,
      rubro: data.rubro,
      sub_rubro: data.sub_rubro,
      tamanio_empresa: data.tamanio_empresa,
      facturacion_anual: data.facturacion_anual ? parseFloat(data.facturacion_anual) : null,
      cantidad_empleados: data.cantidad_empleados ? parseInt(data.cantidad_empleados) : null,
      estado: 'Inactivo', // ✅ Estado inicial INACTIVO
      id_ejecutiva_registro: id
    });

    console.log('📝 Creando empresa en BD:', nuevaEmpresa); // ✅ DEBUG

    try {
      const empresaGuardada = await this.empresaRepository.save(nuevaEmpresa);
      console.log('✅ Empresa guardada en BD:', empresaGuardada); // ✅ DEBUG
      return empresaGuardada;
    } catch (error) {
      console.error('❌ Error al guardar empresa:', error);
      throw new HttpException('Error al guardar empresa en la base de datos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // ✅ CORREGIDO: Obtener empresas registradas por la ejecutiva (basado en la BD real)
  async getEmpresasRegistradas(ejecutivaId: string) {
    try {
      const id = parseInt(ejecutivaId);

      // Obtener empresas registradas por esta ejecutiva
      const empresas = await this.empresaRepository.find({
        where: { id_ejecutiva_registro: id },
        order: { fecha_creacion: 'DESC' }
      });

      // Para cada empresa, verificar si la ejecutiva está asignada
      const empresasConInfo = await Promise.all(
        empresas.map(async (empresa) => {
          // Verificar si esta ejecutiva está asignada a la empresa
          const ejecutivaAsignada = await this.ejecutivaRepository.findOne({
            where: {
              id_ejecutiva: id,
              empresa_proveedora: { id_empresa_prov: empresa.id_empresa_prov }
            }
          });

          const esta_asignada = !!ejecutivaAsignada;
          const puede_crear_clientes = empresa.estado === 'Activo' && esta_asignada;

          return {
            id_empresa_prov: empresa.id_empresa_prov,
            ruc: empresa.ruc,
            razon_social: empresa.razon_social,
            correo: empresa.correo,
            telefono: empresa.telefono,
            estado: empresa.estado,
            fecha_creacion: empresa.fecha_creacion,
            esta_asignada,
            puede_crear_clientes
          };
        })
      );

      return empresasConInfo;
    } catch (error) {
      console.error('Error en getEmpresasRegistradas:', error);
      throw new HttpException('Error al obtener empresas registradas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getClientes(ejecutivaId: string) {
    try {
      const id = parseInt(ejecutivaId);

      const clientes = await this.clienteRepository.find({
        where: { ejecutiva: { id_ejecutiva: id } },
        relations: ['personas_contacto', 'empresa_proveedora'],
        order: { razon_social: 'ASC' }
      });

      // Enriquecer con estadísticas de trazabilidad
      const clientesConStats = await Promise.all(
        clientes.map(async (cliente) => {
          const totalActividades = await this.trazabilidadRepository.count({
            where: { cliente_final: { id_cliente_final: cliente.id_cliente_final } }
          });

          // Obtener última actividad
          const ultimaActividad = await this.trazabilidadRepository.findOne({
            where: { cliente_final: { id_cliente_final: cliente.id_cliente_final } },
            order: { fecha_contacto: 'DESC' },
            relations: ['persona_contacto']
          });

          return {
            ...cliente,
            total_actividades: totalActividades,
            contacto_principal: cliente.personas_contacto?.[0] || null,
            ultima_actividad: ultimaActividad ? {
              fecha: ultimaActividad.fecha_contacto,
              tipo: ultimaActividad.tipo_contacto,
              resultado: ultimaActividad.resultado_contacto,
              persona_contacto: ultimaActividad.persona_contacto ? {
                id: ultimaActividad.persona_contacto.id_contacto,
                nombre_completo: ultimaActividad.persona_contacto.nombre_completo,
                email: ultimaActividad.persona_contacto.correo,
                telefono: ultimaActividad.persona_contacto.telefono
              } : null
            } : null
          };
        })
      );

      return clientesConStats;
    } catch (error) {
      console.error('Error en getClientes:', error);
      throw new HttpException('Error al obtener clientes', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ CORREGIDO: Crear cliente final (con validación de empresa-ejecutiva)

  async createCliente(data: {
    razon_social: string;
    ruc: string;
    direccion: string;
    telefono: string;
    correo: string;
    ejecutivaId: string;
    // ✅ AGREGAR TODOS LOS CAMPOS ADICIONALES
    pagina_web?: string;
    pais?: string;
    departamento?: string;
    provincia?: string;
    linkedin?: string;
    grupo_economico?: string;
    rubro?: string;
    sub_rubro?: string;
    tamanio_empresa?: string;
    facturacion_anual?: string;
    cantidad_empleados?: string;
  }) {
    try {
      const idEjecutiva = parseInt(data.ejecutivaId);

      // Verificar que la ejecutiva existe y tiene empresa asignada
      const ejecutiva = await this.ejecutivaRepository.findOne({
        where: {
          id_ejecutiva: idEjecutiva,
          estado_ejecutiva: 'Activo'
        },
        relations: ['empresa_proveedora']
      });

      if (!ejecutiva) {
        throw new HttpException('Ejecutiva no encontrada', HttpStatus.NOT_FOUND);
      }

      if (!ejecutiva.empresa_proveedora) {
        throw new HttpException('La ejecutiva no tiene empresa asignada', HttpStatus.BAD_REQUEST);
      }

      // ✅ CORREGIDO: Verificar RUC único para esta empresa proveedora
      const existingCliente = await this.clienteRepository.findOne({
        where: {
          ruc: data.ruc,
          empresa_proveedora: { id_empresa_prov: ejecutiva.empresa_proveedora.id_empresa_prov }
        }
      });

      if (existingCliente) {
        throw new HttpException('Ya existe un cliente con este RUC para esta empresa', HttpStatus.BAD_REQUEST);
      }

      // ✅ ACTUALIZADO: Crear cliente con TODOS los campos
      const nuevoCliente = this.clienteRepository.create({
        ruc: data.ruc,
        razon_social: data.razon_social,
        pagina_web: data.pagina_web,
        correo: data.correo,
        telefono: data.telefono,
        pais: data.pais || 'Perú',
        departamento: data.departamento,
        provincia: data.provincia,
        direccion: data.direccion,
        linkedin: data.linkedin,
        grupo_economico: data.grupo_economico,
        rubro: data.rubro,
        sub_rubro: data.sub_rubro,
        tamanio_empresa: data.tamanio_empresa,
        facturacion_anual: data.facturacion_anual ? parseFloat(data.facturacion_anual) : null,
        cantidad_empleados: data.cantidad_empleados ? parseInt(data.cantidad_empleados) : null,
        ejecutiva: ejecutiva,
        empresa_proveedora: ejecutiva.empresa_proveedora
      });

      console.log('📝 Creando cliente en BD:', nuevoCliente); // ✅ DEBUG

      return await this.clienteRepository.save(nuevoCliente);
    } catch (error) {
      console.error('Error en createCliente:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al crear cliente', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createPersonaContacto(data: {
    nombre_completo: string;
    cargo: string;
    correo: string;
    telefono: string;
    id_cliente_final: string;
    ejecutivaId: string;
    // ✅ AGREGAR CAMPOS ADICIONALES
    dni?: string;
    linkedin?: string;
  }) {
    try {
      const idEjecutiva = parseInt(data.ejecutivaId);
      const idCliente = parseInt(data.id_cliente_final);

      // Verificar que el cliente pertenece a la ejecutiva
      const cliente = await this.clienteRepository.findOne({
        where: {
          id_cliente_final: idCliente,
          ejecutiva: { id_ejecutiva: idEjecutiva }
        }
      });

      if (!cliente) {
        throw new HttpException('Cliente no encontrado o no autorizado', HttpStatus.NOT_FOUND);
      }

      // ✅ ACTUALIZADO: Crear contacto con TODOS los campos
      const nuevoContacto = this.contactoRepository.create({
        dni: data.dni,
        nombre_completo: data.nombre_completo,
        cargo: data.cargo,
        correo: data.correo,
        telefono: data.telefono,
        linkedin: data.linkedin,
        cliente_final: cliente
      });

      console.log('📝 Creando contacto en BD:', nuevoContacto); // ✅ DEBUG

      return await this.contactoRepository.save(nuevoContacto);
    } catch (error) {
      console.error('Error en createPersonaContacto:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al crear contacto', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ NUEVO: Obtener contactos de un cliente
  async getContactosCliente(clienteId: string, ejecutivaId: string) {
    try {
      const idCliente = parseInt(clienteId);
      const idEjecutiva = parseInt(ejecutivaId);

      // Verificar permisos
      const cliente = await this.clienteRepository.findOne({
        where: {
          id_cliente_final: idCliente,
          ejecutiva: { id_ejecutiva: idEjecutiva }
        }
      });

      if (!cliente) {
        throw new HttpException('Cliente no encontrado', HttpStatus.NOT_FOUND);
      }

      return await this.contactoRepository.find({
        where: { cliente_final: { id_cliente_final: idCliente } },
        order: { nombre_completo: 'ASC' }
      });
    } catch (error) {
      console.error('Error en getContactosCliente:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener contactos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ MÉTODO: Obtener pipeline de ventas
  async getPipeline(ejecutivaId: string) {
    try {
      const id = parseInt(ejecutivaId);

      const pipeline = await this.trazabilidadRepository.find({
        where: {
          ejecutiva: { id_ejecutiva: id },
          etapa_oportunidad: Not(In(['Venta ganada', 'Venta perdida', 'Venta suspendida'])),
          nombre_oportunidad: Not(IsNull())
        },
        relations: ['cliente_final', 'persona_contacto', 'empresa_proveedora'],
        order: { fecha_cierre_esperado: 'ASC' }
      });

      // Agrupar por etapa para el dashboard
      const pipelinePorEtapa = pipeline.reduce((acc, oportunidad) => {
        const etapa = oportunidad.etapa_oportunidad || 'Sin etapa';
        if (!acc[etapa]) {
          acc[etapa] = [];
        }
        acc[etapa].push(oportunidad);
        return acc;
      }, {});

      // Calcular totales
      const totalMontoPipeline = pipeline.reduce((sum, op) => sum + (op.monto_total_sin_imp || 0), 0);
      const totalOportunidades = pipeline.length;

      return {
        oportunidades: pipeline,
        agrupado_por_etapa: pipelinePorEtapa,
        metricas: {
          total_oportunidades: totalOportunidades,
          total_monto_pipeline: totalMontoPipeline,
          promedio_probabilidad: pipeline.length > 0
            ? pipeline.reduce((sum, op) => sum + (op.probabilidad_cierre || 0), 0) / pipeline.length
            : 0
        }
      };
    } catch (error) {
      console.error('Error en getPipeline:', error);
      throw new HttpException('Error al obtener pipeline', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ MÉTODO: Obtener actividades recientes
  async getActividadesRecientes(ejecutivaId: string, limit: number = 10) {
    try {
      const id = parseInt(ejecutivaId);

      const actividades = await this.trazabilidadRepository.find({
        where: {
          ejecutiva: { id_ejecutiva: id }
        },
        relations: ['cliente_final', 'persona_contacto', 'empresa_proveedora'],
        order: { fecha_contacto: 'DESC' },
        take: limit
      });

      return actividades.map(actividad => ({
        id: actividad.id_trazabilidad,
        fecha: actividad.fecha_contacto,
        tipo_contacto: actividad.tipo_contacto,
        resultado: actividad.resultado_contacto,
        cliente: actividad.cliente_final?.razon_social,
        persona_contacto: actividad.persona_contacto ? {
          id: actividad.persona_contacto.id_contacto,
          nombre_completo: actividad.persona_contacto.nombre_completo,
          email: actividad.persona_contacto?.correo || null,
          telefono: actividad.persona_contacto?.telefono || null
        } : null,
        oportunidad: actividad.nombre_oportunidad,
        etapa: actividad.etapa_oportunidad,
        observaciones: actividad.observaciones
          ? actividad.observaciones.substring(0, 100) + (actividad.observaciones.length > 100 ? '...' : '')
          : null
      }));
    } catch (error) {
      console.error('Error en getActividadesRecientes:', error);
      throw new HttpException('Error al obtener actividades', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ MÉTODO: Obtener KPIs semanales para la ejecutiva
  async getKPIsSemanales(ejecutivaId: string) {
    try {
      const id = parseInt(ejecutivaId);

      const inicioSemana = new Date();
      inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay()); // Domingo de esta semana

      const actividadesSemana = await this.trazabilidadRepository.count({
        where: {
          ejecutiva: { id_ejecutiva: id },
          fecha_contacto: MoreThanOrEqual(inicioSemana)
        }
      });

      const nuevasOportunidades = await this.trazabilidadRepository.count({
        where: {
          ejecutiva: { id_ejecutiva: id },
          fecha_registro_oportunidad: MoreThanOrEqual(inicioSemana),
          nombre_oportunidad: Not(IsNull())
        }
      });

      const reunionesAgendadas = await this.trazabilidadRepository.count({
        where: {
          ejecutiva: { id_ejecutiva: id },
          reunion_agendada: true,
          fecha_reunion: MoreThanOrEqual(inicioSemana)
        }
      });

      return {
        actividades_semana: actividadesSemana,
        nuevas_oportunidades: nuevasOportunidades,
        reuniones_agendadas: reunionesAgendadas,
        inicio_semana: inicioSemana
      };
    } catch (error) {
      console.error('Error en getKPIsSemanales:', error);
      throw new HttpException('Error al obtener KPIs semanales', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  /**
   * ✅ CORREGIDO: Procesar archivo CSV para crear clientes en lote
   */
  async bulkCreateClientes(file: any, ejecutivaId: string) {
    try {
      const idEjecutiva = parseInt(ejecutivaId);

      // 1. Verificar ejecutiva y empresa
      const ejecutiva = await this.ejecutivaRepository.findOne({
        where: {
          id_ejecutiva: idEjecutiva,
          estado_ejecutiva: 'Activo'
        },
        relations: ['empresa_proveedora']
      });

      if (!ejecutiva) {
        throw new HttpException('Ejecutiva no encontrada', HttpStatus.NOT_FOUND);
      }

      if (!ejecutiva.empresa_proveedora) {
        throw new HttpException('La ejecutiva no tiene empresa asignada', HttpStatus.BAD_REQUEST);
      }

      // 2. Parsear el archivo CSV
      const clientesData = await this.parseCSVFile(file);

      if (clientesData.length === 0) {
        throw new HttpException('El archivo está vacío o no contiene datos válidos', HttpStatus.BAD_REQUEST);
      }

      // 3. Validar datos básicos del CSV
      const clientesValidos = this.validarClientesCSV(clientesData);

      if (clientesValidos.length === 0) {
        throw new HttpException('No se encontraron registros válidos en el archivo', HttpStatus.BAD_REQUEST);
      }

      // 4. Verificar RUCs duplicados
      const clientesSinDuplicados = await this.filtrarRUCsDuplicados(
        clientesValidos,
        ejecutiva.empresa_proveedora.id_empresa_prov
      );

      // 5. Crear clientes en lote
      const clientesCreados = await this.crearClientesEnLote(
        clientesSinDuplicados,
        ejecutiva
      );

      return {
        total: clientesData.length,
        creados: clientesCreados.length,
        duplicados_en_archivo: clientesValidos.length - clientesSinDuplicados.length,
        invalidos: clientesData.length - clientesValidos.length,
        resumen: {
          exitosos: clientesCreados.length,
          con_errores: (clientesData.length - clientesCreados.length)
        }
      };

    } catch (error) {
      console.error('Error en bulkCreateClientes:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al procesar archivo de clientes', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * ✅ CORREGIDO: Parsear archivo CSV
   */
private async parseCSVFile(file: any): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    
    try {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);

      bufferStream
        .pipe(csv())
        .on('data', (data: any) => {
          try {
            // Limpieza manual de datos
            const cleanData: any = {};
            
            for (const [key, value] of Object.entries(data)) {
              const cleanKey = key.toString().trim().toLowerCase();
              const cleanValue = value ? value.toString().trim() : '';
              cleanData[cleanKey] = cleanValue;
            }
            
            // Verificar que tenga datos esenciales
            if (cleanData.razon_social && cleanData.ruc) {
              results.push(cleanData);
            }
          } catch (rowError) {
            console.warn('Error procesando fila CSV:', rowError);
            // Continuar con las siguientes filas
          }
        })
        .on('end', () => {
          console.log(`✅ CSV parseado: ${results.length} registros válidos`);
          resolve(results);
        })
        .on('error', (error: any) => {
          reject(new HttpException(`Error al leer el archivo CSV: ${error.message}`, HttpStatus.BAD_REQUEST));
        });
        
    } catch (error) {
      reject(new HttpException('Error al procesar archivo CSV', HttpStatus.BAD_REQUEST));
    }
  });
}

  /**
   * ✅ Validar datos básicos del CSV
   */
  private validarClientesCSV(clientesData: any[]): any[] {
    return clientesData.filter(cliente => {
      // Campos obligatorios según tu createCliente
      const tieneCamposObligatorios =
        cliente.razon_social &&
        cliente.ruc &&
        cliente.direccion &&
        cliente.telefono &&
        cliente.correo;

      // Validar formato básico de RUC (opcional, pero recomendado)
      const rucValido = this.validarFormatoRUC(cliente.ruc);

      return tieneCamposObligatorios && rucValido;
    });
  }

  /**
   * ✅ Validación básica de formato RUC peruano
   */
  private validarFormatoRUC(ruc: string): boolean {
    if (!ruc) return false;

    // RUC peruano: 11 dígitos
    const rucRegex = /^[0-9]{11}$/;
    return rucRegex.test(ruc.replace(/\D/g, '')); // Remover caracteres no numéricos
  }

  /**
   * ✅ Filtrar RUCs duplicados (en archivo y BD)
   */
  private async filtrarRUCsDuplicados(clientesData: any[], idEmpresaProv: number): Promise<any[]> {
    const rucs = clientesData.map(c => c.ruc);

    // Buscar duplicados en el archivo
    const rucsEnArchivo = new Set();
    const clientesSinDuplicadosEnArchivo = clientesData.filter(cliente => {
      if (rucsEnArchivo.has(cliente.ruc)) {
        return false; // Es duplicado en el archivo
      }
      rucsEnArchivo.add(cliente.ruc);
      return true;
    });

    // Buscar RUCs existentes en la BD
    const existentes = await this.clienteRepository.find({
      where: {
        ruc: In(rucs),
        empresa_proveedora: { id_empresa_prov: idEmpresaProv }
      },
      select: ['ruc']
    });

    const rucsExistentes = new Set(existentes.map(c => c.ruc));

    return clientesSinDuplicadosEnArchivo.filter(cliente => !rucsExistentes.has(cliente.ruc));
  }

  /**
   * ✅ Crear clientes en lote
   */
  private async crearClientesEnLote(clientesData: any[], ejecutiva: Ejecutiva): Promise<ClienteFinal[]> {
    const clientesACrear = clientesData.map(clienteData => {
      return this.clienteRepository.create({
        ruc: clienteData.ruc,
        razon_social: clienteData.razon_social,
        pagina_web: clienteData.pagina_web || null,
        correo: clienteData.correo,
        telefono: clienteData.telefono,
        pais: clienteData.pais || 'Perú',
        departamento: clienteData.departamento || null,
        provincia: clienteData.provincia || null,
        direccion: clienteData.direccion,
        linkedin: clienteData.linkedin || null,
        grupo_economico: clienteData.grupo_economico || null,
        rubro: clienteData.rubro || null,
        sub_rubro: clienteData.sub_rubro || null,
        tamanio_empresa: clienteData.tamanio_empresa || null,
        facturacion_anual: clienteData.facturacion_anual ?
          parseFloat(clienteData.facturacion_anual) : null,
        cantidad_empleados: clienteData.cantidad_empleados ?
          parseInt(clienteData.cantidad_empleados) : null,
        ejecutiva: ejecutiva,
        empresa_proveedora: ejecutiva.empresa_proveedora
      });
    });

    // Guardar en lote
    return await this.clienteRepository.save(clientesACrear);
  }

  /**
   * ✅ NUEVO: Descargar plantilla CSV
   */
  async downloadPlantillaClientes(): Promise<{ csv: string; filename: string }> {
    const headers = [
      'razon_social',
      'ruc',
      'direccion',
      'telefono',
      'correo',
      'pagina_web',
      'pais',
      'departamento',
      'provincia',
      'linkedin',
      'grupo_economico',
      'rubro',
      'sub_rubro',
      'tamanio_empresa',
      'facturacion_anual',
      'cantidad_empleados'
    ];

    const ejemplos = [
      {
        razon_social: 'Ejemplo SAC',
        ruc: '20123456789',
        direccion: 'Av. Ejemplo 123',
        telefono: '+51 987 654 321',
        correo: 'contacto@ejemplo.com',
        pagina_web: 'https://ejemplo.com',
        pais: 'Perú',
        departamento: 'Lima',
        provincia: 'Lima',
        linkedin: 'https://linkedin.com/company/ejemplo',
        grupo_economico: 'Grupo Ejemplo',
        rubro: 'Tecnología',
        sub_rubro: 'Desarrollo Software',
        tamanio_empresa: 'Mediana',
        facturacion_anual: '500000.00',
        cantidad_empleados: '50'
      }
    ];

    let csvContent = headers.join(',') + '\n';

    ejemplos.forEach(ejemplo => {
      const row = headers.map(header => `"${ejemplo[header] || ''}"`).join(',');
      csvContent += row + '\n';
    });

    return {
      csv: csvContent,
      filename: `plantilla_clientes_${new Date().toISOString().split('T')[0]}.csv`
    };
  }



}