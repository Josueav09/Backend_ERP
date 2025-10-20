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
exports.AuditoriaCambios = void 0;
const typeorm_1 = require("typeorm");
const EmpresaProveedora_entity_1 = require("./EmpresaProveedora.entity");
const ClienteFinal_entity_1 = require("./ClienteFinal.entity");
const Ejecutiva_entity_1 = require("./Ejecutiva.entity");
let AuditoriaCambios = class AuditoriaCambios {
};
exports.AuditoriaCambios = AuditoriaCambios;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AuditoriaCambios.prototype, "id_auditoria", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => EmpresaProveedora_entity_1.EmpresaProveedora, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_empresa_proveedora' }),
    __metadata("design:type", EmpresaProveedora_entity_1.EmpresaProveedora)
], AuditoriaCambios.prototype, "empresa_proveedora", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ClienteFinal_entity_1.ClienteFinal, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_cliente_final' }),
    __metadata("design:type", ClienteFinal_entity_1.ClienteFinal)
], AuditoriaCambios.prototype, "cliente_final", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Ejecutiva_entity_1.Ejecutiva, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_ejecutiva' }),
    __metadata("design:type", Ejecutiva_entity_1.Ejecutiva)
], AuditoriaCambios.prototype, "ejecutiva", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], AuditoriaCambios.prototype, "accion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AuditoriaCambios.prototype, "detalles", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AuditoriaCambios.prototype, "fecha_accion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], AuditoriaCambios.prototype, "usuario_responsable", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], AuditoriaCambios.prototype, "estado_anterior", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], AuditoriaCambios.prototype, "estado_nuevo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AuditoriaCambios.prototype, "observaciones_adicionales", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        nullable: true,
        enum: [
            'Fin de contrato', 'Bajo rendimiento', 'Decision estratégica',
            'Incumplimiento', 'Mutuo acuerdo', 'Otro'
        ]
    }),
    __metadata("design:type", String)
], AuditoriaCambios.prototype, "motivo_desvinculacion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Ejecutiva_entity_1.Ejecutiva, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_ejecutiva_anterior' }),
    __metadata("design:type", Ejecutiva_entity_1.Ejecutiva)
], AuditoriaCambios.prototype, "ejecutiva_anterior", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Ejecutiva_entity_1.Ejecutiva, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_ejecutiva_nueva' }),
    __metadata("design:type", Ejecutiva_entity_1.Ejecutiva)
], AuditoriaCambios.prototype, "ejecutiva_nueva", void 0);
exports.AuditoriaCambios = AuditoriaCambios = __decorate([
    (0, typeorm_1.Entity)('auditoria_cambios')
], AuditoriaCambios);
//# sourceMappingURL=AuditoriaCambios.entity.js.map