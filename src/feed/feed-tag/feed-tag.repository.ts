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

  // SELECT name, count(name)
  // from feed_tag where name like '%마블%'
  // group by name
  async findTagList(name: string) {
    return await getRepository(FeedTag)
      .createQueryBuilder('feed_tag')
      .select('feed_tag.name AS name')
      .addSelect('COUNT(*) AS tagCount')
      .where('feed_tag.name like :name', { name: '%' + name + '%' })
      .groupBy('feed_tag.name')
      .getRawMany();
  }
}
