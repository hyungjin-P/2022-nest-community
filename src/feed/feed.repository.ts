import { EntityRepository, getManager, Repository } from 'typeorm';
import { Feed } from './feed.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@EntityRepository(Feed)
export class FeedRepository extends Repository<Feed> {
  async findByPage(options: IPaginationOptions): Promise<Pagination<any>> {
    const queryBuilder = await this.createQueryBuilder('feed')
      .select(
        'feed.id, feed.state, feed.content, feed.picture, feed.created_at',
      )
      .addSelect('writer.nickname, writer.email')
      .addSelect('writer_picture.url')
      .addSelect('pictures.url')
      .leftJoin('user', 'writer', 'writer.id = feed.user_id')
      .leftJoin(
        'user_picture',
        'writer_picture',
        'writer_picture.user_id = writer.id',
      )
      .leftJoin('feed_picture', 'pictures', 'feed.id = pictures.feed_id')
      .leftJoin('feed_tag', 'tags', 'feed.id = tags.feed_id')
      .orderBy('feed.created_at', 'DESC');

    // console.log(await queryBuilder.execute());

    return await paginate<any>(queryBuilder, options);
  }

  async findByPageTest(): Promise<Feed[]> {
    const queryBuilder = await this.createQueryBuilder('feed')
      .select(
        'feed.id, feed.state, feed.content, feed.picture, feed.created_at',
      )
      .addSelect('writer.nickname, writer.email')
      .addSelect('writer_picture.url')
      .addSelect('pictures.url')
      .addSelect('tags.name')
      .leftJoin('user', 'writer', 'writer.id = feed.user_id')
      .leftJoin(
        'user_picture',
        'writer_picture',
        'writer_picture.user_id = writer.id',
      )
      .leftJoin('feed_picture', 'pictures', 'feed.id = pictures.feed_id')
      .leftJoin('feed_tag', 'tags', 'feed.id = tags.feed_id')
      .orderBy('feed.created_at', 'DESC');

    // console.log(await queryBuilder.execute());

    return await queryBuilder.execute();
  }
}
