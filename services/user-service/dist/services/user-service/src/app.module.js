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
const ejecutivas_controller_1 = require("./controllers/ejecutivas.controller");
const empresas_controller_1 = require("./controllers/empresas.controller");
const jefe_controller_1 = require("./controllers/jefe.controller");
const ejecutivas_service_1 = require("./services/ejecutivas.service");
const empresas_service_1 = require("./services/empresas.service");
const jefe_service_1 = require("./services/jefe.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [ejecutivas_controller_1.EjecutivasController, empresas_controller_1.EmpresasController, jefe_controller_1.JefeController],
        providers: [ejecutivas_service_1.EjecutivasService, empresas_service_1.EmpresasService, jefe_service_1.JefeService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map