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
exports.EmpresaProveedora = void 0;
const typeorm_1 = require("typeorm");
const Ejecutiva_entity_1 = require("./Ejecutiva.entity");
const Trazabilidad_entity_1 = require("./Trazabilidad.entity");
const ClienteFinal_entity_1 = require("./ClienteFinal.entity");
let EmpresaProveedora = class EmpresaProveedora {
};
exports.EmpresaProveedora = EmpresaProveedora;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], EmpresaProveedora.prototype, "id_empresa_prov", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], EmpresaProveedora.prototype, "ruc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], EmpresaProveedora.prototype, "razon_social", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], EmpresaProveedora.prototype, "pagina_web", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], EmpresaProveedora.prototype, "correo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], EmpresaProveedora.prototype, "contrase\u00F1a", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], EmpresaProveedora.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, default: 'Perú' }),
    __metadata("design:type", String)
], EmpresaProveedora.prototype, "pais", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], EmpresaProveedora.prototype, "departamento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], EmpresaProveedora.prototype, "provincia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], EmpresaProveedora.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], EmpresaProveedora.prototype, "linkedin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], EmpresaProveedora.prototype, "grupo_economico", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], EmpresaProveedora.prototype, "rubro", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], EmpresaProveedora.prototype, "sub_rubro", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        nullable: true,
        enum: ['Pequeña', 'Mediana', 'Grande']
    }),
    __metadata("design:type", String)
], EmpresaProveedora.prototype, "tamanio_empresa", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], EmpresaProveedora.prototype, "facturacion_anual", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], EmpresaProveedora.prototype, "cantidad_empleados", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], EmpresaProveedora.prototype, "logo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'Activo',
        enum: ['Activo', 'Inactivo']
    }),
    __metadata("design:type", String)
], EmpresaProveedora.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], EmpresaProveedora.prototype, "id_ejecutiva_registro", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Ejecutiva_entity_1.Ejecutiva, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_ejecutiva_registro' }),
    __metadata("design:type", Ejecutiva_entity_1.Ejecutiva)
], EmpresaProveedora.prototype, "ejecutiva_registro", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], EmpresaProveedora.prototype, "fecha_creacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], EmpresaProveedora.prototype, "fecha_actualizacion", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Ejecutiva_entity_1.Ejecutiva, ejecutiva => ejecutiva.empresa_proveedora),
    __metadata("design:type", Array)
], EmpresaProveedora.prototype, "ejecutivas", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Trazabilidad_entity_1.Trazabilidad, trazabilidad => trazabilidad.empresa_proveedora),
    __metadata("design:type", Array)
], EmpresaProveedora.prototype, "trazabilidades", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ClienteFinal_entity_1.ClienteFinal, clienteFinal => clienteFinal.empresa_proveedora),
    __metadata("design:type", Array)
], EmpresaProveedora.prototype, "clientes_finales", void 0);
exports.EmpresaProveedora = EmpresaProveedora = __decorate([
    (0, typeorm_1.Entity)('empresa_proveedora')
], EmpresaProveedora);
//# sourceMappingURL=EmpresaProveedora.entity.js.map