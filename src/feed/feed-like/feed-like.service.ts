import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedLikeRepository } from './feed-like.repository';
import { FeedLike } from './feed-like.entity';

@Injectable()
export class FeedLikeService {
  constructor(
    @InjectRepository(FeedLikeRepository)
    private feedLikeRepository: FeedLikeRepository,
  ) {}

  async createFeedLike(feedId: string, userId: string) {
    await this.feedLikeRepository.save({ feedId: feedId, userId: userId });
  }

  async deleteFeedLike(feedId: string, userId: string) {
    await this.feedLikeRepository.delete({ feedId: feedId, userId: userId });
  }

  async findByFeedId(feedId: string): Promise<any[]> {
    return await this.feedLikeRepository.getFeedLikeWithUser(feedId);
  }
}
