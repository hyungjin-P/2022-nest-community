import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileRepository } from './file.repository';
import { FileTagRepository } from './file-tag.repository';
import { FeedPictureService } from '../feed/feed-picture/feed-picture.service';
import { FeedPictureRepository } from '../feed/feed-picture/feed-picture.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FileRepository,
      FileTagRepository,
      FeedPictureRepository,
    ]),
  ],
  providers: [FileService, FeedPictureService],
  controllers: [FileController],
})
export class FileModule {}
