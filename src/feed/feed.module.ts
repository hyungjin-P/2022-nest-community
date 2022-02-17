import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedRepository } from './feed.repository';
import { PublicFeedController } from './public/public.feed.controller';
import { FeedCommentModule } from './feed-comment/feed-comment.module';
import { FeedPictureModule } from './feed-picture/feed-picture.module';
import { FeedPictureController } from './feed-picture/feed-picture.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedRepository]),
    FeedCommentModule,
    FeedPictureModule,
    AuthModule,
  ],
  controllers: [FeedController, PublicFeedController, FeedPictureController],
  providers: [FeedService],
})
export class FeedModule {}
