// backend/services/user-service/src/services/ejecutiva/ejecutiva.service.ts - CORREGIDO
// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { sql, pool } from '../../../../../shared/utils/database'; // ✅ Usar tu patrón existente

// @Injectable()
// export class EjecutivaService {
  
//   async getStats(ejecutivaId: string) {
//     try {
//       // Total de empresas asignadas
//       const empresasResult = await sql.query(
//         `SELECT COUNT(*) as total 
//          FROM public.empresa_ejecutiva ee
//          WHERE ee.id_ejecutiva = $1 AND ee.activo = true`,
//         [ejecutivaId]
//       );

//       // Total de clientes
//       const clientesResult = await sql.query(
//         `SELECT COUNT(*) as total 
//          FROM public.cliente_empresa ce
//          WHERE ce.id_ejecutiva = $1 AND ce.estado = 'activo'`,
//         [ejecutivaId]
//       );

//       // Actividades del mes
//       const actividadesResult = await sql.query(
//         `SELECT COUNT(*) as total 
//          FROM public.trazabilidad t
//          WHERE t.id_ejecutiva = $1
//            AND t.fecha_actividad >= DATE_TRUNC('month', CURRENT_DATE)`,
//         [ejecutivaId]
//       );

//       return {
//         totalEmpresas: Number(empresasResult.rows[0].total),
//         totalClientes: Number(clientesResult.rows[0].total),
//         actividadesMes: Number(actividadesResult.rows[0].total),
//       };
//     } catch (error) {
//       throw new HttpException('Error al obtener estadísticas', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getEmpresas(ejecutivaId: string) {
//     try {
//       const result = await sql.query(
//         `
//         SELECT 
//           ep.*,
//           COUNT(DISTINCT ce.id_cliente) as total_clientes
//         FROM public.empresa_proveedora ep
//         INNER JOIN public.empresa_ejecutiva ee ON ep.id_empresa = ee.id_empresa
//         LEFT JOIN public.cliente_empresa ce ON ep.id_empresa = ce.id_empresa
//         WHERE ee.id_ejecutiva = $1 AND ee.activo = true AND ep.activo = true
//         GROUP BY ep.id_empresa
//         ORDER BY ep.nombre_empresa
//         `,
//         [ejecutivaId]
//       );

//       return result.rows;
//     } catch (error) {
//       throw new HttpException('Error al obtener empresas', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async createEmpresa(data: {
//     nombre_empresa: string;
//     rut: string;
//     direccion: string;
//     telefono: string;
//     email_contacto: string;
//     ejecutivaId: string;
//   }) {
//     await sql.query("BEGIN");

//     try {
//       // Crear empresa
//       const empresaResult = await sql.query(
//         `
//         INSERT INTO public.empresa_proveedora 
//           (nombre_empresa, rut, direccion, telefono, email_contacto, activo)
//         VALUES ($1, $2, $3, $4, $5, true)
//         RETURNING *
//         `,
//         [data.nombre_empresa, data.rut, data.direccion, data.telefono, data.email_contacto]
//       );

//       const empresa = empresaResult.rows[0];

//       // Asignar ejecutiva a la empresa
//       await sql.query(
//         `
//         INSERT INTO public.empresa_ejecutiva (id_empresa, id_ejecutiva, activo)
//         VALUES ($1, $2, true)
//         `,
//         [empresa.id_empresa, data.ejecutivaId]
//       );

//       await sql.query("COMMIT");
//       return empresa;
//     } catch (error) {
//       await sql.query("ROLLBACK");
//       throw new HttpException('Error al crear empresa', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getClientes(ejecutivaId: string) {
//     try {
//       const result = await sql.query(
//         `
//         SELECT 
//           ce.*,
//           ep.nombre_empresa,
//           COUNT(t.id_trazabilidad) as total_actividades
//         FROM public.cliente_empresa ce
//         JOIN public.empresa_proveedora ep ON ce.id_empresa = ep.id_empresa
//         LEFT JOIN public.trazabilidad t ON ce.id_cliente = t.id_cliente
//         WHERE ce.id_ejecutiva = $1 AND ce.estado = 'activo'
//         GROUP BY ce.id_cliente, ep.nombre_empresa
//         ORDER BY ce.nombre_cliente
//         `,
//         [ejecutivaId]
//       );

//       return result.rows;
//     } catch (error) {
//       throw new HttpException('Error al obtener clientes', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async createCliente(data: {
//     id_empresa: string;
//     id_ejecutiva: string;
//     nombre_cliente: string;
//     rut_cliente: string;
//     direccion: string;
//     telefono: string;
//     email: string;
//   }) {
//     await sql.query("BEGIN");

//     try {
//       // Verificar que la empresa está asignada a esta ejecutiva
//       const empresaCheckResult = await sql.query(
//         `
//         SELECT ee.* FROM public.empresa_ejecutiva ee
//         WHERE ee.id_empresa = $1 AND ee.id_ejecutiva = $2 AND ee.activo = true
//         `,
//         [data.id_empresa, data.id_ejecutiva]
//       );

//       if (empresaCheckResult.rows.length === 0) {
//         throw new HttpException('Empresa no asignada a esta ejecutiva', HttpStatus.FORBIDDEN);
//       }

//       // Crear usuario cliente
//       const nombres = data.nombre_cliente.split(' ');
//       const usuarioResult = await sql.query(
//         `
//         INSERT INTO public.usuarios (nombre, apellido, email, password_hash, rol, activo)
//         VALUES ($1, $2, $3, $4, 'cliente', true)
//         RETURNING id_usuario
//         `,
//         [
//           nombres[0],
//           nombres.slice(1).join(' ') || 'Cliente',
//           data.email,
//           '$2a$10$rZ8qNqZ7YxEZQXW5vXqZ7eK5vXqZ7eK5vXqZ7eK5vXqZ7eK5vXqZ7', // hash demo
//         ]
//       );

//       const idUsuarioCliente = usuarioResult.rows[0].id_usuario;

//       // Crear cliente empresa
//       const clienteResult = await sql.query(
//         `
//         INSERT INTO public.cliente_empresa (
//           id_empresa, id_ejecutiva, id_usuario_cliente,
//           nombre_cliente, rut_cliente, direccion, telefono, email, estado
//         )
//         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'activo')
//         RETURNING *
//         `,
//         [
//           data.id_empresa,
//           data.id_ejecutiva,
//           idUsuarioCliente,
//           data.nombre_cliente,
//           data.rut_cliente,
//           data.direccion,
//           data.telefono,
//           data.email,
//         ]
//       );

//       await sql.query("COMMIT");
//       return clienteResult.rows[0];
//     } catch (error) {
//       await sql.query("ROLLBACK");
//       if (error instanceof HttpException) throw error;
//       throw new HttpException('Error al crear cliente', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }
// }

// backend/services/user-service/src/services/ejecutiva/ejecutiva.service.ts - COMPLETADO
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { Ejecutiva } from '../../../../../shared/entities/Ejecutiva.entity';
import { EmpresaProveedora } from '../../../../../shared/entities/EmpresaProveedora.entity';
import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
import { Trazabilidad } from '../../../../../shared/entities/Trazabilidad.entity';
import { PersonaContacto } from '../../../../../shared/entities/PersonaContacto.entity';

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
  ) {}

  async getStats(ejecutivaId: string) {
    try {
      const id = parseInt(ejecutivaId);
      
      // Verificar que la ejecutiva existe
      const ejecutiva = await this.ejecutivaRepository.findOne({
        where: { id_ejecutiva: id, estado_ejecutiva: 'Activo' }
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

  async createEmpresa(data: {
    razon_social: string;
    ruc: string;
    direccion: string;
    telefono: string;
    correo: string;
    ejecutivaId: string;
  }) {
    const id = parseInt(data.ejecutivaId);
    
    // Verificar que la ejecutiva existe y no tiene empresa
    const ejecutiva = await this.ejecutivaRepository.findOne({
      where: { id_ejecutiva: id, estado_ejecutiva: 'Activo' }
    });

    if (!ejecutiva) {
      throw new HttpException('Ejecutiva no encontrada', HttpStatus.NOT_FOUND);
    }

    if (ejecutiva.empresa_proveedora) {
      throw new HttpException('La ejecutiva ya tiene una empresa asignada', HttpStatus.BAD_REQUEST);
    }

    // Verificar RUC único
    const existingRuc = await this.empresaRepository.findOne({
      where: { ruc: data.ruc }
    });

    if (existingRuc) {
      throw new HttpException('Ya existe una empresa con este RUC', HttpStatus.BAD_REQUEST);
    }

    // Crear empresa
    const nuevaEmpresa = this.empresaRepository.create({
      ruc: data.ruc,
      razon_social: data.razon_social,
      direccion: data.direccion,
      telefono: data.telefono,
      correo: data.correo,
      contraseña: 'temp_password_123',
      estado: 'Activo'
    });

    const empresaGuardada = await this.empresaRepository.save(nuevaEmpresa);

    // Asignar empresa a ejecutiva
    ejecutiva.empresa_proveedora = empresaGuardada;
    await this.ejecutivaRepository.save(ejecutiva);

    return empresaGuardada;
  }

  async getClientes(ejecutivaId: string) {
    try {
      const id = parseInt(ejecutivaId);
      
      const clientes = await this.clienteRepository.find({
        where: { ejecutiva: { id_ejecutiva: id } },
        relations: ['personas_contacto'],
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
            relations: ['contacto']
          });

          return {
            ...cliente,
            total_actividades: totalActividades,
            contacto_principal: cliente.personas_contacto?.[0] || null,
            ultima_actividad: ultimaActividad ? {
              fecha: ultimaActividad.fecha_contacto,
              tipo: ultimaActividad.tipo_contacto,
              resultado: ultimaActividad.resultado_contacto,
              contacto: ultimaActividad.contacto?.nombre_completo
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

  async createCliente(data: {
    id_empresa: string;
    id_ejecutiva: string;
    razon_social: string;
    ruc: string;
    direccion: string;
    telefono: string;
    correo: string;
  }) {
    const idEjecutiva = parseInt(data.id_ejecutiva);
    const idEmpresa = parseInt(data.id_empresa);

    // Verificar que la ejecutiva existe y tiene esta empresa asignada
    const ejecutiva = await this.ejecutivaRepository.findOne({
      where: { 
        id_ejecutiva: idEjecutiva,
        empresa_proveedora: { id_empresa_prov: idEmpresa }
      },
      relations: ['empresa_proveedora']
    });

    if (!ejecutiva) {
      throw new HttpException('Empresa no asignada a esta ejecutiva', HttpStatus.FORBIDDEN);
    }

    // Verificar RUC único
    const existingRuc = await this.clienteRepository.findOne({
      where: { ruc: data.ruc }
    });

    if (existingRuc) {
      throw new HttpException('Ya existe un cliente con este RUC', HttpStatus.BAD_REQUEST);
    }

    // Crear cliente final
    const nuevoCliente = this.clienteRepository.create({
      ruc: data.ruc,
      razon_social: data.razon_social,
      direccion: data.direccion,
      telefono: data.telefono,
      correo: data.correo,
      ejecutiva: ejecutiva
    });

    return await this.clienteRepository.save(nuevoCliente);
  }

  // ✅ NUEVO MÉTODO: Obtener pipeline de ventas
  async getPipeline(ejecutivaId: string) {
    try {
      const id = parseInt(ejecutivaId);

      const pipeline = await this.trazabilidadRepository.find({
        where: {
          ejecutiva: { id_ejecutiva: id },
          etapa_oportunidad: Not(In(['Venta ganada', 'Venta perdida', 'Venta suspendida'])),
          nombre_oportunidad: Not(IsNull())
        },
        relations: ['cliente_final', 'contacto', 'empresa_proveedora'],
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

  // ✅ NUEVO MÉTODO: Obtener actividades recientes
  async getActividadesRecientes(ejecutivaId: string, limit: number = 10) {
    try {
      const id = parseInt(ejecutivaId);

      const actividades = await this.trazabilidadRepository.find({
        where: {
          ejecutiva: { id_ejecutiva: id }
        },
        relations: ['cliente_final', 'contacto', 'empresa_proveedora'],
        order: { fecha_contacto: 'DESC' },
        take: limit
      });

      return actividades.map(actividad => ({
        id: actividad.id_trazabilidad,
        fecha: actividad.fecha_contacto,
        tipo_contacto: actividad.tipo_contacto,
        resultado: actividad.resultado_contacto,
        cliente: actividad.cliente_final?.razon_social,
        contacto: actividad.contacto?.nombre_completo,
        oportunidad: actividad.nombre_oportunidad,
        etapa: actividad.etapa_oportunidad,
        observaciones: actividad.observaciones?.substring(0, 100) + (actividad.observaciones?.length > 100 ? '...' : '')
      }));
    } catch (error) {
      console.error('Error en getActividadesRecientes:', error);
      throw new HttpException('Error al obtener actividades', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ MÉTODO ADICIONAL: Obtener KPIs semanales para la ejecutiva
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
}

// Importar operadores necesarios de TypeORM
import { Not, In, IsNull } from 'typeorm';