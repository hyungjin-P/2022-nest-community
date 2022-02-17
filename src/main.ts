import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fireAdmin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);

  // Enabled CORS
  app.enableCors();
  const port = configService.get('SERVER_PORT');

  // Swagger Option
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

  // firebase admin
  fireAdmin.initializeApp({
    credential: fireAdmin.credential.cert({
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
      projectId: serviceAccount.project_id,
    }),
  });

  // Server Port Logger
  Logger.log(`Application running on port ${port}`);
  await app.listen(port);
}
void bootstrap();
