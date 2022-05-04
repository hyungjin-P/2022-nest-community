import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const typeORMConfig: TypeOrmModuleOptions = {
  namingStrategy: new SnakeNamingStrategy(),
  type: 'mysql',
  synchronize: false,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  timezone: 'Z',
  port: 3306,
  database: 'REDACTED_DB_NAME',

  /* product */
  username: 'REDACTED_DB_USERNAME',
  password: 'REDACTED_DB_PASSWORD',
  host: 'REDACTED_RDS_HOST',

  /* develop */
  // username: 'root',
  // password: 'root',
  // host: 'localhost',
};
