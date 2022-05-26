import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeCategoryModule } from './codes/code-category/code-category.module';
import { CodesModule } from './codes/codes.module';
import { UserModule } from './user/user.module';
import { FeedModule } from './feed/feed.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { MagazineModule } from './magazine/magazine.module';
// import { TypeOrmConfigService } from './configs/type-orm-config.service';
import { typeORMConfig } from './configs/typeorm.config';
import { AdminModule } from './admin/admin.module';

const stage = 'development';
// const stage = 'production';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/config/.env.${stage}`,
    }),
    // TypeOrmModule.forRootAsync({
    //   useClass: TypeOrmConfigService,
    // }),
    TypeOrmModule.forRoot(typeORMConfig),
    UserModule,
    FeedModule,
    FileModule,
    CodeCategoryModule,
    CodesModule,
    AuthModule,
    MagazineModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
