import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedRepository } from './feed.repository';
import { PublicFeedController } from './public/public.feed.controller';
import { FeedTagRepository } from './feed-tag/feed-tag.repository';
import { FeedPictureRepository } from './feed-picture/feed-picture.repository';
import { FeedLikeRepository } from './feed-like/feed-like.repository';
import { FeedTagService } from './feed-tag/feed-tag.service';
import { FeedLikeService } from './feed-like/feed-like.service';
import { AuthModule } from '../auth/auth.module';
import { FeedCommentRepository } from './feed-comment/feed-comment.repository';
import { FeedBookmarkRepository } from './feed-bookmark/feed-bookmark.repository';
import { FeedBookmarkService } from './feed-bookmark/feed-bookmark.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FeedRepository,
      FeedTagRepository,
      FeedLikeRepository,
      FeedPictureRepository,
      FeedCommentRepository,
      FeedBookmarkRepository,
    ]),
    AuthModule,
  ],
  controllers: [FeedController, PublicFeedController],
  providers: [
    FeedService,
    FeedTagService,
    FeedLikeService,
    FeedBookmarkService,
  ],
})
export class FeedModule {}
