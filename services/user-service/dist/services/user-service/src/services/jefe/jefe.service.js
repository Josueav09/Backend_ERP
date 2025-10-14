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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JefeService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../../shared/utils/database");
const bcrypt = __importStar(require("bcryptjs"));
let JefeService = class JefeService {
    constructor() {
        this.userId = 12;
    }
    async getPerfil() {
        const result = await database_1.sql.query(`SELECT 
         id_usuario,
         nombre,
         apellido,
         email,
         telefono,
         activo,
         fecha_creacion,
         ultima_conexion,
         intentos_fallidos,
         bloqueado_hasta,
         ip_bloqueada
       FROM usuarios
       WHERE id_usuario = $1 AND rol = 'jefe'`, [this.userId]);
        if (result.rows.length === 0) {
            throw new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return result.rows[0];
    }
    async updatePerfil(data) {
        const { nombre, apellido, email, telefono, activo, bloqueado_hasta, ip_bloqueada } = data;
        if (!nombre || !apellido || !email) {
            throw new common_1.HttpException('Nombre, apellido y email son requeridos', common_1.HttpStatus.BAD_REQUEST);
        }
        const result = await database_1.sql.query(`UPDATE usuarios
       SET 
         nombre = $1,
         apellido = $2,
         email = $3,
         telefono = $4,
         activo = $5,
         bloqueado_hasta = $6,
         ip_bloqueada = $7
       WHERE id_usuario = $8 AND rol = 'jefe'
       RETURNING *`, [nombre, apellido, email, telefono || null, activo ?? true, bloqueado_hasta || null, ip_bloqueada || null, this.userId]);
        if (result.rows.length === 0) {
            throw new common_1.HttpException('No se pudo actualizar el perfil', common_1.HttpStatus.BAD_REQUEST);
        }
        return { message: "Perfil actualizado exitosamente", usuario: result.rows[0] };
    }
    async updatePassword(password_actual, password_nueva) {
        if (!password_actual || !password_nueva) {
            throw new common_1.HttpException('Contraseña actual y nueva son requeridas', common_1.HttpStatus.BAD_REQUEST);
        }
        if (password_nueva.length < 6) {
            throw new common_1.HttpException('La contraseña debe tener al menos 6 caracteres', common_1.HttpStatus.BAD_REQUEST);
        }
        const userResult = await database_1.sql.query(`SELECT password_hash
       FROM usuarios
       WHERE id_usuario = $1 AND rol = 'jefe'`, [this.userId]);
        if (userResult.rows.length === 0) {
            throw new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        const currentHash = userResult.rows[0].password_hash;
        const isValidPassword = await bcrypt.compare(password_actual, currentHash);
        if (!isValidPassword) {
            throw new common_1.HttpException('Contraseña actual incorrecta', common_1.HttpStatus.UNAUTHORIZED);
        }
        const hashedPassword = await bcrypt.hash(password_nueva, 10);
        await database_1.sql.query(`UPDATE usuarios
       SET password_hash = $1
       WHERE id_usuario = $2 AND rol = 'jefe'`, [hashedPassword, this.userId]);
        return { message: "Contraseña actualizada exitosamente" };
    }
    async getStats() {
        const empresasResult = await database_1.sql.query('SELECT COUNT(*) as total FROM public.empresa_proveedora WHERE activo = true');
        const ejecutivasResult = await database_1.sql.query("SELECT COUNT(*) as total FROM public.usuarios WHERE rol = 'ejecutiva' AND activo = true");
        const clientesResult = await database_1.sql.query("SELECT COUNT(*) as total FROM public.cliente_empresa WHERE estado = 'activo'");
        const actividadesResult = await database_1.sql.query("SELECT COUNT(*) as total FROM public.trazabilidad WHERE fecha_actividad >= DATE_TRUNC('month', CURRENT_DATE)");
        const trazabilidadEstadoResult = await database_1.sql.query("SELECT estado, COUNT(*) as total FROM public.trazabilidad GROUP BY estado");
        const actividadesPorEjecutivaResult = await database_1.sql.query(`SELECT 
        u.nombre || ' ' || u.apellido as ejecutiva,
        COUNT(t.id_trazabilidad) as total_actividades
      FROM public.usuarios u
      LEFT JOIN public.trazabilidad t ON u.id_usuario = t.id_ejecutiva
      WHERE u.rol = 'ejecutiva' AND u.activo = true
      GROUP BY u.id_usuario, u.nombre, u.apellido
      ORDER BY total_actividades DESC
      LIMIT 5`);
        const clientesPorEmpresaResult = await database_1.sql.query(`SELECT 
        ep.nombre_empresa,
        COUNT(ce.id_cliente) as total_clientes
      FROM public.empresa_proveedora ep
      LEFT JOIN public.cliente_empresa ce ON ep.id_empresa = ce.id_empresa
      WHERE ep.activo = true
      GROUP BY ep.id_empresa, ep.nombre_empresa
      ORDER BY total_clientes DESC`);
        return {
            totalEmpresas: Number(empresasResult.rows[0].total),
            totalEjecutivas: Number(ejecutivasResult.rows[0].total),
            totalClientes: Number(clientesResult.rows[0].total),
            actividadesMes: Number(actividadesResult.rows[0].total),
            trazabilidadPorEstado: trazabilidadEstadoResult.rows,
            actividadesPorEjecutiva: actividadesPorEjecutivaResult.rows,
            clientesPorEmpresa: clientesPorEmpresaResult.rows,
        };
    }
};
exports.JefeService = JefeService;
exports.JefeService = JefeService = __decorate([
    (0, common_1.Injectable)()
], JefeService);
//# sourceMappingURL=jefe.service.js.map