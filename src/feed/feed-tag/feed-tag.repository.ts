import { EntityRepository, getRepository, Repository } from 'typeorm';
import { FeedTag } from './feed-tag.entity';

@EntityRepository(FeedTag)
export class FeedTagRepository extends Repository<FeedTag> {
  /**
   * 피드의 태그 조회 (in query)
   * @param feedIds
   */
  async getFeedTagInFeedIds(feedIds: string[]): Promise<FeedTag[]> {
    return await getRepository(FeedTag)
      .createQueryBuilder('feed_tag')
      .where('feed_id IN (:feedIds)', { feedIds })
      .getMany();
  }
}
