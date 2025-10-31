// backend/services/traceability-service/src/services/ejecutiva/ejecutiva.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In, IsNull } from 'typeorm';
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
  ) { }

  async getTrazabilidad(ejecutivaId: string) {
    try {
      const id = parseInt(ejecutivaId);
      const trazabilidad = await this.trazabilidadRepository.find({
        where: { ejecutiva: { id_ejecutiva: id } },
        relations: ['empresa_proveedora', 'cliente_final', 'persona_contacto'],
        order: { fecha_contacto: 'DESC' },
        take: 50
      });

      return trazabilidad.map(registro => ({
        id_trazabilidad: registro.id_trazabilidad,
        fecha_contacto: registro.fecha_contacto,
        tipo_contacto: registro.tipo_contacto,
        resultado_contacto: registro.resultado_contacto,
        empresa_proveedora: registro.empresa_proveedora?.razon_social || 'N/A',
        cliente_final: registro.cliente_final?.razon_social || 'N/A',
        persona_contacto: registro.persona_contacto?.nombre_completo || 'N/A',
        reunion_agendada: registro.reunion_agendada,
        fecha_reunion: registro.fecha_reunion,
        pasa_embudo_ventas: registro.pasa_embudo_ventas,
        nombre_oportunidad: registro.nombre_oportunidad,
        etapa_oportunidad: registro.etapa_oportunidad,
        monto_total_sin_imp: registro.monto_total_sin_imp,
        probabilidad_cierre: registro.probabilidad_cierre,
        observaciones: registro.observaciones,
        informacion_importante: registro.informacion_importante,

      }));
    } catch (error) {
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

      // 1️⃣ Verificar que la ejecutiva existe y está asignada a la empresa
      const ejecutiva = await this.ejecutivaRepository.findOne({
        where: {
          id_ejecutiva: idEjecutiva,
          empresa_proveedora: { id_empresa_prov: idEmpresa }
        },
        relations: ['empresa_proveedora']
      });

      if (!ejecutiva) {
        throw new HttpException(
          'Ejecutiva no encontrada o no asignada a esta empresa',
          HttpStatus.NOT_FOUND
        );
      }

      // 2️⃣ Verificar que el cliente pertenece a la ejecutiva Y a la empresa
      const cliente = await this.clienteRepository.findOne({
        where: {
          id_cliente_final: idCliente,
          ejecutiva: { id_ejecutiva: idEjecutiva },
          empresa_proveedora: { id_empresa_prov: idEmpresa }
        },
        relations: ['ejecutiva', 'empresa_proveedora']
      });

      if (!cliente) {
        throw new HttpException(
          'Cliente no encontrado o no asignado a esta ejecutiva/empresa',
          HttpStatus.NOT_FOUND
        );
      }

      // 3️⃣ Verificar que el contacto pertenece al cliente
      const persona_contacto = await this.contactoRepository.findOne({
        where: {
          id_contacto: idContacto,
          cliente_final: { id_cliente_final: idCliente }
        },
        relations: ['cliente_final']
      });

      if (!persona_contacto) {
        throw new HttpException(
          'Contacto no encontrado o no pertenece a este cliente',
          HttpStatus.NOT_FOUND
        );
      }

      // 4️⃣ Crear nueva trazabilidad
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
        observaciones: data.observaciones,
        fecha_creacion: new Date()
      });

      const saved = await this.trazabilidadRepository.save(nuevaTrazabilidad);

      return {
        id: saved.id_trazabilidad,
        fecha_contacto: saved.fecha_contacto,
        tipo_contacto: saved.tipo_contacto,
        resultado: saved.resultado_contacto,
        cliente: cliente.razon_social,
        persona_contacto: persona_contacto.nombre_completo,
        oportunidad: saved.nombre_oportunidad,
        etapa: saved.etapa_oportunidad,
        success: true
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error.message || 'Error al crear trazabilidad',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

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
        cliente: oportunidad.cliente_final?.razon_social || 'N/A',
        persona_contacto: oportunidad.persona_contacto?.nombre_completo || 'N/A',
        etapa: oportunidad.etapa_oportunidad,
        monto: oportunidad.monto_total_sin_imp,
        probabilidad: oportunidad.probabilidad_cierre,
        fecha_cierre_esperado: oportunidad.fecha_cierre_esperado,
        producto_ofrecido: oportunidad.producto_ofrecido,
        fecha_inicio_etapa: oportunidad.fecha_inicio_etapa
      }));
    } catch (error) {
      throw new HttpException('Error al obtener pipeline', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getActividadesRecientes(ejecutivaId: string, limit: number = 10) {
    try {
      const id = parseInt(ejecutivaId);

      const actividades = await this.trazabilidadRepository.find({
        where: { ejecutiva: { id_ejecutiva: id } },
        relations: ['cliente_final', 'persona_contacto', 'empresa_proveedora'],
        order: { fecha_contacto: 'DESC' },
        take: limit
      });


      return actividades.map(actividad => ({
        id: actividad.id_trazabilidad,
        fecha: actividad.fecha_contacto,
        tipo_contacto: actividad.tipo_contacto,
        resultado: actividad.resultado_contacto,
        cliente: actividad.cliente_final?.razon_social || 'N/A',
        persona_contacto: {
          id: actividad.persona_contacto?.id_contacto,
          nombre_completo: actividad.persona_contacto?.nombre_completo || 'N/A',
          email: actividad.persona_contacto?.correo || '',
          telefono: actividad.persona_contacto?.telefono || ''
        },
        oportunidad: actividad.nombre_oportunidad,
        etapa: actividad.etapa_oportunidad,
        observaciones: actividad.observaciones?.substring(0, 100) +
          (actividad.observaciones?.length > 100 ? '...' : '')
      }));
    } catch (error) {
      throw new HttpException('Error al obtener actividades', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateEtapaOportunidad(trazabilidadId: string, nuevaEtapa: string, ejecutivaId: string) {
    try {
      const idTrazabilidad = parseInt(trazabilidadId);
      const idEjecutiva = parseInt(ejecutivaId);


      // Verificar que la trazabilidad pertenece a la ejecutiva
      const trazabilidad = await this.trazabilidadRepository.findOne({
        where: {
          id_trazabilidad: idTrazabilidad,
          ejecutiva: { id_ejecutiva: idEjecutiva }
        },
        relations: ['ejecutiva']
      });

      if (!trazabilidad) {
        throw new HttpException(
          'Trazabilidad no encontrada o no autorizada',
          HttpStatus.NOT_FOUND
        );
      }

      // Validar etapa
      const etapasValidas = [
        'Prospección', 'Calificación', 'Detección de necesidades', 'Presentación de solución',
        'Manejo de objeciones', 'Presentación de propuesta', 'Negociación', 'Firma de contrato',
        'Venta ganada', 'Venta perdida', 'Venta suspendida'
      ];

      if (!etapasValidas.includes(nuevaEtapa)) {
        throw new HttpException(
          `Etapa no válida. Debe ser una de: ${etapasValidas.join(', ')}`,
          HttpStatus.BAD_REQUEST
        );
      }

      // Actualizar
      await this.trazabilidadRepository.update(idTrazabilidad, {
        etapa_oportunidad: nuevaEtapa,
        fecha_inicio_etapa: nuevaEtapa !== trazabilidad.etapa_oportunidad ? new Date() : trazabilidad.fecha_inicio_etapa
      });

      return {
        success: true,
        message: 'Etapa actualizada correctamente',
        nueva_etapa: nuevaEtapa
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al actualizar etapa', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ NUEVO: Obtener estadísticas para el dashboard
  async getStats(ejecutivaId: string) {
    try {
      const id = parseInt(ejecutivaId);

      // Total contactos (Etapa 1)
      const totalContactos = await this.trazabilidadRepository.count({
        where: {
          ejecutiva: { id_ejecutiva: id },
          pasa_embudo_ventas: false
        }
      });

      // Oportunidades generadas (pasaron a Etapa 2)
      const oportunidadesGeneradas = await this.trazabilidadRepository.count({
        where: {
          ejecutiva: { id_ejecutiva: id },
          pasa_embudo_ventas: true
        }
      });

      // Ventas ganadas
      const ventasGanadas = await this.trazabilidadRepository.count({
        where: {
          ejecutiva: { id_ejecutiva: id },
          etapa_oportunidad: 'Venta ganada'
        }
      });

      // Oportunidades en proceso (no ganadas, perdidas ni suspendidas)
      const enProceso = await this.trazabilidadRepository.count({
        where: {
          ejecutiva: { id_ejecutiva: id },
          pasa_embudo_ventas: true,
          etapa_oportunidad: Not(In(['Venta ganada', 'Venta perdida', 'Venta suspendida']))
        }
      });

      const pipeline = await this.trazabilidadRepository.find({
        where: {
          ejecutiva: { id_ejecutiva: id },
          etapa_oportunidad: Not(In(['Venta ganada', 'Venta perdida', 'Venta suspendida']))
        },
        select: ['monto_total_sin_imp']
      });

      // Validación robusta para montoTotal
      const montoTotal = pipeline.reduce((sum, op) => {
        const monto = op.monto_total_sin_imp;
        // Convertir a número y validar
        const montoNumerico = Number(monto) || 0;
        return sum + montoNumerico;
      }, 0);

      // Calcular tasa de conversión
      const tasaConversion = oportunidadesGeneradas > 0
        ? (ventasGanadas / oportunidadesGeneradas) * 100
        : 0;

      const stats = {
        totalContactos,
        oportunidadesGeneradas,
        ventasGanadas,
        tasaConversion: parseFloat(tasaConversion.toFixed(1)),
        montoTotal: parseFloat(montoTotal.toFixed(2)), // ✅ Ahora montoTotal siempre es número
        enProceso
      };

      return stats;
    } catch (error) {
      throw new HttpException('Error al calcular estadísticas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}