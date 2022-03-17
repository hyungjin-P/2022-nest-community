import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedCommentRepository } from './feed-comment.repository';
import { FeedCommentController } from './feed-comment.controller';
import { FeedCommentService } from './feed-comment.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([FeedCommentRepository]), AuthModule],
  controllers: [FeedCommentController],
  providers: [FeedCommentService],
})
export class FeedCommentModule {}
