import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'josue12345',
  database: 'growviabd',
  
  // Usando __dirname con path.join (forma correcta)
  entities: [
    path.join(__dirname, '../**/*.entity{.ts,.js}'),
    path.join(__dirname, '../../services/**/*.entity{.ts,.js}')
  ],
  
  migrations: [path.join(__dirname, '../migrations/*{.ts,.js}')],
  
  synchronize: false,
  logging: true,
  migrationsTableName: 'migrations',
});

export default AppDataSource;