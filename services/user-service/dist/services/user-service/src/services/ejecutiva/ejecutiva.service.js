"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EjecutivaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Ejecutiva_entity_1 = require("../../../../../shared/entities/Ejecutiva.entity");
const EmpresaProveedora_entity_1 = require("../../../../../shared/entities/EmpresaProveedora.entity");
const ClienteFinal_entity_1 = require("../../../../../shared/entities/ClienteFinal.entity");
const Trazabilidad_entity_1 = require("../../../../../shared/entities/Trazabilidad.entity");
const PersonaContacto_entity_1 = require("../../../../../shared/entities/PersonaContacto.entity");
const csv_parser_1 = __importDefault(require("csv-parser"));
const stream = __importStar(require("stream"));
let EjecutivaService = class EjecutivaService {
    constructor(ejecutivaRepository, empresaRepository, clienteRepository, trazabilidadRepository, contactoRepository) {
        this.ejecutivaRepository = ejecutivaRepository;
        this.empresaRepository = empresaRepository;
        this.clienteRepository = clienteRepository;
        this.trazabilidadRepository = trazabilidadRepository;
        this.contactoRepository = contactoRepository;
    }
    async getStats(ejecutivaId) {
        try {
            const id = parseInt(ejecutivaId);
            const ejecutiva = await this.ejecutivaRepository.findOne({
                where: { id_ejecutiva: id, estado_ejecutiva: 'Activo' },
                relations: ['empresa_proveedora']
            });
            if (!ejecutiva) {
                throw new common_1.HttpException('Ejecutiva no encontrada', common_1.HttpStatus.NOT_FOUND);
            }
            const totalClientes = await this.clienteRepository.count({
                where: { ejecutiva: { id_ejecutiva: id } }
            });
            const actividadesMes = await this.trazabilidadRepository.count({
                where: {
                    ejecutiva: { id_ejecutiva: id },
                    fecha_contacto: (0, typeorm_2.MoreThanOrEqual)(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
                }
            });
            const revenueResult = await this.trazabilidadRepository
                .createQueryBuilder('t')
                .select('COALESCE(SUM(t.monto_cierre_final), 0)', 'revenue')
                .where('t.id_ejecutiva = :id', { id })
                .andWhere('t.etapa_oportunidad = :etapa', { etapa: 'Venta ganada' })
                .getRawOne();
            const pipelineCount = await this.trazabilidadRepository.count({
                where: {
                    ejecutiva: { id_ejecutiva: id },
                    etapa_oportunidad: (0, typeorm_2.Not)((0, typeorm_2.In)(['Venta ganada', 'Venta perdida', 'Venta suspendida'])),
                    nombre_oportunidad: (0, typeorm_2.Not)((0, typeorm_2.IsNull)())
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
        }
        catch (error) {
            console.error('Error en getStats:', error);
            throw new common_1.HttpException('Error al obtener estadísticas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmpresas(ejecutivaId) {
        try {
            const id = parseInt(ejecutivaId);
            const ejecutiva = await this.ejecutivaRepository.findOne({
                where: { id_ejecutiva: id },
                relations: ['empresa_proveedora']
            });
            if (!ejecutiva || !ejecutiva.empresa_proveedora) {
                return [];
            }
            const totalClientes = await this.clienteRepository.count({
                where: { ejecutiva: { id_ejecutiva: id } }
            });
            return [{
                    ...ejecutiva.empresa_proveedora,
                    total_clientes: totalClientes
                }];
        }
        catch (error) {
            console.error('Error en getEmpresas:', error);
            throw new common_1.HttpException('Error al obtener empresas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createEmpresa(data) {
        const id = parseInt(data.ejecutivaId);
        const ejecutiva = await this.ejecutivaRepository.findOne({
            where: { id_ejecutiva: id, estado_ejecutiva: 'Activo' }
        });
        if (!ejecutiva) {
            throw new common_1.HttpException('Ejecutiva no encontrada', common_1.HttpStatus.NOT_FOUND);
        }
        const existingRuc = await this.empresaRepository.findOne({
            where: { ruc: data.ruc }
        });
        if (existingRuc) {
            throw new common_1.HttpException('Ya existe una empresa con este RUC', common_1.HttpStatus.BAD_REQUEST);
        }
        const nuevaEmpresa = this.empresaRepository.create({
            ruc: data.ruc,
            razon_social: data.razon_social,
            pagina_web: data.pagina_web,
            correo: data.correo,
            contraseña: data.contraseña,
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
            estado: 'Inactivo',
            id_ejecutiva_registro: id
        });
        console.log('📝 Creando empresa en BD:', nuevaEmpresa);
        try {
            const empresaGuardada = await this.empresaRepository.save(nuevaEmpresa);
            console.log('✅ Empresa guardada en BD:', empresaGuardada);
            return empresaGuardada;
        }
        catch (error) {
            console.error('❌ Error al guardar empresa:', error);
            throw new common_1.HttpException('Error al guardar empresa en la base de datos', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmpresasRegistradas(ejecutivaId) {
        try {
            const id = parseInt(ejecutivaId);
            const empresas = await this.empresaRepository.find({
                where: { id_ejecutiva_registro: id },
                order: { fecha_creacion: 'DESC' }
            });
            const empresasConInfo = await Promise.all(empresas.map(async (empresa) => {
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
            }));
            return empresasConInfo;
        }
        catch (error) {
            console.error('Error en getEmpresasRegistradas:', error);
            throw new common_1.HttpException('Error al obtener empresas registradas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getClientes(ejecutivaId) {
        try {
            const id = parseInt(ejecutivaId);
            const clientes = await this.clienteRepository.find({
                where: { ejecutiva: { id_ejecutiva: id } },
                relations: ['personas_contacto', 'empresa_proveedora'],
                order: { razon_social: 'ASC' }
            });
            const clientesConStats = await Promise.all(clientes.map(async (cliente) => {
                const totalActividades = await this.trazabilidadRepository.count({
                    where: { cliente_final: { id_cliente_final: cliente.id_cliente_final } }
                });
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
            }));
            return clientesConStats;
        }
        catch (error) {
            console.error('Error en getClientes:', error);
            throw new common_1.HttpException('Error al obtener clientes', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createCliente(data) {
        try {
            const idEjecutiva = parseInt(data.ejecutivaId);
            const ejecutiva = await this.ejecutivaRepository.findOne({
                where: {
                    id_ejecutiva: idEjecutiva,
                    estado_ejecutiva: 'Activo'
                },
                relations: ['empresa_proveedora']
            });
            if (!ejecutiva) {
                throw new common_1.HttpException('Ejecutiva no encontrada', common_1.HttpStatus.NOT_FOUND);
            }
            if (!ejecutiva.empresa_proveedora) {
                throw new common_1.HttpException('La ejecutiva no tiene empresa asignada', common_1.HttpStatus.BAD_REQUEST);
            }
            const existingCliente = await this.clienteRepository.findOne({
                where: {
                    ruc: data.ruc,
                    empresa_proveedora: { id_empresa_prov: ejecutiva.empresa_proveedora.id_empresa_prov }
                }
            });
            if (existingCliente) {
                throw new common_1.HttpException('Ya existe un cliente con este RUC para esta empresa', common_1.HttpStatus.BAD_REQUEST);
            }
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
            console.log('📝 Creando cliente en BD:', nuevoCliente);
            return await this.clienteRepository.save(nuevoCliente);
        }
        catch (error) {
            console.error('Error en createCliente:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al crear cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createPersonaContacto(data) {
        try {
            const idEjecutiva = parseInt(data.ejecutivaId);
            const idCliente = parseInt(data.id_cliente_final);
            const cliente = await this.clienteRepository.findOne({
                where: {
                    id_cliente_final: idCliente,
                    ejecutiva: { id_ejecutiva: idEjecutiva }
                }
            });
            if (!cliente) {
                throw new common_1.HttpException('Cliente no encontrado o no autorizado', common_1.HttpStatus.NOT_FOUND);
            }
            const nuevoContacto = this.contactoRepository.create({
                dni: data.dni,
                nombre_completo: data.nombre_completo,
                cargo: data.cargo,
                correo: data.correo,
                telefono: data.telefono,
                linkedin: data.linkedin,
                cliente_final: cliente
            });
            console.log('📝 Creando contacto en BD:', nuevoContacto);
            return await this.contactoRepository.save(nuevoContacto);
        }
        catch (error) {
            console.error('Error en createPersonaContacto:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al crear contacto', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getContactosCliente(clienteId, ejecutivaId) {
        try {
            const idCliente = parseInt(clienteId);
            const idEjecutiva = parseInt(ejecutivaId);
            const cliente = await this.clienteRepository.findOne({
                where: {
                    id_cliente_final: idCliente,
                    ejecutiva: { id_ejecutiva: idEjecutiva }
                }
            });
            if (!cliente) {
                throw new common_1.HttpException('Cliente no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            return await this.contactoRepository.find({
                where: { cliente_final: { id_cliente_final: idCliente } },
                order: { nombre_completo: 'ASC' }
            });
        }
        catch (error) {
            console.error('Error en getContactosCliente:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener contactos', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPipeline(ejecutivaId) {
        try {
            const id = parseInt(ejecutivaId);
            const pipeline = await this.trazabilidadRepository.find({
                where: {
                    ejecutiva: { id_ejecutiva: id },
                    etapa_oportunidad: (0, typeorm_2.Not)((0, typeorm_2.In)(['Venta ganada', 'Venta perdida', 'Venta suspendida'])),
                    nombre_oportunidad: (0, typeorm_2.Not)((0, typeorm_2.IsNull)())
                },
                relations: ['cliente_final', 'persona_contacto', 'empresa_proveedora'],
                order: { fecha_cierre_esperado: 'ASC' }
            });
            const pipelinePorEtapa = pipeline.reduce((acc, oportunidad) => {
                const etapa = oportunidad.etapa_oportunidad || 'Sin etapa';
                if (!acc[etapa]) {
                    acc[etapa] = [];
                }
                acc[etapa].push(oportunidad);
                return acc;
            }, {});
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
        }
        catch (error) {
            console.error('Error en getPipeline:', error);
            throw new common_1.HttpException('Error al obtener pipeline', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getActividadesRecientes(ejecutivaId, limit = 10) {
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
        }
        catch (error) {
            console.error('Error en getActividadesRecientes:', error);
            throw new common_1.HttpException('Error al obtener actividades', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getKPIsSemanales(ejecutivaId) {
        try {
            const id = parseInt(ejecutivaId);
            const inicioSemana = new Date();
            inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
            const actividadesSemana = await this.trazabilidadRepository.count({
                where: {
                    ejecutiva: { id_ejecutiva: id },
                    fecha_contacto: (0, typeorm_2.MoreThanOrEqual)(inicioSemana)
                }
            });
            const nuevasOportunidades = await this.trazabilidadRepository.count({
                where: {
                    ejecutiva: { id_ejecutiva: id },
                    fecha_registro_oportunidad: (0, typeorm_2.MoreThanOrEqual)(inicioSemana),
                    nombre_oportunidad: (0, typeorm_2.Not)((0, typeorm_2.IsNull)())
                }
            });
            const reunionesAgendadas = await this.trazabilidadRepository.count({
                where: {
                    ejecutiva: { id_ejecutiva: id },
                    reunion_agendada: true,
                    fecha_reunion: (0, typeorm_2.MoreThanOrEqual)(inicioSemana)
                }
            });
            return {
                actividades_semana: actividadesSemana,
                nuevas_oportunidades: nuevasOportunidades,
                reuniones_agendadas: reunionesAgendadas,
                inicio_semana: inicioSemana
            };
        }
        catch (error) {
            console.error('Error en getKPIsSemanales:', error);
            throw new common_1.HttpException('Error al obtener KPIs semanales', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async bulkCreateClientes(file, ejecutivaId) {
        try {
            const idEjecutiva = parseInt(ejecutivaId);
            const ejecutiva = await this.ejecutivaRepository.findOne({
                where: {
                    id_ejecutiva: idEjecutiva,
                    estado_ejecutiva: 'Activo'
                },
                relations: ['empresa_proveedora']
            });
            if (!ejecutiva) {
                throw new common_1.HttpException('Ejecutiva no encontrada', common_1.HttpStatus.NOT_FOUND);
            }
            if (!ejecutiva.empresa_proveedora) {
                throw new common_1.HttpException('La ejecutiva no tiene empresa asignada', common_1.HttpStatus.BAD_REQUEST);
            }
            const clientesData = await this.parseCSVFile(file);
            if (clientesData.length === 0) {
                throw new common_1.HttpException('El archivo está vacío o no contiene datos válidos', common_1.HttpStatus.BAD_REQUEST);
            }
            const clientesValidos = this.validarClientesCSV(clientesData);
            if (clientesValidos.length === 0) {
                throw new common_1.HttpException('No se encontraron registros válidos en el archivo', common_1.HttpStatus.BAD_REQUEST);
            }
            const clientesSinDuplicados = await this.filtrarRUCsDuplicados(clientesValidos, ejecutiva.empresa_proveedora.id_empresa_prov);
            const clientesCreados = await this.crearClientesEnLote(clientesSinDuplicados, ejecutiva);
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
        }
        catch (error) {
            console.error('Error en bulkCreateClientes:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al procesar archivo de clientes', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async parseCSVFile(file) {
        return new Promise((resolve, reject) => {
            const results = [];
            try {
                const bufferStream = new stream.PassThrough();
                bufferStream.end(file.buffer);
                bufferStream
                    .pipe((0, csv_parser_1.default)())
                    .on('data', (data) => {
                    try {
                        const cleanData = {};
                        for (const [key, value] of Object.entries(data)) {
                            const cleanKey = key.toString().trim().toLowerCase();
                            const cleanValue = value ? value.toString().trim() : '';
                            cleanData[cleanKey] = cleanValue;
                        }
                        if (cleanData.razon_social && cleanData.ruc) {
                            results.push(cleanData);
                        }
                    }
                    catch (rowError) {
                        console.warn('Error procesando fila CSV:', rowError);
                    }
                })
                    .on('end', () => {
                    console.log(`✅ CSV parseado: ${results.length} registros válidos`);
                    resolve(results);
                })
                    .on('error', (error) => {
                    reject(new common_1.HttpException(`Error al leer el archivo CSV: ${error.message}`, common_1.HttpStatus.BAD_REQUEST));
                });
            }
            catch (error) {
                reject(new common_1.HttpException('Error al procesar archivo CSV', common_1.HttpStatus.BAD_REQUEST));
            }
        });
    }
    validarClientesCSV(clientesData) {
        return clientesData.filter(cliente => {
            const tieneCamposObligatorios = cliente.razon_social &&
                cliente.ruc &&
                cliente.direccion &&
                cliente.telefono &&
                cliente.correo;
            const rucValido = this.validarFormatoRUC(cliente.ruc);
            return tieneCamposObligatorios && rucValido;
        });
    }
    validarFormatoRUC(ruc) {
        if (!ruc)
            return false;
        const rucRegex = /^[0-9]{11}$/;
        return rucRegex.test(ruc.replace(/\D/g, ''));
    }
    async filtrarRUCsDuplicados(clientesData, idEmpresaProv) {
        const rucs = clientesData.map(c => c.ruc);
        const rucsEnArchivo = new Set();
        const clientesSinDuplicadosEnArchivo = clientesData.filter(cliente => {
            if (rucsEnArchivo.has(cliente.ruc)) {
                return false;
            }
            rucsEnArchivo.add(cliente.ruc);
            return true;
        });
        const existentes = await this.clienteRepository.find({
            where: {
                ruc: (0, typeorm_2.In)(rucs),
                empresa_proveedora: { id_empresa_prov: idEmpresaProv }
            },
            select: ['ruc']
        });
        const rucsExistentes = new Set(existentes.map(c => c.ruc));
        return clientesSinDuplicadosEnArchivo.filter(cliente => !rucsExistentes.has(cliente.ruc));
    }
    async crearClientesEnLote(clientesData, ejecutiva) {
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
        return await this.clienteRepository.save(clientesACrear);
    }
    async downloadPlantillaClientes() {
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
};
exports.EjecutivaService = EjecutivaService;
exports.EjecutivaService = EjecutivaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Ejecutiva_entity_1.Ejecutiva)),
    __param(1, (0, typeorm_1.InjectRepository)(EmpresaProveedora_entity_1.EmpresaProveedora)),
    __param(2, (0, typeorm_1.InjectRepository)(ClienteFinal_entity_1.ClienteFinal)),
    __param(3, (0, typeorm_1.InjectRepository)(Trazabilidad_entity_1.Trazabilidad)),
    __param(4, (0, typeorm_1.InjectRepository)(PersonaContacto_entity_1.PersonaContacto)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EjecutivaService);
//# sourceMappingURL=ejecutiva.service.js.map