import { Module } from '@nestjs/common';
import { ClientesController } from './controllers/jefe/clientes.controller';
import { ClientesService } from './services/jefe/clientes.service';

@Module({
  imports: [],
  controllers: [ClientesController],
  providers: [ClientesService],
})
export class AppModule {}