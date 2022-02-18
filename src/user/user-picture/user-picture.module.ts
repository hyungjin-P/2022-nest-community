import { Module } from '@nestjs/common';
import { UserPictureController } from './user-picture.controller';
import { UserPictureService } from './user-picture.service';

@Module({
  controllers: [UserPictureController],
  providers: [UserPictureService]
})
export class UserPictureModule {}
