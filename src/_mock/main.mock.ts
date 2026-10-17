import './mock-env'; // 반드시 첫 import — AppModule 의 ConfigModule 보다 먼저 더미 설정을 넣는다
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { HttpService } from '@nestjs/axios';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import path from 'path';
import { installEgressGuard } from './egress-guard';
import { installFakeAws, MOCK_UPLOADS_DIR } from './fakes/aws';
import { installFakeFirebase } from './fakes/firebase';
import { socialApiAdapter } from './fakes/social-api';
import { MockAppModule } from './mock-app.module';

// 목업 진입점(npm run start:mock). 원본 main.ts 대신 기동한다.
// main.ts 와 다른 점: Firebase 서비스 계정 키를 읽지 않고(initializeApp 생략), 외부 SDK·API 를 로컬 fake 로 바꾼다.

async function bootstrap() {
  if (process.env.MOCK !== '1') {
    throw new Error('목업 진입점은 MOCK=1 일 때만 실행한다 (npm run start:mock).');
  }
  installEgressGuard();
  installFakeAws();
  installFakeFirebase();

  const app = await NestFactory.create<NestExpressApplication>(MockAppModule);
  const configService: ConfigService = app.get(ConfigService);

  app.get(HttpService, { strict: false }).axiosRef.defaults.adapter = socialApiAdapter;

  app.enableCors();
  const port = configService.get('SERVER_PORT');

  // Swagger — main.ts:19-34 와 같은 설정
  const options = new DocumentBuilder()
    .setTitle('Keeping User API')
    .setDescription('키핑 사용자 API')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'JWT',
        in: 'header',
      },
      'accessToken',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  // fixture 이미지와 업로드 파일(fake S3 저장소)
  app.useStaticAssets(path.join(process.cwd(), 'src', '_mock', 'assets'), { prefix: '/_mock/assets/' });
  app.useStaticAssets(MOCK_UPLOADS_DIR, { prefix: '/_mock/uploads/' });

  Logger.log(`[MOCK] Application running on port ${port} — http://localhost:${port}/api-docs`);
  await app.listen(port);
}
bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});
