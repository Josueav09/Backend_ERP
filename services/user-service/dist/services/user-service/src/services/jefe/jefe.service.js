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
            console.log('📊 Obteniendo estadísticas para jefe...');
            const [totalEmpresas, totalEjecutivas, totalClientes, clientesEsteMes, actividadesEsteMes, pipelineData, dashboardData] = await Promise.all([
                this.empresaRepository.count({ where: { estado: 'Activo' } }),
                this.ejecutivaRepository.count({ where: { estado_ejecutiva: 'Activo' } }),
                this.clienteRepository.count(),
                this.getClientesNuevosMes(),
                this.getActividadesMes(),
                this.trazabilidadRepository.query('SELECT * FROM vista_pipeline_ventas'),
                this.trazabilidadRepository.query('SELECT * FROM vista_dashboard_ejecutiva')
            ]);
            const revenueTotal = pipelineData.reduce((sum, item) => {
                return sum + (Number(item.monto_total_sin_imp) || 0);
            }, 0);
            const ventasGanadas = pipelineData.filter((item) => item.etapa_oportunidad === 'Venta ganada').length;
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
        }
        catch (error) {
            console.error('❌ Error en getStats:', error);
            throw new common_1.HttpException('Error al obtener estadísticas del sistema', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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