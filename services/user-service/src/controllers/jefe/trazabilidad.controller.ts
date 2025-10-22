import { Controller, Get, Query, Param, ParseIntPipe } from "@nestjs/common";
import { TrazabilidadService } from '../../services/jefe/trazabilidad.service';

@Controller("jefe/trazabilidad")
export class TrazabilidadController {
  constructor(private readonly trazabilidadService: TrazabilidadService) {
    console.log('✅ [TrazabilidadController] Controller inicializado - Rutas disponibles:');
    console.log('   GET /jefe/trazabilidad/kpis');
    console.log('   GET /jefe/trazabilidad/etapa1');
    console.log('   GET /jefe/trazabilidad/etapa2');
    console.log('   GET /jefe/trazabilidad/kpis/nuevos-clientes');
    console.log('   GET /jefe/trazabilidad/kpis/contactos-por-tipo');
    console.log('   GET /jefe/trazabilidad/kpis/montos-por-etapa');
    console.log('   GET /jefe/trazabilidad/kpis/tasa-conversion');
  }

  @Get("kpis")
  async getKPIs(
    @Query('ejecutivaId') ejecutivaId?: string,
    @Query('empresaId') empresaId?: string,
    @Query('clienteId') clienteId?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
  ) {
    console.log('📊 [TrazabilidadController.getKPIs] Llamado con parámetros:', {
      ejecutivaId,
      empresaId,
      clienteId,
      fechaDesde,
      fechaHasta
    });
    
    try {
      const result = await this.trazabilidadService.getKPIs({
        ejecutivaId: ejecutivaId ? parseInt(ejecutivaId) : undefined,
        empresaId: empresaId ? parseInt(empresaId) : undefined,
        clienteId: clienteId ? parseInt(clienteId) : undefined,
        fechaDesde,
        fechaHasta,
      });
      
      console.log('📊 [TrazabilidadController.getKPIs] Resultado:', result);
      return result;
    } catch (error) {
      console.error('❌ [TrazabilidadController.getKPIs] Error:', error);
      throw error;
    }
  }

  @Get("etapa1")
  async getEtapa1(
    @Query('ejecutivaId') ejecutivaId?: string,
    @Query('empresaId') empresaId?: string,
    @Query('clienteId') clienteId?: string,
    @Query('resultadoContacto') resultadoContacto?: string,
    @Query('tipoContacto') tipoContacto?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.trazabilidadService.getEtapa1({
      ejecutivaId: ejecutivaId ? parseInt(ejecutivaId) : undefined,
      empresaId: empresaId ? parseInt(empresaId) : undefined,
      clienteId: clienteId ? parseInt(clienteId) : undefined,
      resultadoContacto,
      tipoContacto,
      fechaDesde,
      fechaHasta,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get("etapa2")
  async getEtapa2(
    @Query('ejecutivaId') ejecutivaId?: string,
    @Query('empresaId') empresaId?: string,
    @Query('clienteId') clienteId?: string,
    @Query('etapaOportunidad') etapaOportunidad?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.trazabilidadService.getEtapa2({
      ejecutivaId: ejecutivaId ? parseInt(ejecutivaId) : undefined,
      empresaId: empresaId ? parseInt(empresaId) : undefined,
      clienteId: clienteId ? parseInt(clienteId) : undefined,
      etapaOportunidad,
      fechaDesde,
      fechaHasta,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get("kpis/nuevos-clientes")
  async getNuevosClientes(
    @Query('meses') meses?: string,
    @Query('ejecutivaId') ejecutivaId?: string
  ) {
    return this.trazabilidadService.getNuevosClientes(
      meses ? parseInt(meses) : 3,
      ejecutivaId ? parseInt(ejecutivaId) : undefined
    );
  }

  @Get("kpis/contactos-por-tipo")
  async getContactosPorTipo(
    @Query('ejecutivaId') ejecutivaId?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string
  ) {
    return this.trazabilidadService.getContactosPorTipo({
      ejecutivaId: ejecutivaId ? parseInt(ejecutivaId) : undefined,
      fechaDesde,
      fechaHasta,
    });
  }

  @Get("kpis/montos-por-etapa")
  async getMontosPorEtapa(
    @Query('ejecutivaId') ejecutivaId?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string
  ) {
    return this.trazabilidadService.getMontosPorEtapa({
      ejecutivaId: ejecutivaId ? parseInt(ejecutivaId) : undefined,
      fechaDesde,
      fechaHasta,
    });
  }

  @Get("kpis/tasa-conversion")
  async getTasaConversion(
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string
  ) {
    return this.trazabilidadService.getTasaConversion({
      fechaDesde,
      fechaHasta,
    });
  }

  @Get(":id")
  async getTrazabilidadDetail(@Param('id', ParseIntPipe) id: number) {
    return this.trazabilidadService.getTrazabilidadDetail(id);
  }

  @Get("test")
  async testEndpoint() {
    console.log('✅ [TrazabilidadController] Test endpoint llamado');
    return {
      message: "Trazabilidad endpoint funcionando correctamente",
      timestamp: new Date().toISOString(),
      endpoints: [
        '/jefe/trazabilidad/kpis',
        '/jefe/trazabilidad/etapa1', 
        '/jefe/trazabilidad/etapa2',
        '/jefe/trazabilidad/kpis/nuevos-clientes',
        '/jefe/trazabilidad/kpis/contactos-por-tipo',
        '/jefe/trazabilidad/kpis/montos-por-etapa',
        '/jefe/trazabilidad/kpis/tasa-conversion'
      ]
    };
  }
    @Get('filter-options')
    async getFilterOptions() {
      console.log('🔍 [TrazabilidadController] Obteniendo opciones de filtro...');
      
      try {
        const options = await this.trazabilidadService.getFilterOptions();
        console.log('✅ [TrazabilidadController] Opciones generadas:', options);
        return options;
      } catch (error) {
        console.error('❌ [TrazabilidadController] Error:', error);
        throw error;
      }
    }
}