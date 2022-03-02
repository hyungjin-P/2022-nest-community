import {
  EntityRepository,
  getManager,
  getRepository,
  Repository,
} from 'typeorm';
import { FeedLike } from './feed-like.entity';

@EntityRepository(FeedLike)
export class FeedLikeRepository extends Repository<FeedLike> {
  /**
   * 좋아요 조회
   * @param feedIds
   * @param userId
   */
  async findFeedLikeOfUser(
    feedIds: string[],
    userId: string,
  ): Promise<FeedLike[]> {
    // const feedLike: any[] = await
    return await getRepository(FeedLike)
      .createQueryBuilder('feed_like')
      .where('feed_id in (:feedIds) and user_id = :userId', {
        feedIds,
        userId,
      })
      .getMany();
  }
}
