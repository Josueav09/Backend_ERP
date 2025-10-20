"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const clientes_controller_1 = require("./controllers/jefe/clientes.controller");
const clientes_service_1 = require("./services/jefe/clientes.service");
const ClienteFinal_entity_1 = require("../../../shared/entities/ClienteFinal.entity");
const Ejecutiva_entity_1 = require("../../../shared/entities/Ejecutiva.entity");
const EmpresaProveedora_entity_1 = require("../../../shared/entities/EmpresaProveedora.entity");
const PersonaContacto_entity_1 = require("../../../shared/entities/PersonaContacto.entity");
const Trazabilidad_entity_1 = require("../../../shared/entities/Trazabilidad.entity");
const Jefe_entity_1 = require("../../../shared/entities/Jefe.entity");
const envPath = path.join(process.cwd(), 'services/sales-service/.env');
console.log('🔧 Loading env from:', envPath);
console.log('🔧 Env file exists:', fs.existsSync(envPath));
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: envPath,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    console.log('🔧 Sales Service DB Config:');
                    console.log('DB_HOST:', configService.get('DB_HOST'));
                    console.log('DB_DATABASE:', configService.get('DB_DATABASE'));
                    console.log('DB_PASSWORD:', configService.get('DB_PASSWORD') ? '***' : 'undefined');
                    return {
                        type: 'postgres',
                        host: configService.get('DB_HOST'),
                        port: configService.get('DB_PORT') || 5432,
                        username: configService.get('DB_USERNAME'),
                        password: configService.get('DB_PASSWORD'),
                        database: configService.get('DB_DATABASE'),
                        entities: [
                            ClienteFinal_entity_1.ClienteFinal,
                            Ejecutiva_entity_1.Ejecutiva,
                            EmpresaProveedora_entity_1.EmpresaProveedora,
                            PersonaContacto_entity_1.PersonaContacto,
                            Trazabilidad_entity_1.Trazabilidad,
                            Jefe_entity_1.Jefe
                        ],
                        synchronize: false,
                        logging: configService.get('NODE_ENV') === 'development',
                    };
                },
            }),
            typeorm_1.TypeOrmModule.forFeature([
                ClienteFinal_entity_1.ClienteFinal,
                Ejecutiva_entity_1.Ejecutiva,
                EmpresaProveedora_entity_1.EmpresaProveedora,
                PersonaContacto_entity_1.PersonaContacto,
                Trazabilidad_entity_1.Trazabilidad,
                Jefe_entity_1.Jefe
            ]),
        ],
        controllers: [clientes_controller_1.ClientesController],
        providers: [clientes_service_1.ClientesService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map