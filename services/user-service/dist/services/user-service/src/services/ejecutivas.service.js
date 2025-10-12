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
exports.EjecutivasService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../shared/utils/database");
const bcrypt = __importStar(require("bcryptjs"));
let EjecutivasService = class EjecutivasService {
    async getEjecutivas() {
        const result = await database_1.sql.query(`
      SELECT 
        u.*,
        COUNT(DISTINCT ee.id_empresa) as total_empresas,
        COUNT(DISTINCT ce.id_cliente) as total_clientes,
        COUNT(DISTINCT t.id_trazabilidad) as total_actividades
      FROM public.usuarios u
      LEFT JOIN public.empresa_ejecutiva ee ON u.id_usuario = ee.id_ejecutiva AND ee.activo = true
      LEFT JOIN public.cliente_empresa ce ON u.id_usuario = ce.id_ejecutiva
      LEFT JOIN public.trazabilidad t ON u.id_usuario = t.id_ejecutiva
      WHERE u.rol = 'ejecutiva'
      GROUP BY u.id_usuario
      ORDER BY u.activo DESC, u.nombre
    `);
        return result.rows;
    }
    async getEjecutivaById(id) {
        const result = await database_1.sql.query(`SELECT 
        id_usuario, nombre, apellido, email, telefono, rol, activo
      FROM public.usuarios 
      WHERE id_usuario = $1 AND rol = 'ejecutiva'`, [id]);
        if (result.rows.length === 0)
            return null;
        const ejecutiva = result.rows[0];
        const empresasResult = await database_1.sql.query(`SELECT 
        ep.id_empresa,
        ep.nombre_empresa,
        ep.rut,
        ee.fecha_asignacion,
        ee.activo as asignacion_activa
      FROM public.empresa_ejecutiva ee
      JOIN public.empresa_proveedora ep ON ee.id_empresa = ep.id_empresa
      WHERE ee.id_ejecutiva = $1
      ORDER BY ee.fecha_asignacion DESC`, [id]);
        const clientesResult = await database_1.sql.query(`SELECT 
        ce.id_cliente,
        ce.nombre_cliente,
        ce.rut_cliente,
        ce.email,
        ce.telefono,
        ce.estado,
        ep.nombre_empresa,
        ce.fecha_registro
      FROM public.cliente_empresa ce
      JOIN public.empresa_proveedora ep ON ce.id_empresa = ep.id_empresa
      WHERE ce.id_ejecutiva = $1
      ORDER BY ce.fecha_registro DESC`, [id]);
        return {
            ejecutiva,
            empresas: empresasResult.rows,
            clientes: clientesResult.rows,
        };
    }
    async createEjecutiva(data) {
        const { nombre, apellido, email, telefono, password } = data;
        const existingUser = await database_1.sql.query(`SELECT id_usuario FROM public.usuarios WHERE email = $1`, [email]);
        if (existingUser.rows.length > 0) {
            throw new common_1.HttpException('El email ya está registrado', common_1.HttpStatus.BAD_REQUEST);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await database_1.sql.query(`INSERT INTO public.usuarios 
        (nombre, apellido, email, telefono, password_hash, rol, activo)
      VALUES ($1, $2, $3, $4, $5, 'ejecutiva', true)
      RETURNING *`, [nombre, apellido, email, telefono || null, hashedPassword]);
        return result.rows[0];
    }
    async updateEjecutiva(id, data) {
        const { nombre, apellido, email, telefono, activo } = data;
        const result = await database_1.sql.query(`UPDATE public.usuarios 
       SET nombre = $1, apellido = $2, email = $3, telefono = $4, activo = $5
       WHERE id_usuario = $6 AND rol = 'ejecutiva'
       RETURNING *`, [nombre, apellido, email, telefono, activo, id]);
        return result.rows[0] || null;
    }
    async deleteEjecutiva(id) {
        const result = await database_1.sql.query(`UPDATE public.usuarios 
       SET activo = false
       WHERE id_usuario = $1 AND rol = 'ejecutiva'
       RETURNING *`, [id]);
        return result.rows[0] || null;
    }
};
exports.EjecutivasService = EjecutivasService;
exports.EjecutivasService = EjecutivasService = __decorate([
    (0, common_1.Injectable)()
], EjecutivasService);
//# sourceMappingURL=ejecutivas.service.js.map