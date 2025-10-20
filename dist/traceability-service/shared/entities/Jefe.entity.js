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
exports.Jefe = void 0;
const typeorm_1 = require("typeorm");
const Ejecutiva_entity_1 = require("./Ejecutiva.entity");
let Jefe = class Jefe {
};
exports.Jefe = Jefe;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Jefe.prototype, "id_jefe", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], Jefe.prototype, "dni", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Jefe.prototype, "nombre_completo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], Jefe.prototype, "correo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Jefe.prototype, "contrase\u00F1a", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Jefe.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Jefe.prototype, "linkedin", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'Jefe',
        enum: ['Jefe', 'Administrador']
    }),
    __metadata("design:type", String)
], Jefe.prototype, "rol", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Jefe.prototype, "fecha_creacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Jefe.prototype, "fecha_actualizacion", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Ejecutiva_entity_1.Ejecutiva, ejecutiva => ejecutiva.jefe),
    __metadata("design:type", Array)
], Jefe.prototype, "ejecutivas", void 0);
exports.Jefe = Jefe = __decorate([
    (0, typeorm_1.Entity)('jefe')
], Jefe);
//# sourceMappingURL=Jefe.entity.js.map