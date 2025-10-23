"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JefeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Jefe_entity_1 = require("../../../../../shared/entities/Jefe.entity");
const EmpresaProveedora_entity_1 = require("../../../../../shared/entities/EmpresaProveedora.entity");
const Ejecutiva_entity_1 = require("../../../../../shared/entities/Ejecutiva.entity");
const ClienteFinal_entity_1 = require("../../../../../shared/entities/ClienteFinal.entity");
const Trazabilidad_entity_1 = require("../../../../../shared/entities/Trazabilidad.entity");
let JefeService = class JefeService {
    constructor(jefeRepository, empresaRepository, ejecutivaRepository, clienteRepository, trazabilidadRepository) {
        this.jefeRepository = jefeRepository;
        this.empresaRepository = empresaRepository;
        this.ejecutivaRepository = ejecutivaRepository;
        this.clienteRepository = clienteRepository;
        this.trazabilidadRepository = trazabilidadRepository;
    }
    async getPerfil(userId) {
        console.log('🔐 [JefeService] === INICIANDO getPerfil ===');
        console.log('🔐 [JefeService] userId recibido:', userId);
        console.log('🔐 [JefeService] Tipo de userId:', typeof userId);
        try {
            console.log('🔐 [JefeService] jefeRepository:', this.jefeRepository ? 'DEFINIDO' : 'NO DEFINIDO');
            const todosJefes = await this.jefeRepository.find();
            console.log('🔐 [JefeService] Todos los jefes en BD:', todosJefes);
            console.log('🔐 [JefeService] Cantidad de jefes:', todosJefes.length);
            console.log('🔐 [JefeService] Buscando jefe con id_jefe:', userId);
            const jefe = await this.jefeRepository.findOne({
                where: { id_jefe: userId }
            });
            console.log('🔐 [JefeService] Resultado de findOne:', jefe);
            if (!jefe) {
                console.log('❌ [JefeService] Jefe NO encontrado para id:', userId);
                const jefeComoString = await this.jefeRepository.findOne({
                    where: { id_jefe: userId.toString() }
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
            const nombreParts = jefe.nombre_completo.split(' ');
            const perfilData = {
                id_jefe: jefe.id_jefe,
                dni: jefe.dni,
                nombre_completo: jefe.nombre_completo,
                email: jefe.correo,
                telefono: jefe.telefono,
                linkedin: jefe.linkedin,
                rol: jefe.rol,
                fecha_creacion: jefe.fecha_creacion,
                fecha_actualizacion: jefe.fecha_actualizacion
            };
            console.log('✅ [JefeService] Perfil formateado:', perfilData);
            return perfilData;
        }
        catch (error) {
            console.error('❌ [JefeService] ERROR en getPerfil:', error);
            console.error('❌ [JefeService] Stack trace:', error.stack);
            throw new common_1.HttpException('Error al obtener perfil del jefe', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updatePerfil(userId, data) {
        const { nombre_completo, telefono, linkedin } = data;
        const result = await this.jefeRepository.update({ id_jefe: userId }, {
            nombre_completo: nombre_completo,
            telefono: telefono,
            linkedin: linkedin,
            fecha_actualizacion: new Date()
        });
        if (result.affected === 0) {
            throw new common_1.HttpException('No se pudo actualizar el perfil', common_1.HttpStatus.BAD_REQUEST);
        }
        return await this.jefeRepository.findOne({ where: { id_jefe: userId } });
    }
    async updatePassword(userId, password_actual, password_nueva) {
        if (!password_actual || !password_nueva) {
            throw new common_1.HttpException('Contraseña actual y nueva son requeridas', common_1.HttpStatus.BAD_REQUEST);
        }
        const jefe = await this.jefeRepository.findOne({
            where: { id_jefe: userId }
        });
        if (!jefe) {
            throw new common_1.HttpException('Jefe no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        const bcrypt = require('bcryptjs');
        const isValidPassword = await bcrypt.compare(password_actual, jefe.contraseña);
        if (!isValidPassword) {
            throw new common_1.HttpException('Contraseña actual incorrecta', common_1.HttpStatus.UNAUTHORIZED);
        }
        const hashedPassword = await bcrypt.hash(password_nueva, 10);
        await this.jefeRepository.update({ id_jefe: userId }, {
            contraseña: hashedPassword,
            fecha_actualizacion: new Date()
        });
        return { message: "Contraseña actualizada exitosamente" };
    }
    async getStats() {
        try {
            console.log('📊 [JefeService] === INICIANDO getStats CON VISTAS ===');
            const [statsData, dashboardData, pipelineData, topEjecutivas, topEmpresas, topClientes] = await Promise.all([
                this.trazabilidadRepository.query('SELECT * FROM vista_dashboard_stats LIMIT 1'),
                this.trazabilidadRepository.query('SELECT * FROM vista_dashboard_ejecutiva'),
                this.trazabilidadRepository.query('SELECT * FROM vista_pipeline_ventas'),
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
            const stats = {
                totalEmpresas: vistaStats?.total_empresas || 0,
                totalEjecutivas: vistaStats?.total_ejecutivas || 0,
                totalClientes: vistaStats?.total_clientes || 0,
                clientesEsteMes: vistaStats?.clientes_este_mes || 0,
                revenueTotal: parseFloat(vistaStats?.revenue_total) || 0,
                pipelineOportunidades: vistaStats?.pipeline_oportunidades || 0,
                dashboardEjecutivas: dashboardData,
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
        }
        catch (error) {
            console.error('❌ [JefeService] ERROR en getStats:', error);
            return await this.getStatsFallback();
        }
    }
    async getStatsFallback() {
        console.log('🔄 [JefeService] Usando método de respaldo...');
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const [totalEmpresas, totalEjecutivas, totalClientes, actividadesMes] = await Promise.all([
            this.empresaRepository.count({ where: { estado: 'Activo' } }),
            this.ejecutivaRepository.count({ where: { estado_ejecutiva: 'Activo' } }),
            this.clienteRepository.count(),
            this.trazabilidadRepository.count({
                where: { fecha_contacto: (0, typeorm_2.MoreThanOrEqual)(startOfMonth) }
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
    calcularTasaConversion(dashboardData) {
        if (!dashboardData || !dashboardData.length)
            return '0%';
        try {
            const totalVentasGanadas = dashboardData.reduce((sum, item) => sum + (parseInt(item.ventas_ganadas) || 0), 0);
            const totalClientes = dashboardData.reduce((sum, item) => sum + (parseInt(item.total_clientes) || 0), 0);
            const tasa = totalClientes > 0
                ? ((totalVentasGanadas / totalClientes) * 100)
                : 0;
            return tasa.toFixed(1) + '%';
        }
        catch (error) {
            console.warn('⚠️ Error calculando tasa de conversión:', error);
            return '0%';
        }
    }
    async getClientesNuevosMes() {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        return await this.clienteRepository.count({
            where: {
                fecha_creacion: (0, typeorm_2.MoreThanOrEqual)(startOfMonth)
            }
        });
    }
    async getActividadesMes() {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        return await this.trazabilidadRepository.count({
            where: {
                fecha_contacto: (0, typeorm_2.MoreThanOrEqual)(startOfMonth)
            }
        });
    }
    async getClientes() {
        try {
            console.log('📋 [ClientesService] Obteniendo todos los clientes finales...');
            const clientes = await this.clienteRepository
                .createQueryBuilder('cf')
                .leftJoinAndSelect('cf.ejecutiva', 'ejecutiva')
                .leftJoinAndSelect('cf.empresaProveedora', 'empresa')
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
                'empresa.id_empresa_prov',
                'empresa.razon_social',
                'empresa.nombre_empresa'
            ])
                .addSelect('COUNT(trazabilidad.id_trazabilidad)', 'total_actividades')
                .groupBy('cf.id_cliente_final, ejecutiva.id_ejecutiva, ejecutiva.nombre_completo, empresa.id_empresa_prov, empresa.razon_social, empresa.nombre_empresa')
                .orderBy('cf.fecha_creacion', 'DESC')
                .getRawMany();
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
                id_empresa_prov: cliente.empresa_id_empresa_prov,
                empresa_nombre: cliente.empresa_razon_social || cliente.empresa_nombre_empresa,
                fecha_creacion: cliente.cf_fecha_creacion,
                fecha_actualizacion: cliente.cf_fecha_actualizacion,
                total_actividades: parseInt(cliente.total_actividades) || 0,
                estado: cliente.cf_estado || 'Activo'
            }));
            console.log(`✅ [ClientesService] ${clientesFormateados.length} clientes encontrados`);
            console.log('📊 Ejemplo de cliente:', clientesFormateados[0]);
            return clientesFormateados;
        }
        catch (error) {
            console.error('❌ [ClientesService] Error al obtener clientes:', error);
            throw new common_1.HttpException('Error al obtener clientes finales', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getClienteById(id) {
        try {
            console.log(`🔍 [JefeService] Buscando cliente con ID: ${id}`);
            const cliente = await this.clienteRepository.findOne({
                where: { id_cliente_final: id },
                relations: ['ejecutiva', 'ejecutiva.empresaProveedora']
            });
            if (!cliente) {
                throw new common_1.HttpException(`Cliente con ID ${id} no encontrado`, common_1.HttpStatus.NOT_FOUND);
            }
            console.log(`✅ [JefeService] Cliente encontrado: ${cliente.razon_social}`);
            return cliente;
        }
        catch (error) {
            console.error('❌ [JefeService] Error al obtener cliente:', error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener el cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createCliente(data) {
        try {
            console.log('➕ [JefeService] Creando nuevo cliente:', data.razon_social);
            if (!data.razon_social) {
                throw new common_1.HttpException('La razón social es obligatoria', common_1.HttpStatus.BAD_REQUEST);
            }
            if (!data.id_ejecutiva) {
                throw new common_1.HttpException('Debe asignar una ejecutiva', common_1.HttpStatus.BAD_REQUEST);
            }
            const ejecutiva = await this.ejecutivaRepository.findOne({
                where: { id_ejecutiva: data.id_ejecutiva }
            });
            if (!ejecutiva) {
                throw new common_1.HttpException('La ejecutiva seleccionada no existe', common_1.HttpStatus.BAD_REQUEST);
            }
            if (ejecutiva.estado_ejecutiva !== 'Activo') {
                throw new common_1.HttpException('La ejecutiva seleccionada no está activa', common_1.HttpStatus.BAD_REQUEST);
            }
            if (data.ruc) {
                const existeRuc = await this.clienteRepository.findOne({
                    where: { ruc: data.ruc }
                });
                if (existeRuc) {
                    throw new common_1.HttpException('Ya existe un cliente con ese RUC', common_1.HttpStatus.CONFLICT);
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
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            console.error('❌ [JefeService] Error al crear cliente:', error);
            throw new common_1.HttpException(error.message || 'Error al crear el cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateCliente(id, data) {
        try {
            console.log(`📝 [JefeService] Actualizando cliente ID: ${id}`);
            const cliente = await this.getClienteById(id);
            if (data.id_ejecutiva && data.id_ejecutiva !== cliente.ejecutiva.id_ejecutiva) {
                const ejecutiva = await this.ejecutivaRepository.findOne({
                    where: { id_ejecutiva: data.id_ejecutiva }
                });
                if (!ejecutiva) {
                    throw new common_1.HttpException('La ejecutiva seleccionada no existe', common_1.HttpStatus.BAD_REQUEST);
                }
                if (ejecutiva.estado_ejecutiva !== 'Activo') {
                    throw new common_1.HttpException('La ejecutiva seleccionada no está activa', common_1.HttpStatus.BAD_REQUEST);
                }
            }
            if (data.ruc && data.ruc !== cliente.ruc) {
                const existeRuc = await this.clienteRepository.findOne({
                    where: { ruc: data.ruc }
                });
                if (existeRuc && existeRuc.id_cliente_final !== id) {
                    throw new common_1.HttpException('Ya existe un cliente con ese RUC', common_1.HttpStatus.CONFLICT);
                }
            }
            const updateData = { fecha_actualizacion: new Date() };
            if (data.ruc !== undefined)
                updateData.ruc = data.ruc;
            if (data.razon_social)
                updateData.razon_social = data.razon_social;
            if (data.pagina_web !== undefined)
                updateData.pagina_web = data.pagina_web;
            if (data.correo !== undefined)
                updateData.correo = data.correo;
            if (data.telefono !== undefined)
                updateData.telefono = data.telefono;
            if (data.pais !== undefined)
                updateData.pais = data.pais;
            if (data.departamento !== undefined)
                updateData.departamento = data.departamento;
            if (data.provincia !== undefined)
                updateData.provincia = data.provincia;
            if (data.direccion !== undefined)
                updateData.direccion = data.direccion;
            if (data.linkedin !== undefined)
                updateData.linkedin = data.linkedin;
            if (data.grupo_economico !== undefined)
                updateData.grupo_economico = data.grupo_economico;
            if (data.rubro !== undefined)
                updateData.rubro = data.rubro;
            if (data.sub_rubro !== undefined)
                updateData.sub_rubro = data.sub_rubro;
            if (data.tamanio_empresa !== undefined)
                updateData.tamanio_empresa = data.tamanio_empresa;
            if (data.facturacion_anual !== undefined)
                updateData.facturacion_anual = data.facturacion_anual;
            if (data.cantidad_empleados !== undefined)
                updateData.cantidad_empleados = data.cantidad_empleados;
            if (data.logo !== undefined)
                updateData.logo = data.logo;
            await this.clienteRepository.update(id, updateData);
            const clienteActualizado = await this.getClienteById(id);
            console.log(`✅ [JefeService] Cliente actualizado: ${clienteActualizado.razon_social}`);
            return clienteActualizado;
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            console.error('❌ [JefeService] Error al actualizar cliente:', error);
            throw new common_1.HttpException('Error al actualizar el cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteCliente(id) {
        try {
            console.log(`🗑️ [JefeService] Eliminando cliente ID: ${id}`);
            const cliente = await this.getClienteById(id);
            await this.clienteRepository.delete(id);
            console.log(`✅ [JefeService] Cliente eliminado: ${cliente.razon_social}`);
            return { message: 'Cliente eliminado exitosamente' };
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            console.error('❌ [JefeService] Error al eliminar cliente:', error);
            throw new common_1.HttpException('Error al eliminar el cliente', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.JefeService = JefeService;
exports.JefeService = JefeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Jefe_entity_1.Jefe)),
    __param(1, (0, typeorm_1.InjectRepository)(EmpresaProveedora_entity_1.EmpresaProveedora)),
    __param(2, (0, typeorm_1.InjectRepository)(Ejecutiva_entity_1.Ejecutiva)),
    __param(3, (0, typeorm_1.InjectRepository)(ClienteFinal_entity_1.ClienteFinal)),
    __param(4, (0, typeorm_1.InjectRepository)(Trazabilidad_entity_1.Trazabilidad)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], JefeService);
//# sourceMappingURL=jefe.service.js.map