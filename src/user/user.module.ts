import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { CommonUtil } from '../utiles/common.util';
import { EmailService } from '../services/email/email.service';
import { FollowModule } from './follow/follow.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    FollowModule,
    FileModule,
  ],
  controllers: [UserController],
  providers: [UserService, CommonUtil, EmailService],
})
export class UserModule {}
