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
exports.Ejecutiva = void 0;
const typeorm_1 = require("typeorm");
const Jefe_entity_1 = require("./Jefe.entity");
const EmpresaProveedora_entity_1 = require("./EmpresaProveedora.entity");
const ClienteFinal_entity_1 = require("./ClienteFinal.entity");
const Trazabilidad_entity_1 = require("./Trazabilidad.entity");
let Ejecutiva = class Ejecutiva {
};
exports.Ejecutiva = Ejecutiva;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Ejecutiva.prototype, "id_ejecutiva", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], Ejecutiva.prototype, "dni", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Ejecutiva.prototype, "nombre_completo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], Ejecutiva.prototype, "correo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Ejecutiva.prototype, "contrase\u00F1a", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Ejecutiva.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Ejecutiva.prototype, "linkedin", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'Activo',
        enum: ['Activo', 'Inactivo', 'Suspendido']
    }),
    __metadata("design:type", String)
], Ejecutiva.prototype, "estado_ejecutiva", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Jefe_entity_1.Jefe, jefe => jefe.ejecutivas),
    (0, typeorm_1.JoinColumn)({ name: 'id_jefe' }),
    __metadata("design:type", Jefe_entity_1.Jefe)
], Ejecutiva.prototype, "jefe", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Ejecutiva.prototype, "id_empresa_prov", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => EmpresaProveedora_entity_1.EmpresaProveedora, empresa => empresa.ejecutivas, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_empresa_prov' }),
    __metadata("design:type", EmpresaProveedora_entity_1.EmpresaProveedora)
], Ejecutiva.prototype, "empresa_proveedora", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ClienteFinal_entity_1.ClienteFinal, cliente => cliente.ejecutiva),
    __metadata("design:type", Array)
], Ejecutiva.prototype, "clientes_finales", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Trazabilidad_entity_1.Trazabilidad, trazabilidad => trazabilidad.ejecutiva),
    __metadata("design:type", Array)
], Ejecutiva.prototype, "trazabilidades", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => EmpresaProveedora_entity_1.EmpresaProveedora, empresa => empresa.ejecutiva_registro),
    __metadata("design:type", Array)
], Ejecutiva.prototype, "empresas_registradas", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Ejecutiva.prototype, "fecha_creacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Ejecutiva.prototype, "fecha_actualizacion", void 0);
exports.Ejecutiva = Ejecutiva = __decorate([
    (0, typeorm_1.Entity)('ejecutiva')
], Ejecutiva);
//# sourceMappingURL=Ejecutiva.entity.js.map