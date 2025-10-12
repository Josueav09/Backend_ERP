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
exports.ClientesService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../shared/utils/database");
const bcrypt = __importStar(require("bcryptjs"));
let ClientesService = class ClientesService {
    async getClientes() {
        const result = await database_1.sql.query(`
      SELECT 
        ce.id_cliente,
        u_cliente.nombre AS nombre_cliente,
        u_cliente.apellido AS apellido_cliente,
        ce.rut_cliente,
        ce.email,
        ce.telefono,
        ce.direccion,
        ce.estado,
        ce.id_empresa,
        ce.id_ejecutiva,
        ep.nombre_empresa,
        COALESCE(u_ejecutiva.nombre || ' ' || u_ejecutiva.apellido, 'Sin asignar') AS ejecutiva_nombre,
        COUNT(t.id_trazabilidad) AS total_actividades
      FROM public.cliente_empresa ce
      JOIN public.empresa_proveedora ep ON ce.id_empresa = ep.id_empresa
      LEFT JOIN public.usuarios u_cliente ON ce.id_usuario_cliente = u_cliente.id_usuario
      LEFT JOIN public.usuarios u_ejecutiva ON ce.id_ejecutiva = u_ejecutiva.id_usuario
      LEFT JOIN public.trazabilidad t ON ce.id_cliente = t.id_cliente
      GROUP BY ce.id_cliente, u_cliente.nombre, u_cliente.apellido, ce.rut_cliente, ce.email, ce.telefono,
               ce.direccion, ce.estado, ce.id_empresa, ce.id_ejecutiva, ep.nombre_empresa,
               u_ejecutiva.nombre, u_ejecutiva.apellido
      ORDER BY CASE WHEN ce.estado = 'activo' THEN 0 ELSE 1 END, u_cliente.nombre
    `);
        return result.rows;
    }
    async getClienteById(id) {
        const result = await database_1.sql.query(`SELECT 
        ce.id_cliente,
        ce.nombre_cliente,
        ce.rut_cliente,
        ce.email,
        ce.telefono,
        ce.direccion,
        ce.estado,
        ce.id_empresa,
        ce.id_ejecutiva,
        ce.id_usuario_cliente,
        ep.nombre_empresa,
        COALESCE(u.nombre || ' ' || u.apellido, 'Sin asignar') AS ejecutiva_nombre,
        COUNT(t.id_trazabilidad) AS total_actividades
      FROM public.cliente_empresa ce
      JOIN public.empresa_proveedora ep ON ce.id_empresa = ep.id_empresa
      LEFT JOIN public.usuarios u ON ce.id_ejecutiva = u.id_usuario
      LEFT JOIN public.trazabilidad t ON ce.id_cliente = t.id_cliente
      WHERE ce.id_cliente = $1
      GROUP BY ce.id_cliente, ce.nombre_cliente, ce.rut_cliente, ce.email, ce.telefono, 
               ce.direccion, ce.estado, ce.id_empresa, 
               ce.id_ejecutiva, ce.id_usuario_cliente, ep.nombre_empresa, u.nombre, u.apellido`, [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0];
    }
    async createCliente(data) {
        const { nombre_cliente, apellido_cliente, rut_cliente, email_cliente, password, telefono_cliente, direccion_cliente, id_empresa, id_ejecutiva, } = data;
        if (!nombre_cliente || !apellido_cliente || !rut_cliente || !email_cliente || !password || !id_empresa) {
            throw new common_1.HttpException("Nombre, apellido, RUT, email, contraseña y empresa son campos requeridos", common_1.HttpStatus.BAD_REQUEST);
        }
        const existingRut = await database_1.sql.query("SELECT id_cliente FROM public.cliente_empresa WHERE rut_cliente = $1", [
            rut_cliente,
        ]);
        if (existingRut.rows.length > 0) {
            throw new common_1.HttpException("Ya existe un cliente con este RUT", common_1.HttpStatus.BAD_REQUEST);
        }
        const existingEmail = await database_1.sql.query("SELECT id_usuario FROM public.usuarios WHERE email = $1", [email_cliente]);
        if (existingEmail.rows.length > 0) {
            throw new common_1.HttpException("Ya existe un usuario con este email", common_1.HttpStatus.BAD_REQUEST);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userResult = await database_1.sql.query(`INSERT INTO public.usuarios (nombre, apellido, email, password_hash, rol, activo)
       VALUES ($1, $2, $3, $4, 'cliente', true) RETURNING id_usuario`, [nombre_cliente, apellido_cliente, email_cliente, hashedPassword]);
        const id_usuario_cliente = userResult.rows[0].id_usuario;
        const result = await database_1.sql.query(`INSERT INTO public.cliente_empresa 
       (nombre_cliente, rut_cliente, email, telefono, direccion, id_empresa, id_ejecutiva, id_usuario_cliente, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'activo') RETURNING *`, [
            `${nombre_cliente} ${apellido_cliente}`,
            rut_cliente,
            email_cliente,
            telefono_cliente || null,
            direccion_cliente || null,
            Number.parseInt(id_empresa),
            id_ejecutiva && id_ejecutiva !== "0" ? Number.parseInt(id_ejecutiva) : null,
            id_usuario_cliente,
        ]);
        return result.rows[0];
    }
    async updateCliente(id, data) {
        const { nombre_cliente, rut_cliente, email, telefono, direccion, id_empresa, id_ejecutiva, estado, password } = data;
        const clienteResult = await database_1.sql.query("SELECT id_usuario_cliente FROM public.cliente_empresa WHERE id_cliente = $1", [id]);
        if (clienteResult.rows.length === 0) {
            throw new common_1.HttpException("Cliente no encontrado", common_1.HttpStatus.NOT_FOUND);
        }
        const id_usuario_cliente = clienteResult.rows[0].id_usuario_cliente;
        if (rut_cliente) {
            const existingRut = await database_1.sql.query("SELECT id_cliente FROM public.cliente_empresa WHERE rut_cliente = $1 AND id_cliente != $2", [rut_cliente, id]);
            if (existingRut.rows.length > 0) {
                throw new common_1.HttpException("Ya existe otro cliente con este RUT", common_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (email) {
            const existingClient = await database_1.sql.query("SELECT id_cliente FROM public.cliente_empresa WHERE email = $1 AND id_cliente != $2", [email, id]);
            if (existingClient.rows.length > 0) {
                throw new common_1.HttpException("Ya existe otro cliente con este email", common_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            await database_1.sql.query("UPDATE public.usuarios SET password_hash = $1 WHERE id_usuario = $2", [
                hashedPassword,
                id_usuario_cliente,
            ]);
        }
        if (email) {
            await database_1.sql.query("UPDATE public.usuarios SET email = $1 WHERE id_usuario = $2", [email, id_usuario_cliente]);
        }
        const result = await database_1.sql.query(`UPDATE public.cliente_empresa 
       SET nombre_cliente = COALESCE($1, nombre_cliente),
           rut_cliente = COALESCE($2, rut_cliente),
           email = COALESCE($3, email),
           telefono = COALESCE($4, telefono),
           direccion = COALESCE($5, direccion),
           id_empresa = COALESCE($6, id_empresa),
           id_ejecutiva = COALESCE($7, id_ejecutiva),
           estado = COALESCE($8, estado)
       WHERE id_cliente = $9
       RETURNING *`, [nombre_cliente, rut_cliente, email, telefono, direccion, id_empresa, id_ejecutiva, estado, id]);
        if (result.rows.length === 0) {
            throw new common_1.HttpException("Cliente no encontrado", common_1.HttpStatus.NOT_FOUND);
        }
        return result.rows[0];
    }
    async deleteCliente(id) {
        const result = await database_1.sql.query("UPDATE public.cliente_empresa SET estado = 'inactivo' WHERE id_cliente = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            throw new common_1.HttpException("Cliente no encontrado", common_1.HttpStatus.NOT_FOUND);
        }
        return result.rows[0];
    }
};
exports.ClientesService = ClientesService;
exports.ClientesService = ClientesService = __decorate([
    (0, common_1.Injectable)()
], ClientesService);
//# sourceMappingURL=clientes.service.js.map