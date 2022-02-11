import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enabled CORS
  app.enableCors();

  const port = parseInt(process.env.SERVER_PORT);

  // Swagger Option
  const options = new DocumentBuilder()
    .setTitle('Keeping User API')
    .setDescription('키핑 사용자 API')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  // Server Port Logger
  Logger.log(`Application running on port ${port}`);
  await app.listen(port);
}
bootstrap();
