import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      namingStrategy: new SnakeNamingStrategy(),
      type: 'mysql',
      synchronize: false,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      timezone: 'Z',
      port: this.configService.get('DATABASE_PORT'),
      database: this.configService.get('DATABASE_SCHEMA'),
      username: this.configService.get('DATABASE_USERNAME'),
      password: this.configService.get('DATABASE_PASSWORD'),
      host: this.configService.get('DATABASE_HOST'),
    };
  }
}
