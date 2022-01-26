import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { FeedController } from './feed/feed.controller';
import { FeedModule } from './feed/feed.module';
import { CodeCategoryModule } from './codes/code-category/code-category.module';
import { CodesModule } from './codes/codes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UserModule,
    FeedModule,
    CodeCategoryModule,
    CodesModule,
  ],
  controllers: [AppController, FeedController],
  providers: [AppService],
})
export class AppModule {}
