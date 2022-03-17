import { EntityRepository, getRepository, Repository } from 'typeorm';
import { FeedComment } from './feed-comment.entity';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@EntityRepository(FeedComment)
export class FeedCommentRepository extends Repository<FeedComment> {
  async findCommentPages(
    options: IPaginationOptions,
  ): Promise<Pagination<any>> {
    const queryBuilder = await getRepository(FeedComment)
      .createQueryBuilder('feed_comment')
      .select('*')
      .getRawMany();

    return undefined;
  }
}
