import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import AWS from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enabled CORS
  app.enableCors();

  // Server Config. Development or Production
  // const serverConfig = config.get('server');
  // const port = serverConfig.port;
  const port = 3001;

  // Swagger Option
  const options = new DocumentBuilder()
    .setTitle('Keeping User API')
    .setDescription('키핑 사용자 API')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  // AWS credentials setup
  AWS.config.update({
    accessKeyId: 'REDACTED_AWS_SES_ACCESS_KEY_ID',
    secretAccessKey: 'REDACTED_AWS_SES_SECRET_ACCESS_KEY',
    region: 'ap-northeast-2',
  });

  // Server Port Logger
  Logger.log(`Application running on port ${port}`);
  await app.listen(port);
}
bootstrap();
