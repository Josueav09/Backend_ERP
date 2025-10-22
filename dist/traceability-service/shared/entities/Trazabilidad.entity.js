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
exports.Trazabilidad = void 0;
const typeorm_1 = require("typeorm");
const Ejecutiva_entity_1 = require("./Ejecutiva.entity");
const EmpresaProveedora_entity_1 = require("./EmpresaProveedora.entity");
const ClienteFinal_entity_1 = require("./ClienteFinal.entity");
const PersonaContacto_entity_1 = require("./PersonaContacto.entity");
let Trazabilidad = class Trazabilidad {
};
exports.Trazabilidad = Trazabilidad;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Trazabilidad.prototype, "id_trazabilidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Trazabilidad.prototype, "id_ejecutiva", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Ejecutiva_entity_1.Ejecutiva, ejecutiva => ejecutiva.trazabilidades),
    (0, typeorm_1.JoinColumn)({ name: 'id_ejecutiva' }),
    __metadata("design:type", Ejecutiva_entity_1.Ejecutiva)
], Trazabilidad.prototype, "ejecutiva", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => EmpresaProveedora_entity_1.EmpresaProveedora, empresa => empresa.trazabilidades),
    (0, typeorm_1.JoinColumn)({ name: 'id_empresa_prov' }),
    __metadata("design:type", EmpresaProveedora_entity_1.EmpresaProveedora)
], Trazabilidad.prototype, "empresa_proveedora", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Trazabilidad.prototype, "id_cliente_final", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ClienteFinal_entity_1.ClienteFinal, cliente => cliente.trazabilidades),
    (0, typeorm_1.JoinColumn)({ name: 'id_cliente_final' }),
    __metadata("design:type", ClienteFinal_entity_1.ClienteFinal)
], Trazabilidad.prototype, "cliente_final", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PersonaContacto_entity_1.PersonaContacto, persona => persona.trazabilidades),
    (0, typeorm_1.JoinColumn)({ name: 'id_contacto' }),
    __metadata("design:type", PersonaContacto_entity_1.PersonaContacto)
], Trazabilidad.prototype, "persona_contacto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Trazabilidad.prototype, "fecha_agregado_base", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        enum: ['Llamada telefónica', 'Chat de Whatsapp', 'Correo electrónico', 'Contacto por linkedin', 'Reunión presencial', 'Otro']
    }),
    __metadata("design:type", String)
], Trazabilidad.prototype, "tipo_contacto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Trazabilidad.prototype, "fecha_contacto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Trazabilidad.prototype, "fecha_respuesta", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        enum: ['Positivo', 'Negativo', 'Pendiente', 'Neutro']
    }),
    __metadata("design:type", String)
], Trazabilidad.prototype, "resultado_contacto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Trazabilidad.prototype, "informacion_importante", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Trazabilidad.prototype, "reunion_agendada", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Trazabilidad.prototype, "fecha_reunion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Trazabilidad.prototype, "participantes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], Trazabilidad.prototype, "se_dio_reunion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Trazabilidad.prototype, "resultados_reunion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Trazabilidad.prototype, "pasa_embudo_ventas", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Trazabilidad.prototype, "fecha_inicio_etapa", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Trazabilidad.prototype, "nombre_oportunidad", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        nullable: true,
        enum: ['One-shot', 'Mensual', 'Proyecto', 'Otro']
    }),
    __metadata("design:type", String)
], Trazabilidad.prototype, "tipo_oportunidad", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        nullable: true,
        enum: [
            'Prospección', 'Calificación', 'Detección de necesidades', 'Presentación de solución',
            'Manejo de objeciones', 'Presentación de propuesta', 'Negociación', 'Firma de contrato',
            'Venta ganada', 'Venta perdida', 'Venta suspendida'
        ]
    }),
    __metadata("design:type", String)
], Trazabilidad.prototype, "etapa_oportunidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Trazabilidad.prototype, "producto_ofrecido", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Trazabilidad.prototype, "fecha_registro_oportunidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Trazabilidad.prototype, "fecha_cierre_esperado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Trazabilidad.prototype, "monto_total_sin_imp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Trazabilidad.prototype, "probabilidad_cierre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Trazabilidad.prototype, "monto_cierre_final", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Trazabilidad.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Trazabilidad.prototype, "fecha_creacion", void 0);
exports.Trazabilidad = Trazabilidad = __decorate([
    (0, typeorm_1.Entity)('trazabilidad')
], Trazabilidad);
//# sourceMappingURL=Trazabilidad.entity.js.map