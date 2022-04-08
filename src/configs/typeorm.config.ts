import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const typeORMConfig: TypeOrmModuleOptions = {
  namingStrategy: new SnakeNamingStrategy(),
  type: 'mysql',
  synchronize: false,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  // port: Number(process.env.DATABASE_PORT),
  // database: String(process.env.DATABASE_SCHEMA),
  // username: String(process.env.DATABASE_USERNAME),
  // password: String(process.env.DATABASE_PASSWORD),
  // host: String(process.env.DATAB   ASE_HOST),
  port: 3306,
  database: 'REDACTED_DB_NAME',
  username: 'REDACTED_DB_USERNAME',
  password: 'REDACTED_DB_PASSWORD',
  host: 'REDACTED_RDS_HOST',
  timezone: 'Z',
};
