import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedCommentRepository } from './feed-comment.repository';
import { FeedCommentController } from './feed-comment.controller';
import { FeedCommentService } from './feed-comment.service';
import { AuthModule } from '../../auth/auth.module';
import { FeedCommentMentionService } from './comment-mention/comment-mention.service';
import { FeedCommentMentionRepository } from './comment-mention/comment-mention.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FeedCommentRepository,
      FeedCommentMentionRepository,
    ]),
    AuthModule,
  ],
  controllers: [FeedCommentController],
  providers: [FeedCommentService, FeedCommentMentionService],
})
export class FeedCommentModule {}
