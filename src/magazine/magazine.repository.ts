import {
  EntityRepository,
  getRepository,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Magazine } from './magazine.entity';
import {
  IPaginationOptions,
  paginate,
  paginateRaw,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { FeedLike } from '../feed/feed-like/feed-like.entity';
import { MagazineLikeEntity } from './magazine-like/magazine-like.entity';

@EntityRepository(Magazine)
export class MagazineRepository extends Repository<Magazine> {
  //
  async findPages(
    options: IPaginationOptions,
    category: string,
  ): Promise<Pagination<any>> {
    const queryBuilder = await getRepository(Magazine)
      .createQueryBuilder('magazine')
      .leftJoinAndSelect('magazine.en', 'en')
      .leftJoinAndSelect('magazine.ko', 'ko')
      .leftJoinAndSelect('magazine.writer', 'user')
      .leftJoinAndSelect('user.picture', 'userPicture')
      .where('category = :category', { category: category })
      .andWhere('state = :state', { state: 'magazine_state_posting' })
      .orderBy('magazine.created_at', 'DESC');

    return await paginate<Magazine>(queryBuilder, options);
  }

  async findPagesAll(options: IPaginationOptions): Promise<Pagination<any>> {
    const queryBuilder = await getRepository(Magazine)
      .createQueryBuilder('magazine')
      .leftJoinAndSelect('magazine.en', 'en')
      .leftJoinAndSelect('magazine.ko', 'ko')
      .leftJoinAndSelect('magazine.writer', 'user')
      .leftJoinAndSelect('user.picture', 'userPicture')
      .where('magazine.state = :state', { state: 'magazine_state_posting' })
      .orderBy('magazine.created_at', 'DESC');

    return await paginate<Magazine>(queryBuilder, options);
  }
}
