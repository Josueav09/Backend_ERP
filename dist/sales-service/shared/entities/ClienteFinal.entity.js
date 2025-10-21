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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteFinal = void 0;
const typeorm_1 = require("typeorm");
const Ejecutiva_entity_1 = require("./Ejecutiva.entity");
const PersonaContacto_entity_1 = require("./PersonaContacto.entity");
const Trazabilidad_entity_1 = require("./Trazabilidad.entity");
const EmpresaProveedora_entity_1 = require("./EmpresaProveedora.entity");
let ClienteFinal = class ClienteFinal {
};
exports.ClienteFinal = ClienteFinal;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ClienteFinal.prototype, "id_cliente_final", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], ClienteFinal.prototype, "ruc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ClienteFinal.prototype, "razon_social", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], ClienteFinal.prototype, "pagina_web", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], ClienteFinal.prototype, "correo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], ClienteFinal.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, default: 'Perú' }),
    __metadata("design:type", String)
], ClienteFinal.prototype, "pais", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ClienteFinal.prototype, "departamento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ClienteFinal.prototype, "provincia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ClienteFinal.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], ClienteFinal.prototype, "linkedin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], ClienteFinal.prototype, "grupo_economico", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ClienteFinal.prototype, "rubro", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ClienteFinal.prototype, "sub_rubro", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        nullable: true,
        enum: ['Pequeña', 'Mediana', 'Grande']
    }),
    __metadata("design:type", String)
], ClienteFinal.prototype, "tamanio_empresa", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], ClienteFinal.prototype, "facturacion_anual", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ClienteFinal.prototype, "cantidad_empleados", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], ClienteFinal.prototype, "logo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'Activo',
        enum: ['Activo', 'Inactivo']
    }),
    __metadata("design:type", String)
], ClienteFinal.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ClienteFinal.prototype, "id_empresa_prov", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => EmpresaProveedora_entity_1.EmpresaProveedora, empresa => empresa.clientes_finales),
    (0, typeorm_1.JoinColumn)({ name: 'id_empresa_prov' }),
    __metadata("design:type", EmpresaProveedora_entity_1.EmpresaProveedora)
], ClienteFinal.prototype, "empresa_proveedora", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ClienteFinal.prototype, "id_ejecutiva", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Ejecutiva_entity_1.Ejecutiva, ejecutiva => ejecutiva.clientes_finales),
    (0, typeorm_1.JoinColumn)({ name: 'id_ejecutiva' }),
    __metadata("design:type", Ejecutiva_entity_1.Ejecutiva)
], ClienteFinal.prototype, "ejecutiva", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PersonaContacto_entity_1.PersonaContacto, persona => persona.cliente_final),
    __metadata("design:type", Array)
], ClienteFinal.prototype, "personas_contacto", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Trazabilidad_entity_1.Trazabilidad, trazabilidad => trazabilidad.cliente_final),
    __metadata("design:type", Array)
], ClienteFinal.prototype, "trazabilidades", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ClienteFinal.prototype, "fecha_creacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ClienteFinal.prototype, "fecha_actualizacion", void 0);
exports.ClienteFinal = ClienteFinal = __decorate([
    (0, typeorm_1.Entity)('cliente_final')
], ClienteFinal);
//# sourceMappingURL=ClienteFinal.entity.js.map