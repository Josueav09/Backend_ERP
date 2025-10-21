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
const audit_controller_1 = require("./controllers/jefe/audit.controller");
const trazabilidad_controller_1 = require("./controllers/jefe/trazabilidad.controller");
const audit_service_1 = require("./services/jefe/audit.service");
const trazabilidad_service_1 = require("./services/jefe/trazabilidad.service");
const ejecutiva_controller_1 = require("./controllers/ejecutiva/ejecutiva.controller");
const ejecutiva_service_1 = require("./services/ejecutiva/ejecutiva.service");
const Trazabilidad_entity_1 = require("../../../shared/entities/Trazabilidad.entity");
const AuditoriaCambios_entity_1 = require("../../../shared/entities/AuditoriaCambios.entity");
const Ejecutiva_entity_1 = require("../../../shared/entities/Ejecutiva.entity");
const EmpresaProveedora_entity_1 = require("../../../shared/entities/EmpresaProveedora.entity");
const ClienteFinal_entity_1 = require("../../../shared/entities/ClienteFinal.entity");
const PersonaContacto_entity_1 = require("../../../shared/entities/PersonaContacto.entity");
const Jefe_entity_1 = require("../../../shared/entities/Jefe.entity");
const jwt_1 = require("@nestjs/jwt");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const jwt_strategy_1 = require("../../../shared/strategies/jwt.strategy");
const passport_1 = require("@nestjs/passport");
const envPath = path.join(process.cwd(), 'services/traceability-service/.env');
console.log('🔧 Loading env from:', envPath);
console.log('🔧 Env file exists:', fs.existsSync(envPath));
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'tu-super-secreto-cambiar-en-produccion-2024',
                    signOptions: { expiresIn: '24h' },
                }),
            }),
            typeorm_1.TypeOrmModule.forFeature([Jefe_entity_1.Jefe, EmpresaProveedora_entity_1.EmpresaProveedora, Ejecutiva_entity_1.Ejecutiva]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: envPath,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    console.log('🔧 Traceability Service DB Config:');
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
                            Trazabilidad_entity_1.Trazabilidad,
                            AuditoriaCambios_entity_1.AuditoriaCambios,
                            Ejecutiva_entity_1.Ejecutiva,
                            EmpresaProveedora_entity_1.EmpresaProveedora,
                            ClienteFinal_entity_1.ClienteFinal,
                            PersonaContacto_entity_1.PersonaContacto,
                            Jefe_entity_1.Jefe
                        ],
                        synchronize: false,
                        logging: configService.get('NODE_ENV') === 'development',
                    };
                },
            }),
            typeorm_1.TypeOrmModule.forFeature([
                Trazabilidad_entity_1.Trazabilidad,
                AuditoriaCambios_entity_1.AuditoriaCambios,
                Ejecutiva_entity_1.Ejecutiva,
                EmpresaProveedora_entity_1.EmpresaProveedora,
                ClienteFinal_entity_1.ClienteFinal,
                PersonaContacto_entity_1.PersonaContacto,
                Jefe_entity_1.Jefe
            ]),
        ],
        controllers: [
            audit_controller_1.AuditController,
            trazabilidad_controller_1.TrazabilidadController,
            ejecutiva_controller_1.EjecutivaTraceabilityController
        ],
        providers: [
            jwt_strategy_1.JwtStrategy,
            jwt_auth_guard_1.JwtAuthGuard,
            audit_service_1.AuditService,
            trazabilidad_service_1.TrazabilidadService,
            ejecutiva_service_1.EjecutivaTraceabilityService
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map