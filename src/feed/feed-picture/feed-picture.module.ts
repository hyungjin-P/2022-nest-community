import { Module } from '@nestjs/common';
import { FeedPictureController } from './feed-picture.controller';
import { FeedPictureService } from './feed-picture.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedPictureRepository } from './feed-picture.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FeedPictureRepository])],
  controllers: [FeedPictureController],
  providers: [FeedPictureService],
})
export class FeedPictureModule {}
