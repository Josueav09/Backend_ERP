"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const audit_controller_1 = require("./controllers/audit.controller");
const trazabilidad_controller_1 = require("./controllers/trazabilidad.controller");
const audit_service_1 = require("./services/audit.service");
const trazabilidad_service_1 = require("./services/trazabilidad.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [audit_controller_1.AuditController, trazabilidad_controller_1.TrazabilidadController],
        providers: [audit_service_1.AuditService, trazabilidad_service_1.TrazabilidadService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map