import { EntityRepository, Repository } from 'typeorm';
import { FeedComment } from './feed-comment.entity';

@EntityRepository(FeedComment)
export class FeedCommentRepository extends Repository<FeedComment> {}
