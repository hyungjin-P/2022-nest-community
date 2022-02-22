import { Module } from '@nestjs/common';
import { UserPictureController } from './user-picture.controller';
import { UserPictureService } from './user-picture.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPictureRepository } from './user-picture.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserPictureRepository])],
  controllers: [UserPictureController],
  providers: [UserPictureService],
})
export class UserPictureModule {}
