import { Controller, DynamicModule, Get, Module, ModuleMetadata } from '@nestjs/common';
import { MODULE_METADATA } from '@nestjs/common/constants';
import { ApiExcludeController } from '@nestjs/swagger';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../app.module';
import { TypeOrmConfigService } from '../configs/type-orm-config.service';
import { egressLog } from './egress-guard';

// 원본 AppModule 의 구성을 그대로 쓰고 DB 연결 한 항목만 바꾼다.
// 원본은 접속 정보가 하드코딩된 configs/typeorm.config.ts 를 쓴다(app.module.ts:30).
// 목업은 원본에 이미 있는 env 기반 TypeOrmConfigService(app.module.ts:27-29 에서 주석 처리된 경로)로
// config/.env.development 의 로컬 MySQL 에 붙는다. AppModule 클래스 자체는 Nest 가 스캔하지 않는다.
const appImports = (Reflect.getMetadata(MODULE_METADATA.IMPORTS, AppModule) as ModuleMetadata['imports']).filter(
  (m) => (m as DynamicModule).module !== TypeOrmModule,
);

@ApiExcludeController()
@Controller('_mock')
export class MockController {
  @Get('egress')
  egress() {
    return egressLog;
  }
}

@Module({
  imports: [...appImports, TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService })],
  controllers: [...Reflect.getMetadata(MODULE_METADATA.CONTROLLERS, AppModule), MockController],
  providers: Reflect.getMetadata(MODULE_METADATA.PROVIDERS, AppModule),
})
export class MockAppModule {}
