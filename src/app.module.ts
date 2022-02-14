import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeORMConfig } from './configs/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { CodeCategoryModule } from './codes/code-category/code-category.module';
// import { CodesModule } from './codes/codes.module';
import { UserModule } from './user/user.module';
import { FeedModule } from './feed/feed.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: `${process.cwd()}/config/.env.${process.env.NODE_ENV}`,
      envFilePath: `${process.cwd()}/config/.env.development`,
    }),
    TypeOrmModule.forRoot(typeORMConfig),
    UserModule,
    FeedModule,
    // CodeCatexgoryModule,
    // CodesModule,
    // AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
