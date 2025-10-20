// import { DataSource } from 'typeorm';
// import { config } from 'dotenv';
// import * as path from 'path';

// config();

// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT || '5432'),
//   username: process.env.DB_USER || 'postgres',
//   password: process.env.DB_PASSWORD || 'josue12345',
//   database: process.env.DB_NAME || 'growviabd',
  
//   // Usar path.resolve en lugar de __dirname
//   entities: [
//     path.resolve(__dirname, '../**/*.entity{.ts,.js}'),
//     path.resolve(__dirname, '../../services/**/*.entity{.ts,.js}')
//   ],
  
//   migrations: [path.resolve(__dirname, '../migrations/*{.ts,.js}')],
//   synchronize: false,
//   logging: true,
//   migrationsTableName: 'migrations',
// });

// export default AppDataSource; 