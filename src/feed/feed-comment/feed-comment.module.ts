import { Module } from '@nestjs/common';
import { FeedCommentController } from './feed-comment.controller';
import { FeedCommentService } from './feed-comment.service';

@Module({
  controllers: [FeedCommentController],
  providers: [FeedCommentService],
})
export class FeedCommentModule {}
