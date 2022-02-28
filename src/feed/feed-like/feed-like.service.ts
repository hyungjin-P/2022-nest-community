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

  /*
   * 좋아요 인원 찾기 - 페이징 형식으로 변경 해야함
   * */
  async findByFeedId(feedId: string): Promise<FeedLike[]> {
    return await this.feedLikeRepository.getFeedLikeWithUser(feedId);
  }
}
