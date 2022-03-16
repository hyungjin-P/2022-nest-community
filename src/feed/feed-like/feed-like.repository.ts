import { EntityRepository, getRepository, Repository } from 'typeorm';
import { FeedLike } from './feed-like.entity';

@EntityRepository(FeedLike)
export class FeedLikeRepository extends Repository<FeedLike> {
  /**
   * 좋아요 조회
   * @param feedIds
   * @param userId
   */
  async findFeedLikeInFeedIdsOfUser(
    feedIds: string[],
    userId: string,
  ): Promise<FeedLike[]> {
    return await getRepository(FeedLike)
      .createQueryBuilder('feed_like')
      .where('feed_id in (:feedIds) and user_id = :userId', {
        feedIds,
        userId,
      })
      .getMany();
  }

  async findFeedLikeInFeedIdOfUser(
    feedId: string,
    userId: string,
  ): Promise<FeedLike[]> {
    return await getRepository(FeedLike)
      .createQueryBuilder('feed_like')
      .where('feed_id = :feedId and user_id = :userId', {
        feedId,
        userId,
      })
      .getMany();
  }
}
