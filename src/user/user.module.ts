import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { CommonUtil } from '../utiles/common.util';
import { EmailService } from '../services/email/email.service';
import { FollowModule } from './follow/follow.module';
import { UserPictureModule } from './user-picture/user-picture.module';
import { UserBackgroundModule } from './user-background/user-background.module';
import { UserPictureRepository } from './user-picture/user-picture.repository';
import { UserBackgroundRepository } from './user-background/user-background.repository';
import { UserBackgroundService } from './user-background/user-background.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      UserPictureRepository,
      UserBackgroundRepository,
    ]),
    FollowModule,
    UserPictureModule,
    UserBackgroundModule,
  ],
  controllers: [UserController],
  providers: [UserService, CommonUtil, EmailService, UserBackgroundService],
})
export class UserModule {}
