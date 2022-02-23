import { EntityRepository, getRepository, Repository } from 'typeorm';
import { FeedTag } from './feed-tag.entity';

@EntityRepository(FeedTag)
export class FeedTagRepository extends Repository<FeedTag> {
  async getFeedTagInFeedIds(feedIds: string[]): Promise<FeedTag[]> {
    return await getRepository(FeedTag)
      .createQueryBuilder('feed-tag')
      .where('feed_id IN (:feedIds)', { feedIds })
      .getMany();
  }
}
