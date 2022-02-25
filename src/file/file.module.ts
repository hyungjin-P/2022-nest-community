import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileRepository } from './file.repository';
import { FileTagRepository } from './file-tag.repository';
import { FeedPictureService } from '../feed/feed-picture/feed-picture.service';
import { FeedPictureRepository } from '../feed/feed-picture/feed-picture.repository';
import { UserBackgroundRepository } from '../user/user-background/user-background.repository';
import { UserBackgroundService } from '../user/user-background/user-background.service';
import { UserPictureRepository } from '../user/user-picture/user-picture.repository';
import { UserPictureService } from '../user/user-picture/user-picture.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FileRepository,
      FileTagRepository,
      FeedPictureRepository,
      UserBackgroundRepository,
      UserPictureRepository,
    ]),
  ],
  providers: [
    FileService,
    FeedPictureService,
    UserBackgroundService,
    UserPictureService,
  ],
  controllers: [FileController],
})
export class FileModule {}
