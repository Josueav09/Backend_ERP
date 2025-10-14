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
const ejecutivas_controller_1 = require("./controllers/jefe/ejecutivas.controller");
const empresas_controller_1 = require("./controllers/jefe/empresas.controller");
const jefe_controller_1 = require("./controllers/jefe/jefe.controller");
const ejecutivas_service_1 = require("./services/jefe/ejecutivas.service");
const empresas_service_1 = require("./services/jefe/empresas.service");
const jefe_service_1 = require("./services/jefe/jefe.service");
const dashboard_controller_1 = require("./controllers/cliente/dashboard.controller");
const dashboard_service_1 = require("./services/cliente/dashboard.service");
const ejecutiva_controller_1 = require("./controllers/ejecutiva/ejecutiva.controller");
const ejecutiva_service_1 = require("./services/ejecutiva/ejecutiva.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [ejecutivas_controller_1.EjecutivasController, empresas_controller_1.EmpresasController, jefe_controller_1.JefeController, dashboard_controller_1.ClienteDashboardController, ejecutiva_controller_1.EjecutivaController],
        providers: [ejecutivas_service_1.EjecutivasService, empresas_service_1.EmpresasService, jefe_service_1.JefeService, dashboard_service_1.ClienteDashboardService, ejecutiva_service_1.EjecutivaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map