import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeORMConfig } from './configs/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeCategoryModule } from './codes/code-category/code-category.module';
import { CodesModule } from './codes/codes.module';
import { UserModule } from './user/user.module';
import { FeedModule } from './feed/feed.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UserModule,
    FeedModule,
    CodeCategoryModule,
    CodesModule,
    // AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
