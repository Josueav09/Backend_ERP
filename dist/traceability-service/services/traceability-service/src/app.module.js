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
const audit_controller_1 = require("./controllers/jefe/audit.controller");
const trazabilidad_controller_1 = require("./controllers/jefe/trazabilidad.controller");
const audit_service_1 = require("./services/jefe/audit.service");
const trazabilidad_service_1 = require("./services/jefe/trazabilidad.service");
const traceability_controller_1 = require("./controllers/cliente/traceability.controller");
const traceability_service_1 = require("./services/cliente/traceability.service");
const ejecutiva_controller_1 = require("./controllers/ejecutiva/ejecutiva.controller");
const ejecutiva_service_1 = require("./services/ejecutiva/ejecutiva.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [audit_controller_1.AuditController, trazabilidad_controller_1.TrazabilidadController, traceability_controller_1.ClienteTrazabilidadController, ejecutiva_controller_1.EjecutivaTraceabilityController],
        providers: [audit_service_1.AuditService, trazabilidad_service_1.TrazabilidadService, traceability_service_1.ClienteTrazabilidadService, ejecutiva_service_1.EjecutivaTraceabilityService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map