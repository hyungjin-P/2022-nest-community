import {
  EntityRepository,
  getRepository,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Feed } from './feed.entity';
import {
  IPaginationOptions,
  paginateRaw,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { FeedPicture } from './feed-picture/feed-picture.entity';
import { FeedLike } from './feed-like/feed-like.entity';
import { FeedComment } from './feed-comment/feed-comment.entity';

@EntityRepository(Feed)
export class FeedRepository extends Repository<Feed> {
  async findByPage(options: IPaginationOptions): Promise<Pagination<Feed[]>> {
    const queryBuilder = await this.createQueryBuilder('feed')
      .select(
        'feed.id, feed.state, feed.content, feed.picture, feed.created_at',
      )
      .addSelect('writer.nickname, writer.email')
      .addSelect('writer_picture.url')
      .addSelect(
        '(SELECT COUNT(*) FROM feed_picture where feed_picture.feed_id = feed.id) AS pictureCount',
      )
      .addSelect(
        '(SELECT COUNT(*) FROM feed_like where feed_like.feed_id = feed.id) AS likeCount',
      )
      .addSelect(
        '(SELECT COUNT(*) FROM feed_comment where feed_comment.feed_id = feed.id) AS commentCount',
      )
      .leftJoin('user', 'writer', 'writer.id = feed.user_id')
      .leftJoin(
        'user_picture',
        'writer_picture',
        'writer_picture.user_id = writer.id',
      )
      .leftJoin('feed_picture', 'pictures', 'feed.id = pictures.feed_id')
      .leftJoin('feed_tag', 'tags', 'feed.id = tags.feed_id')
      .where('feed.state = "feed_state_posting"')
      .andWhere('feed.deleted_at IS NULL')
      .orderBy('feed.created_at', 'DESC');

    return await paginateRaw<any>(queryBuilder, options);
  }

  async findByPageReFactory(
    options: IPaginationOptions,
  ): Promise<Pagination<any>> {
    const queryBuilder = await getRepository(Feed)
      .createQueryBuilder('feed')
      .select(
        'feed.id, feed.state, feed.content, feed.picture, feed.created_at',
      )
      .addSelect('writer.nickname, writer.email')
      .addSelect('writer_picture.url')
      .leftJoin('user', 'writer', 'writer.id = feed.user_id')
      .leftJoin(
        'user_picture',
        'writer_picture',
        'writer_picture.user_id = writer.id',
      )
      .addSelect((subQuery: SelectQueryBuilder<number>) => {
        return subQuery
          .select('COUNT(*)', 'pictureCount')
          .from(FeedPicture, 'feed_picture')
          .where('feed_picture.feed_id = feed.id');
      }, 'pictureCount')
      .addSelect((subQuery: SelectQueryBuilder<number>) => {
        return subQuery
          .select('COUNT(*)', 'likeCount')
          .from(FeedLike, 'feed_like')
          .where('feed_like.feed_id = feed.id');
      }, 'likeCount')
      .addSelect((subQuery: SelectQueryBuilder<number>) => {
        return subQuery
          .select('COUNT(*)', 'commentCount')
          .from(FeedComment, 'feed_comment');
      }, 'commentCount')
      .orderBy('feed.created_at', 'DESC');

    return await paginateRaw<any>(queryBuilder, options);
  }
}
