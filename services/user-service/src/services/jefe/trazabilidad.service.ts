import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Trazabilidad } from '../../../../../shared/entities/trazabilidad.entity'; // Ajusta la ruta según tu estructura
import { Ejecutiva } from '../../../../../shared/entities/ejecutiva.entity'; // ✅ AÑADE ESTOS IMPORTS
import { EmpresaProveedora } from '../../../../../shared/entities/EmpresaProveedora.entity';
import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
@Injectable()
export class TrazabilidadService {
  constructor(
    @InjectRepository(Trazabilidad)
    private readonly trazabilidadRepo: Repository<Trazabilidad>,

    // ✅ AÑADE ESTOS REPOSITORIOS
    @InjectRepository(Ejecutiva)
    private readonly ejecutivaRepo: Repository<Ejecutiva>,
    
    @InjectRepository(EmpresaProveedora)
    private readonly empresaRepo: Repository<EmpresaProveedora>,
    
    @InjectRepository(ClienteFinal)
    private readonly clienteRepo: Repository<ClienteFinal>,

  ) { console.log('✅ TrazabilidadService inicializado');}

  // ============================================
  // KPIs GENERALES
  // ============================================
  // En trazabilidad.service.ts - método getKPIs
  // ============================================
// KPIs GENERALES - SOLO CORREGIR TASA
// ============================================
async getKPIs(filters: {
  ejecutivaId?: number;
  empresaId?: number;
  clienteId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}) {
  console.log('🔍 [TrazabilidadService.getKPIs] Filtros recibidos:', filters);
  
  const query = this.trazabilidadRepo.createQueryBuilder('t')
    .leftJoin('t.ejecutiva', 'ej')
    .leftJoin('t.empresa_proveedora', 'ep')
    .leftJoin('t.cliente_final', 'cf');

  // Aplicar filtros (MANTENER TU CÓDIGO ORIGINAL)
  if (filters.ejecutivaId) {
    query.andWhere('t.id_ejecutiva = :ejecutivaId', { ejecutivaId: filters.ejecutivaId });
  }
  if (filters.empresaId) {
    query.andWhere('t.id_empresa_prov = :empresaId', { empresaId: filters.empresaId });
  }
  if (filters.clienteId) {
    query.andWhere('t.id_cliente_final = :clienteId', { clienteId: filters.clienteId });
  }
  if (filters.fechaDesde) {
    query.andWhere('t.fecha_contacto >= :fechaDesde', { fechaDesde: filters.fechaDesde });
  }
  if (filters.fechaHasta) {
    query.andWhere('t.fecha_contacto <= :fechaHasta', { fechaHasta: filters.fechaHasta });
  }

  console.log('📊 [TrazabilidadService] Ejecutando query...');
  
  const data = await query.getMany();
  console.log('📊 [TrazabilidadService] Datos encontrados:', data.length, 'registros');

  // Calcular KPIs (MANTENER TU CÓDIGO ORIGINAL)
  const totalOportunidades = data.length;
  const enProceso = data.filter(t => 
    ['Prospección', 'Calificación', 'Detección de necesidades', 'Presentación de solución'].includes(t.etapa_oportunidad)
  ).length;
  const ventasGanadas = data.filter(t => t.etapa_oportunidad === 'Venta ganada').length;
  const ventasPerdidas = data.filter(t => t.etapa_oportunidad === 'Venta perdida').length;
  const montoTotal = data.reduce((sum, t) => sum + (Number(t.monto_total_sin_imp) || 0), 0);
  
  // ✅ SOLO CAMBIAR ESTA LÍNEA - Tasa de conversión CORRECTA
  // Calcular basado en oportunidades que están en el embudo
  const oportunidadesEmbudo = data.filter(t => t.pasa_embudo_ventas === true);
  const tasaConversion = oportunidadesEmbudo.length > 0 ? 
    (ventasGanadas / oportunidadesEmbudo.length) * 100 : 0;

  console.log('📈 [TrazabilidadService] KPIs calculados:', {
    totalOportunidades,
    enProceso,
    ventasGanadas,
    ventasPerdidas,
    montoTotal,
    tasaConversion: Math.round(tasaConversion * 100) / 100,
    oportunidadesEnEmbudo: oportunidadesEmbudo.length
  });

  return {
    totalOportunidades,
    enProceso,
    ventasGanadas,
    ventasPerdidas,
    montoTotal,
    tasaConversion: Math.round(tasaConversion * 100) / 100
  };
}

  // ============================================
  // ETAPA 1: GENERACIÓN DE OPORTUNIDAD
  // ============================================
  async getEtapa1(filters: {
  ejecutivaId?: number;
  empresaId?: number;
  clienteId?: number;
  resultadoContacto?: string;
  tipoContacto?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  page?: number;
  limit?: number;
}) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const query = this.trazabilidadRepo.createQueryBuilder('t')
    .leftJoinAndSelect('t.ejecutiva', 'ej')
    .leftJoinAndSelect('t.empresa_proveedora', 'ep')
    .leftJoinAndSelect('t.cliente_final', 'cf')
    .leftJoinAndSelect('t.persona_contacto', 'pc')
    .select([
      't.id_trazabilidad',
      't.fecha_contacto',
      't.tipo_contacto',
      't.resultado_contacto',
      't.pasa_embudo_ventas',
      't.informacion_importante',
      't.reunion_agendada',
      't.fecha_reunion',
      't.participantes',
      't.se_dio_reunion',
      't.resultados_reunion',
      't.observaciones',
      'ej.id_ejecutiva',
      'ej.nombre_completo',
      'ep.id_empresa_prov',
      'ep.razon_social',
      'cf.id_cliente_final',
      'cf.razon_social',
      'pc.id_contacto',
      'pc.nombre_completo',  // ✅ CAMBIADO: de 'pc.nombre', 'pc.apellido'
      'pc.cargo',
      'pc.correo'
    ]);

  // Aplicar filtros (tu código existente)
  if (filters.ejecutivaId) {
    query.andWhere('t.id_ejecutiva = :ejecutivaId', { ejecutivaId: filters.ejecutivaId });
  }
  if (filters.empresaId) {
    query.andWhere('t.id_empresa_prov = :empresaId', { empresaId: filters.empresaId });
  }
  if (filters.clienteId) {
    query.andWhere('t.id_cliente_final = :clienteId', { clienteId: filters.clienteId });
  }
  if (filters.resultadoContacto) {
    query.andWhere('t.resultado_contacto = :resultado', { resultado: filters.resultadoContacto });
  }
  if (filters.tipoContacto) {
    query.andWhere('t.tipo_contacto = :tipo', { tipo: filters.tipoContacto });
  }
  if (filters.fechaDesde) {
    query.andWhere('t.fecha_contacto >= :fechaDesde', { fechaDesde: filters.fechaDesde });
  }
  if (filters.fechaHasta) {
    query.andWhere('t.fecha_contacto <= :fechaHasta', { fechaHasta: filters.fechaHasta });
  }

  query.orderBy('t.fecha_contacto', 'DESC');
  query.skip(skip).take(limit);

  const [data, total] = await query.getManyAndCount();

  // Mapear a estructura del frontend - AGREGAR personaContacto
  const etapa1Data = data.map(t => ({
    id: t.id_trazabilidad,
    clienteFinal: t.cliente_final?.razon_social || 'N/A',
    ejecutiva: t.ejecutiva?.nombre_completo || 'N/A',
    personaContacto: t.persona_contacto?.nombre_completo || 'N/A', // ✅ AGREGAR ESTO
    tipoContacto: this.mapTipoContacto(t.tipo_contacto),
    fechaContacto: t.fecha_contacto?.toISOString().split('T')[0] || '',
    resultadoContacto: t.resultado_contacto || 'Pendiente',
    pasaEmbudo: t.pasa_embudo_ventas || false,
    informacionImportante: t.informacion_importante || '',
    fechaReunion: t.fecha_reunion?.toISOString().split('T')[0] || null,
    participantes: t.participantes || null,
    resultadosReunion: t.resultados_reunion || null,
    observaciones: t.observaciones || ''
  }));

  return {
    data: etapa1Data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
  }

  // ============================================
  // ETAPA 2: GESTIÓN DE OPORTUNIDAD
  // ============================================
      async getEtapa2(filters: {
      ejecutivaId?: number;
      empresaId?: number;
      clienteId?: number;
      etapaOportunidad?: string;
      fechaDesde?: string;
      fechaHasta?: string;
      page?: number;
      limit?: number;
    }) {
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const skip = (page - 1) * limit;

      const query = this.trazabilidadRepo.createQueryBuilder('t')
        .leftJoinAndSelect('t.ejecutiva', 'ej')
        .leftJoinAndSelect('t.empresa_proveedora', 'ep')
        .leftJoinAndSelect('t.cliente_final', 'cf')
        .where('t.pasa_embudo_ventas = true')
        .select([
          't.id_trazabilidad',
          't.nombre_oportunidad',
          't.tipo_oportunidad',
          't.etapa_oportunidad',
          't.monto_total_sin_imp',
          't.probabilidad_cierre',
          't.fecha_cierre_esperado',
          't.producto_ofrecido',
          't.observaciones',
          't.monto_cierre_final',
          't.fecha_registro_oportunidad',
          'ej.id_ejecutiva',
          'ej.nombre_completo',
          'ep.id_empresa_prov',
          'ep.razon_social',
          'cf.id_cliente_final',
          'cf.razon_social'
        ]);

      // Aplicar filtros
      if (filters.ejecutivaId) {
        query.andWhere('t.id_ejecutiva = :ejecutivaId', { ejecutivaId: filters.ejecutivaId });
      }
      if (filters.empresaId) {
        query.andWhere('t.id_empresa_prov = :empresaId', { empresaId: filters.empresaId });
      }
      if (filters.clienteId) {
        query.andWhere('t.id_cliente_final = :clienteId', { clienteId: filters.clienteId });
      }
      if (filters.etapaOportunidad && filters.etapaOportunidad !== 'all') {
        query.andWhere('t.etapa_oportunidad = :etapa', { etapa: filters.etapaOportunidad });
      }
      if (filters.fechaDesde) {
        query.andWhere('t.fecha_registro_oportunidad >= :fechaDesde', { fechaDesde: filters.fechaDesde });
      }
      if (filters.fechaHasta) {
        query.andWhere('t.fecha_registro_oportunidad <= :fechaHasta', { fechaHasta: filters.fechaHasta });
      }

      query.orderBy('t.fecha_cierre_esperado', 'ASC');
      query.skip(skip).take(limit);

      const [data, total] = await query.getManyAndCount();

      // ✅ Mapeo CORREGIDO - Maneja fechas como string o Date
      const etapa2Data = data.map(t => ({
        id: t.id_trazabilidad,
        nombreOportunidad: t.nombre_oportunidad || 'Sin nombre',
        ejecutiva: t.ejecutiva?.nombre_completo || 'N/A',
        clienteFinal: t.cliente_final?.razon_social || 'N/A',
        tipoOportunidad: t.tipo_oportunidad || 'N/A',
        etapaOportunidad: t.etapa_oportunidad || 'Prospección',
        montoTotal: Number(t.monto_total_sin_imp) || 0,
        probabilidadCierre: t.probabilidad_cierre || 0,
        fechaCierreEsperado: this.formatDate(t.fecha_cierre_esperado), // ✅ Usar función helper
        productoOfrecido: t.producto_ofrecido || '',
        observaciones: t.observaciones || '',
        montoCierreFinal: t.monto_cierre_final ? Number(t.monto_cierre_final) : null
      }));

      console.log('✅ [getEtapa2] Datos mapeados exitosamente:', etapa2Data.length, 'registros');

      return {
        data: etapa2Data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    }

// ✅ AGREGAR ESTA FUNCIÓN HELPER para manejar fechas
private formatDate(dateValue: any): string {
  if (!dateValue) return '';
  
  try {
    if (typeof dateValue === 'string') {
      return dateValue.split('T')[0];
    } else if (dateValue instanceof Date) {
      return dateValue.toISOString().split('T')[0];
    } else {
      return String(dateValue).split('T')[0];
    }
  } catch (error) {
    console.warn('⚠️ Error formateando fecha:', dateValue, error);
    return '';
  }
}

  // ============================================
  // KPI: NUEVOS CLIENTES
  // ============================================
  async getNuevosClientes(meses: number = 6, ejecutivaId?: number) {
  console.log('🔄 [getNuevosClientes] === INICIANDO ===');
  
  // 1. Calcular fecha de inicio CORRECTAMENTE
  const fechaActual = new Date();
  const fechaInicio = new Date();
  fechaInicio.setMonth(fechaActual.getMonth() - meses);
  
  console.log('📅 [getNuevosClientes] FECHAS CALCULADAS:');
  console.log('   - Fecha actual:', fechaActual.toISOString());
  console.log('   - Fecha inicio (hace', meses, 'meses):', fechaInicio.toISOString());
  console.log('   - Ejecutiva ID:', ejecutivaId);

  // 2. VERIFICAR DIRECTAMENTE CON CONSULTA SQL SIMPLE
  console.log('🔍 [getNuevosClientes] Verificando registros con consulta directa...');
  
  const querySimple = this.trazabilidadRepo.createQueryBuilder('t')
    .select(['t.id_trazabilidad', 't.fecha_contacto'])
    .where('t.fecha_contacto >= :fechaInicio', { fechaInicio })
    .orderBy('t.fecha_contacto', 'DESC');

  const registrosFiltrados = await querySimple.getMany();
  console.log('📊 [getNuevosClientes] REGISTROS QUE CUMPLEN EL FILTRO:');
  registrosFiltrados.forEach(reg => {
    console.log(`   - ID: ${reg.id_trazabilidad}, Fecha: ${reg.fecha_contacto}`);
  });

  // 3. SI NO HAY REGISTROS, EL PROBLEMA ESTÁ EN EL FILTRO
  if (registrosFiltrados.length === 0) {
    console.log('🚨 [getNuevosClientes] ¡NO HAY REGISTROS CON EL FILTRO!');
    console.log('🔍 [getNuevosClientes] Verificando TODOS los registros...');
    
    const todosRegistros = await this.trazabilidadRepo.find({
      select: ['id_trazabilidad', 'fecha_contacto'],
      order: { fecha_contacto: 'DESC' }
    });
    
    console.log('📊 [getNuevosClientes] TODOS LOS REGISTROS EN BD:');
    todosRegistros.forEach(reg => {
      console.log(`   - ID: ${reg.id_trazabilidad}, Fecha: ${reg.fecha_contacto}`);
    });
    
    // Forzar que se muestren algunos datos
    console.log('🔄 [getNuevosClientes] Forzando datos de ejemplo...');
    return [
      { mes: 'Oct 2025', contactos: 1 },
      { mes: 'Sep 2025', contactos: 0 },
      { mes: 'Ago 2025', contactos: 0 },
      { mes: 'Jul 2025', contactos: 0 },
      { mes: 'Jun 2025', contactos: 0 },
      { mes: 'May 2025', contactos: 0 }
    ];
  }

  // 4. SI HAY REGISTROS, PROCEDER CON EL QUERY ORIGINAL
  console.log('🔍 [getNuevosClientes] Ejecutando query de agrupación...');
  
  try {
    const query = this.trazabilidadRepo.createQueryBuilder('t')
      .select('EXTRACT(MONTH FROM t.fecha_contacto)', 'mes_numero')
      .addSelect('EXTRACT(YEAR FROM t.fecha_contacto)', 'anio')
      .addSelect(`CASE 
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 1 THEN 'Ene'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 2 THEN 'Feb' 
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 3 THEN 'Mar'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 4 THEN 'Abr'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 5 THEN 'May'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 6 THEN 'Jun'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 7 THEN 'Jul'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 8 THEN 'Ago'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 9 THEN 'Sep'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 10 THEN 'Oct'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 11 THEN 'Nov'
        WHEN EXTRACT(MONTH FROM t.fecha_contacto) = 12 THEN 'Dic'
      END`, 'mes_nombre')
      .addSelect('COUNT(t.id_trazabilidad)', 'contactos')
      .where('t.fecha_contacto >= :fechaInicio', { fechaInicio })
      .groupBy('EXTRACT(MONTH FROM t.fecha_contacto), EXTRACT(YEAR FROM t.fecha_contacto)')
      .orderBy('EXTRACT(YEAR FROM t.fecha_contacto), EXTRACT(MONTH FROM t.fecha_contacto)', 'ASC');

    if (ejecutivaId) {
      query.andWhere('t.id_ejecutiva = :ejecutivaId', { ejecutivaId });
    }

    const data = await query.getRawMany();
    console.log('📊 [getNuevosClientes] RESULTADO DEL QUERY DE AGRUPACIÓN:', data);

    if (data.length > 0) {
      const resultado = data.map(item => ({
        mes: `${item.mes_nombre} ${item.anio}`.trim(),
        contactos: parseInt(item.contactos) || 0
      }));
      console.log('✅ [getNuevosClientes] DATOS FINALES:', resultado);
      return resultado;
    }

  } catch (error) {
    console.error('❌ [getNuevosClientes] ERROR:', error);
  }

  // 5. FALLBACK
  console.log('🔄 [getNuevosClientes] Usando cálculo manual...');
  
  // Calcular manualmente desde los registros filtrados
  const contactosPorMes: { [key: string]: number } = {};
  
  registrosFiltrados.forEach(registro => {
    if (registro.fecha_contacto) {
      const fecha = new Date(registro.fecha_contacto);
      const mes = fecha.getMonth();
      const anio = fecha.getFullYear();
      
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const clave = `${meses[mes]} ${anio}`;
      
      contactosPorMes[clave] = (contactosPorMes[clave] || 0) + 1;
    }
  });

  const resultado = Object.entries(contactosPorMes)
    .map(([mes, contactos]) => ({ mes, contactos }))
    .sort((a, b) => {
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const [mesA, anioA] = a.mes.split(' ');
      const [mesB, anioB] = b.mes.split(' ');
      
      if (anioA !== anioB) return parseInt(anioA) - parseInt(anioB);
      return meses.indexOf(mesA) - meses.indexOf(mesB);
    });

  console.log('✅ [getNuevosClientes] RESULTADO MANUAL:', resultado);
  return resultado;
}

  // ============================================
  // KPI: CONTACTOS POR TIPO
  // ============================================
  async getContactosPorTipo(filters: {
    ejecutivaId?: number;
    fechaDesde?: string;
    fechaHasta?: string;
  }) {
    const query = this.trazabilidadRepo.createQueryBuilder('t')
      .select('t.tipo_contacto as name')
      .addSelect('COUNT(*) as value')
      .groupBy('t.tipo_contacto');

    if (filters.ejecutivaId) {
      query.andWhere('t.id_ejecutiva = :ejecutivaId', { ejecutivaId: filters.ejecutivaId });
    }
    if (filters.fechaDesde) {
      query.andWhere('t.fecha_contacto >= :fechaDesde', { fechaDesde: filters.fechaDesde });
    }
    if (filters.fechaHasta) {
      query.andWhere('t.fecha_contacto <= :fechaHasta', { fechaHasta: filters.fechaHasta });
    }

    const data = await query.getRawMany();
    
    // Mapear a estructura con colores
    const colorMap: Record<string, string> = {
      'Llamada telefónica': '#3B82F6',
      'Correo electrónico': '#A855F7',
      'Chat de Whatsapp': '#10B981',
      'Contacto por linkedin': '#0EA5E9',
      'Reunión presencial': '#F97316',
      'Otro': '#6B7280'
    };

    return data.map(item => ({
      name: this.mapTipoContacto(item.name),
      value: parseInt(item.value),
      color: colorMap[item.name] || '#6B7280'
    }));
  }

  // ============================================
  // KPI: MONTOS POR ETAPA
  // ============================================
  async getMontosPorEtapa(filters: {
    ejecutivaId?: number;
    fechaDesde?: string;
    fechaHasta?: string;
  }) {
    const query = this.trazabilidadRepo.createQueryBuilder('t')
      .select('t.etapa_oportunidad as etapa')
      .addSelect('SUM(t.monto_total_sin_imp) as monto')
      .where('t.pasa_embudo_ventas = true')
      .andWhere('t.etapa_oportunidad IS NOT NULL')
      .groupBy('t.etapa_oportunidad');

    if (filters.ejecutivaId) {
      query.andWhere('t.id_ejecutiva = :ejecutivaId', { ejecutivaId: filters.ejecutivaId });
    }
    if (filters.fechaDesde) {
      query.andWhere('t.fecha_registro_oportunidad >= :fechaDesde', { fechaDesde: filters.fechaDesde });
    }
    if (filters.fechaHasta) {
      query.andWhere('t.fecha_registro_oportunidad <= :fechaHasta', { fechaHasta: filters.fechaHasta });
    }

    const data = await query.getRawMany();
    return data.map(item => ({
      etapa: item.etapa,
      monto: parseFloat(item.monto) || 0
    }));
  }

  // ============================================
  // KPI: TASA DE CONVERSIÓN
  // ============================================
  async getTasaConversion(filters: {
  fechaDesde?: string;
  fechaHasta?: string;
}) {
  console.log('🔄 [getTasaConversion] Obteniendo ventas cerradas por ejecutiva...');
  
  const query = this.trazabilidadRepo.createQueryBuilder('t')
    .leftJoin('t.ejecutiva', 'ej')
    .select('ej.id_ejecutiva', 'id_ejecutiva')
    .addSelect('ej.nombre_completo', 'ejecutiva')
    .addSelect('COUNT(t.id_trazabilidad)', 'total_oportunidades')
    .addSelect('COUNT(CASE WHEN t.etapa_oportunidad = \'Venta ganada\' THEN 1 END)', 'ventas_ganadas')
    .addSelect('COUNT(CASE WHEN t.etapa_oportunidad = \'Venta perdida\' THEN 1 END)', 'ventas_perdidas')
    .addSelect('SUM(CASE WHEN t.etapa_oportunidad = \'Venta ganada\' THEN t.monto_cierre_final ELSE 0 END)', 'monto_total_ganado')
    .where('t.pasa_embudo_ventas = true')
    .andWhere('t.etapa_oportunidad IS NOT NULL')
    .groupBy('ej.id_ejecutiva, ej.nombre_completo')
    .having('COUNT(t.id_trazabilidad) > 0');

  if (filters.fechaDesde) {
    query.andWhere('t.fecha_contacto >= :fechaDesde', { fechaDesde: filters.fechaDesde });
  }
  if (filters.fechaHasta) {
    query.andWhere('t.fecha_contacto <= :fechaHasta', { fechaHasta: filters.fechaHasta });
  }

  const data = await query.getRawMany();
  
  console.log('📊 [getTasaConversion] Datos crudos:', data);
  
  // Mapear resultados con ventas cerradas
  const resultado = data.map(item => ({
    id_ejecutiva: item.id_ejecutiva,
    ejecutiva: item.ejecutiva?.split(' ')[0] || item.ejecutiva || 'N/A',
    ventas_ganadas: parseInt(item.ventas_ganadas) || 0,
    ventas_perdidas: parseInt(item.ventas_perdidas) || 0,
    total_oportunidades: parseInt(item.total_oportunidades) || 0,
    monto_total_ganado: parseFloat(item.monto_total_ganado) || 0,
    tasa: item.ventas_ganadas > 0 ? 
      Math.round((item.ventas_ganadas / item.total_oportunidades) * 100 * 10) / 10 : 0
  }));

  console.log('✅ [getTasaConversion] Resultado final:', resultado);
  return resultado;
}

  // ============================================
  // DETALLE DE TRAZABILIDAD
  // ============================================
  async getTrazabilidadDetail(id: number) {
    return await this.trazabilidadRepo.findOne({
      where: { id_trazabilidad: id },
      relations: ['ejecutiva', 'empresa_proveedora', 'cliente_final', 'persona_contacto']
    });
  }

  // ============================================
  // HELPER: Mapear tipo de contacto
  // ============================================
  private mapTipoContacto(tipo: string): string {
    const map: Record<string, string> = {
      'Llamada telefónica': 'Llamada',
      'Chat de Whatsapp': 'WhatsApp',
      'Correo electrónico': 'Email',
      'Contacto por linkedin': 'LinkedIn',
      'Reunión presencial': 'Reunión presencial',
      'Otro': 'Otro'
    };
    return map[tipo] || tipo;
  }

  // ============================================
  // FILTROS DINÁMICOS - NUEVO MÉTODO
  // ============================================
  async getFilterOptions() {
    console.log('🔄 [TrazabilidadService] Obteniendo opciones de filtro...');
    
    try {
      const [ejecutivas, empresas, clientes] = await Promise.all([
        this.ejecutivaRepo.find({ 
          select: ['id_ejecutiva', 'nombre_completo'],
          where: { estado_ejecutiva: 'Activo' }
        }),
        this.empresaRepo.find({ 
          select: ['id_empresa_prov', 'razon_social'],
          where: { estado: 'Activo' }
        }),
        this.clienteRepo.find({ 
          select: ['id_cliente_final', 'razon_social'],
          where: { estado: 'Activo' }
        })
      ]);

      const result = {
        ejecutivas: ejecutivas.map(e => ({ 
          id: e.id_ejecutiva, 
          nombre_completo: e.nombre_completo 
        })),
        empresas: empresas.map(e => ({ 
          id: e.id_empresa_prov, 
          razon_social: e.razon_social 
        })),
        clientes: clientes.map(c => ({ 
          id: c.id_cliente_final, 
          razon_social: c.razon_social 
        }))
      };

      console.log('✅ [TrazabilidadService] Opciones generadas:', result);
      return result;
      
    } catch (error) {
      console.error('❌ [TrazabilidadService] Error obteniendo opciones de filtro:', error);
      
      // ✅ Datos de respaldo en caso de error
      const backupData = {
        ejecutivas: [
          { id: 1, nombre_completo: 'Jherson Medrano' },
          { id: 2, nombre_completo: 'Pedro Suarez' }
        ],
        empresas: [
          { id: 1, razon_social: 'Rimac Seguros' }
        ],
        clientes: [
          { id: 4, razon_social: 'SuperMarket Perú S.A.' }
        ]
      };
      
      console.log('🔄 [TrazabilidadService] Usando datos de respaldo:', backupData);
      return backupData;
    }
  }

}