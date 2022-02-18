import {
  EntityRepository,
  getConnection,
  getManager,
  getRepository,
  Repository,
} from 'typeorm';
import { FeedLike } from './feed-like.entity';
import { extend } from 'joi';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedPictureRepository } from '../feed-picture/feed-picture.repository';
import { Feed } from '../feed.entity';
import { User } from '../../user/user.entity';

@EntityRepository(FeedLike)
export class FeedLikeRepository extends Repository<FeedLike> {
  // async saveFeedLike(feedId: string, userId: string) {
  //   const feedLike = await getConnection()
  //     .createQueryBuilder()
  //     .insert()
  //     .into(FeedLike)
  //     .values([{ feedId: feedId, userId: userId }]);
  //
  //   const [sql, args] = feedLike.getQueryAndParameters();
  //   const nsql = sql.replace('INSERT INTO', 'INSERT IGNORE INTO');
  //
  //   const result = await getConnection().manager.query(nsql, args);
  //   return result;
  // }

  async getFeedLikeWithUser(feedId: string): Promise<any[]> {
    const feedLike: any[] = await getManager()
      .createQueryBuilder('feed_like', 'feedLike')
      .select('feedLike.feedId, feedLike.userId')
      .addSelect('user.nickname, user.email')
      .addSelect('picture.url')
      .leftJoin('user', 'user', 'feedLike.userId = user.id')
      .leftJoin('user_picture', 'picture', 'user.id = picture.user_id')
      .where('feedLike.feed_id = :feedId', { feedId: feedId })
      .getRawMany();

    return feedLike;
  }
}
