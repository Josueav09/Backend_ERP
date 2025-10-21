// backend/services/traceability-service/src/services/ejecutiva/ejecutiva.service.ts - CORREGIDO
// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { sql, pool } from '../../../../../shared/utils/database';

// @Injectable()
// export class EjecutivaTraceabilityService {
  
//   async getTrazabilidad(ejecutivaId: string) {
//     try {
//       const result = await sql.query(
//         `
//         SELECT 
//           t.*,
//           ep.nombre_empresa,
//           ce.nombre_cliente
//         FROM public.trazabilidad t 
//         JOIN public.empresa_proveedora ep ON t.id_empresa = ep.id_empresa
//         LEFT JOIN public.cliente_empresa ce ON t.id_cliente = ce.id_cliente
//         WHERE t.id_ejecutiva = $1
//         ORDER BY t.fecha_actividad DESC
//         LIMIT 50
//         `,
//         [ejecutivaId]
//       );

//       return result.rows;
//     } catch (error) {
//       throw new HttpException('Error al obtener trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async createTrazabilidad(data: {
//     id_ejecutiva: string;
//     id_empresa: string;
//     id_cliente?: string;
//     tipo_actividad: string;
//     descripcion: string;
//     estado: string;
//     notas?: string;
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

//       // Crear trazabilidad
//       const result = await sql.query(
//         `
//         INSERT INTO public.trazabilidad (
//           id_ejecutiva, id_empresa, id_cliente, tipo_actividad, 
//           descripcion, estado, notas, fecha_actividad
//         )
//         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
//         RETURNING *
//         `,
//         [
//           data.id_ejecutiva,
//           data.id_empresa,
//           data.id_cliente || null,
//           data.tipo_actividad,
//           data.descripcion,
//           data.estado || 'en_proceso',
//           data.notas || null,
//         ]
//       );

//       await sql.query("COMMIT");
//       return result.rows[0];
//     } catch (error) {
//       await sql.query("ROLLBACK");
//       if (error instanceof HttpException) throw error;
//       throw new HttpException('Error al crear trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }
// }

// backend/services/traceability-service/src/services/ejecutiva/ejecutiva.service.ts - CORREGIDO
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trazabilidad } from '../../../../../shared/entities/Trazabilidad.entity';
import { Ejecutiva } from '../../../../../shared/entities/Ejecutiva.entity';
import { EmpresaProveedora } from '../../../../../shared/entities/EmpresaProveedora.entity';
import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
import { PersonaContacto } from '../../../../../shared/entities/PersonaContacto.entity';

@Injectable()
export class EjecutivaTraceabilityService {
  constructor(
    @InjectRepository(Trazabilidad)
    private trazabilidadRepository: Repository<Trazabilidad>,

    @InjectRepository(Ejecutiva)
    private ejecutivaRepository: Repository<Ejecutiva>,

    @InjectRepository(EmpresaProveedora)
    private empresaRepository: Repository<EmpresaProveedora>,

    @InjectRepository(ClienteFinal)
    private clienteRepository: Repository<ClienteFinal>,

    @InjectRepository(PersonaContacto)
    private contactoRepository: Repository<PersonaContacto>,
  ) {}

  async getTrazabilidad(ejecutivaId: string) {
    try {
      const id = parseInt(ejecutivaId);

      const trazabilidad = await this.trazabilidadRepository.find({
        where: { ejecutiva: { id_ejecutiva: id } },
        relations: [
          'empresa_proveedora', 
          'cliente_final', 
          'persona_contacto',
          'cliente_final.personas_contacto'
        ],
        order: { fecha_contacto: 'DESC' },
        take: 50
      });

      return trazabilidad.map(registro => ({
        id_trazabilidad: registro.id_trazabilidad,
        fecha_contacto: registro.fecha_contacto,
        tipo_contacto: registro.tipo_contacto,
        resultado_contacto: registro.resultado_contacto,
        empresa_proveedora: registro.empresa_proveedora?.razon_social,
        cliente_final: registro.cliente_final?.razon_social,
        persona_contacto: registro.persona_contacto?.nombre_completo,
        reunion_agendada: registro.reunion_agendada,
        fecha_reunion: registro.fecha_reunion,
        pasa_embudo_ventas: registro.pasa_embudo_ventas,
        nombre_oportunidad: registro.nombre_oportunidad,
        etapa_oportunidad: registro.etapa_oportunidad,
        monto_total_sin_imp: registro.monto_total_sin_imp,
        observaciones: registro.observaciones,
        informacion_importante: registro.informacion_importante
      }));
    } catch (error) {
      console.error('Error en getTrazabilidad:', error);
      throw new HttpException('Error al obtener trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createTrazabilidad(data: {
    id_ejecutiva: string;
    id_empresa_prov: string;
    id_cliente_final: string;
    id_contacto: string;
    tipo_contacto: string;
    fecha_contacto: Date;
    resultado_contacto: string;
    informacion_importante?: string;
    reunion_agendada?: boolean;
    fecha_reunion?: Date;
    participantes?: string;
    se_dio_reunion?: boolean;
    resultados_reunion?: string;
    pasa_embudo_ventas?: boolean;
    nombre_oportunidad?: string;
    etapa_oportunidad?: string;
    producto_ofrecido?: string;
    monto_total_sin_imp?: number;
    probabilidad_cierre?: number;
    observaciones?: string;
  }) {
    try {
      const idEjecutiva = parseInt(data.id_ejecutiva);
      const idEmpresa = parseInt(data.id_empresa_prov);
      const idCliente = parseInt(data.id_cliente_final);
      const idContacto = parseInt(data.id_contacto);

      // Verificar que todos los IDs existen y las relaciones son válidas
      const [ejecutiva, empresa, cliente, persona_contacto] = await Promise.all([
        this.ejecutivaRepository.findOne({ 
          where: { 
            id_ejecutiva: idEjecutiva,
            empresa_proveedora: { id_empresa_prov: idEmpresa }
          },
          relations: ['empresa_proveedora']
        }),
        this.empresaRepository.findOne({ where: { id_empresa_prov: idEmpresa } }),
        this.clienteRepository.findOne({ 
          where: { 
            id_cliente_final: idCliente,
            ejecutiva: { id_ejecutiva: idEjecutiva }
          } 
        }),
        this.contactoRepository.findOne({ 
          where: { 
            id_contacto: idContacto,
            cliente_final: { id_cliente_final: idCliente }
          } 
        })
      ]);

      if (!ejecutiva) {
        throw new HttpException('Ejecutiva no encontrada o empresa no asignada', HttpStatus.NOT_FOUND);
      }
      if (!empresa) {
        throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
      }
      if (!cliente) {
        throw new HttpException('Cliente no encontrado o no asignado a esta ejecutiva', HttpStatus.NOT_FOUND);
      }
      if (!persona_contacto) {
        throw new HttpException('Contacto no encontrado o no pertenece a este cliente', HttpStatus.NOT_FOUND);
      }

      // Crear nueva trazabilidad
      const nuevaTrazabilidad = this.trazabilidadRepository.create({
        ejecutiva: { id_ejecutiva: idEjecutiva },
        empresa_proveedora: { id_empresa_prov: idEmpresa },
        cliente_final: { id_cliente_final: idCliente },
        persona_contacto: { id_contacto: idContacto },
        tipo_contacto: data.tipo_contacto,
        fecha_contacto: data.fecha_contacto || new Date(),
        resultado_contacto: data.resultado_contacto,
        informacion_importante: data.informacion_importante,
        reunion_agendada: data.reunion_agendada || false,
        fecha_reunion: data.fecha_reunion,
        participantes: data.participantes,
        se_dio_reunion: data.se_dio_reunion,
        resultados_reunion: data.resultados_reunion,
        pasa_embudo_ventas: data.pasa_embudo_ventas || false,
        nombre_oportunidad: data.nombre_oportunidad,
        etapa_oportunidad: data.etapa_oportunidad,
        producto_ofrecido: data.producto_ofrecido,
        monto_total_sin_imp: data.monto_total_sin_imp,
        probabilidad_cierre: data.probabilidad_cierre,
        observaciones: data.observaciones
      } as any);

      const saved = await this.trazabilidadRepository.save(nuevaTrazabilidad);
      const trazabilidadGuardada = Array.isArray(saved) ? saved[0] : saved;

      return {
        id: trazabilidadGuardada.id_trazabilidad,
        fecha_contacto: trazabilidadGuardada.fecha_contacto,
        tipo_contacto: trazabilidadGuardada.tipo_contacto,
        resultado: trazabilidadGuardada.resultado_contacto,
        cliente: cliente.razon_social,
        persona_contacto: persona_contacto.nombre_completo,
        oportunidad: trazabilidadGuardada.nombre_oportunidad,
        etapa: trazabilidadGuardada.etapa_oportunidad
      };
    } catch (error) {
      console.error('Error en createTrazabilidad:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al crear trazabilidad', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
        relations: ['cliente_final', 'persona_contacto', 'empresa_proveedora'],
        order: { fecha_cierre_esperado: 'ASC' }
      });

      return pipeline.map(oportunidad => ({
        id: oportunidad.id_trazabilidad,
        nombre_oportunidad: oportunidad.nombre_oportunidad,
        cliente: oportunidad.cliente_final?.razon_social,
        persona_contacto: oportunidad.persona_contacto?.nombre_completo,
        etapa: oportunidad.etapa_oportunidad,
        monto: oportunidad.monto_total_sin_imp,
        probabilidad: oportunidad.probabilidad_cierre,
        fecha_cierre_esperado: oportunidad.fecha_cierre_esperado,
        producto_ofrecido: oportunidad.producto_ofrecido
      }));
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
        persona_contacto: actividad.persona_contacto?.nombre_completo,
        oportunidad: actividad.nombre_oportunidad,
        etapa: actividad.etapa_oportunidad,
        observaciones: actividad.observaciones?.substring(0, 100) + (actividad.observaciones?.length > 100 ? '...' : '')
      }));
    } catch (error) {
      console.error('Error en getActividadesRecientes:', error);
      throw new HttpException('Error al obtener actividades', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

// Importar operadores TypeORM
import { Not, In, IsNull } from 'typeorm';