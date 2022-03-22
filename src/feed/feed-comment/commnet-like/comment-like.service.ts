import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedCommentLikeRepository } from './comment-like.repository';

@Injectable()
export class FeedCommentLikeService {
  constructor(
    @InjectRepository(FeedCommentLikeRepository)
    private feedCommentLikeRepository: FeedCommentLikeRepository,
  ) {}
  async createLike(feedCommentId: string, userId: string): Promise<number> {
    await this.feedCommentLikeRepository.save({
      feedCommentId: feedCommentId,
      userId: userId,
    });
    return await this.getCount(feedCommentId);
  }

  async deleteLike(feedCommentId: string, userId: string): Promise<number> {
    await this.feedCommentLikeRepository.delete({
      feedCommentId: feedCommentId,
      userId: userId,
    });
    return await this.getCount(feedCommentId);
  }

  async getCount(feedCommentId: string): Promise<number> {
    return await this.feedCommentLikeRepository.count({
      feedCommentId: feedCommentId,
    });
  }
}
