import { EntityRepository, getRepository, Repository } from 'typeorm';
import { FeedBookmark } from './feed-bookmark.entity';
import { FeedLike } from '../feed-like/feed-like.entity';

@EntityRepository(FeedBookmark)
export class FeedBookmarkRepository extends Repository<FeedBookmark> {
  async findFeedBookmarkOfUser(
    feedIds: string[],
    userId: string,
  ): Promise<FeedBookmark[]> {
    return await getRepository(FeedBookmark)
      .createQueryBuilder('feed_bookmark')
      .where('feed_id in (:feedIds) and user_id = :userId', {
        feedIds,
        userId,
      })
      .getMany();
  }
}
