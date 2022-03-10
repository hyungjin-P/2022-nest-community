import {
  EntityRepository,
  getRepository,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { MagazineEntity } from './magazine.entity';
import {
  IPaginationOptions,
  paginate,
  paginateRaw,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { FeedLike } from '../feed/feed-like/feed-like.entity';
import { MagazineLikeEntity } from './magazine-like/magazine-like.entity';

@EntityRepository(MagazineEntity)
export class MagazineRepository extends Repository<MagazineEntity> {
  //
  async findPages(
    options: IPaginationOptions,
    category: string,
  ): Promise<Pagination<any>> {
    const queryBuilder = await getRepository(MagazineEntity)
      .createQueryBuilder('magazine')
      .select(
        'magazine.id, magazine.state, magazine.category, magazine.title, magazine.content, magazine.picture, magazine.created_at',
      )
      .addSelect('writer.nickname', 'writerNickname')
      .addSelect('writer.email', 'writerEmail')
      .addSelect('writer_picture.url', 'writerPictureUrl')
      .leftJoin('user', 'writer', 'writer.id = magazine.user_id')
      .leftJoin(
        'user_picture',
        'writer_picture',
        'writer_picture.user_id = writer.id',
      )
      .addSelect((subQuery: SelectQueryBuilder<number>) => {
        return subQuery
          .select('COUNT(*)', 'likeCount')
          .from(MagazineLikeEntity, 'magazine_like')
          .where('magazine_like.magazine_id = magazine.id');
      }, 'likeCount')
      .where('category = :category', { category: category })
      .andWhere('state = :state', { state: 'magazine_state_posting' })
      .orderBy('magazine.created_at', 'DESC');

    return await paginateRaw<any>(queryBuilder, options);
  }

  async findPagesAll(options: IPaginationOptions): Promise<Pagination<any>> {
    const queryBuilder = await getRepository(MagazineEntity)
      .createQueryBuilder('magazine')
      .select(
        'magazine.id, magazine.state, magazine.category, magazine.title, magazine.content, magazine.picture, magazine.created_at',
      )
      .addSelect('writer.nickname', 'writerNickname')
      .addSelect('writer.email', 'writerEmail')
      .addSelect('writer_picture.url', 'writerPictureUrl')
      .leftJoin('user', 'writer', 'writer.id = magazine.user_id')
      .leftJoin(
        'user_picture',
        'writer_picture',
        'writer_picture.user_id = writer.id',
      )
      .addSelect((subQuery: SelectQueryBuilder<number>) => {
        return subQuery
          .select('COUNT(*)', 'likeCount')
          .from(MagazineLikeEntity, 'magazine_like')
          .where('magazine_like.magazine_id = magazine.id');
      }, 'likeCount')
      .where('magazine.state = :state', { state: 'magazine_state_posting' })
      .orderBy('magazine.created_at', 'DESC');

    return await paginateRaw<any>(queryBuilder, options);
  }
}
