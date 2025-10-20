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
exports.PersonaContacto = void 0;
const typeorm_1 = require("typeorm");
const ClienteFinal_entity_1 = require("./ClienteFinal.entity");
const Trazabilidad_entity_1 = require("./Trazabilidad.entity");
let PersonaContacto = class PersonaContacto {
};
exports.PersonaContacto = PersonaContacto;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PersonaContacto.prototype, "id_contacto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], PersonaContacto.prototype, "dni", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], PersonaContacto.prototype, "nombre_completo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], PersonaContacto.prototype, "cargo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], PersonaContacto.prototype, "correo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], PersonaContacto.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], PersonaContacto.prototype, "linkedin", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ClienteFinal_entity_1.ClienteFinal, cliente => cliente.personas_contacto),
    (0, typeorm_1.JoinColumn)({ name: 'id_cliente_final' }),
    __metadata("design:type", ClienteFinal_entity_1.ClienteFinal)
], PersonaContacto.prototype, "cliente_final", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Trazabilidad_entity_1.Trazabilidad, trazabilidad => trazabilidad.persona_contacto),
    __metadata("design:type", Array)
], PersonaContacto.prototype, "trazabilidades", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PersonaContacto.prototype, "fecha_creacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PersonaContacto.prototype, "fecha_actualizacion", void 0);
exports.PersonaContacto = PersonaContacto = __decorate([
    (0, typeorm_1.Entity)('persona_contacto')
], PersonaContacto);
//# sourceMappingURL=PersonaContacto.entity.js.map