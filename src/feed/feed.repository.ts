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
  async findFeedPages(options: IPaginationOptions): Promise<Pagination<any>> {
    const queryBuilder = await getRepository(Feed)
      .createQueryBuilder('feed')
      .select(
        'feed.id, feed.state, feed.content, feed.picture, feed.created_at',
      )
      .addSelect('writer.nickname', 'writerNickname')
      .addSelect('writer.email', 'writerEmail')
      .addSelect('writer_picture.url', 'writerPictureUrl')
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
          .from(FeedComment, 'feed_comment')
          .where('feed_comment.feed_id = feed.id');
      }, 'commentCount')
      .orderBy('feed.created_at', 'DESC');

    return await paginateRaw<any>(queryBuilder, options);
  }

  async findFeedPage(feedId: string): Promise<any> {
    return await getRepository(Feed)
      .createQueryBuilder('feed')
      .leftJoinAndSelect('feed.writer', 'user')
      .leftJoinAndSelect('user.picture', 'user_picture')
      .leftJoinAndSelect('feed.pictures', 'feed_picture')
      .leftJoinAndSelect('feed.tags', 'feed_tag')
      .leftJoinAndSelect('feed.likeUsers', 'likeUsers')
      .limit(4)
      .leftJoinAndSelect('likeUsers.user', 'likeUser')
      .leftJoinAndSelect('likeUser.picture', 'likeUserPicture')
      .where('feed.id = :feedId', { feedId: feedId })
      .getMany();
  }
}
