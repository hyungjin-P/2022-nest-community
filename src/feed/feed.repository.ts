import { EntityRepository, getManager, Repository } from 'typeorm';
import { Feed } from './feed.entity';
import {
  IPaginationOptions,
  paginate,
  paginateRaw,
  Pagination,
} from 'nestjs-typeorm-paginate';

@EntityRepository(Feed)
export class FeedRepository extends Repository<Feed> {
  async findByPage(options: IPaginationOptions): Promise<Pagination<any[]>> {
    const queryBuilder = await this.createQueryBuilder('feed')
      .select(
        'feed.id, feed.state, feed.content, feed.picture, feed.created_at',
      )
      .addSelect('writer.nickname, writer.email')
      .addSelect('writer_picture.url')
      .leftJoinAndSelect('feed.tags', 'tags')
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
      .leftJoin('feed_like', 'likes', 'feed.id = likes.feed_id')
      .leftJoin('feed_comment', 'comments', 'feed.id = comments.feed_id')
      .groupBy('tags.name, feed.created_at')
      .orderBy('feed.created_at', 'DESC');

    console.log(queryBuilder.getSql());

    return await paginateRaw<any>(queryBuilder, options);
  }

  async findByPageTest(): Promise<Feed[]> {
    const queryBuilder = await this.createQueryBuilder('feed')
      .select(
        'feed.id, feed.state, feed.content, feed.picture, feed.created_at',
      )
      .addSelect('writer.nickname, writer.email')
      .addSelect('writer_picture.url')
      .addSelect('COUNT(pictures.url) AS pictureCount')
      .addSelect('tags.name')
      .addSelect('COUNT(likes.user_id) AS likeCount')
      .addSelect('COUNT(comments.id) AS commentCount')
      .leftJoin('user', 'writer', 'writer.id = feed.user_id')
      .leftJoin(
        'user_picture',
        'writer_picture',
        'writer_picture.user_id = writer.id',
      )
      .leftJoin('feed_picture', 'pictures', 'feed.id = pictures.feed_id')
      .leftJoin('feed_tag', 'tags', 'feed.id = tags.feed_id')
      .leftJoin('feed_like', 'likes', 'feed.id = likes.feed_id')
      .leftJoin('feed_comment', 'comments', 'feed.id = comments.feed_id')
      .orderBy('feed.created_at', 'DESC');

    // console.log(await queryBuilder.execute());
    console.log(queryBuilder.getSql());
    return await queryBuilder.execute();
  }
}
