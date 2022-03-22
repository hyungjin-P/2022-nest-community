import { EntityRepository, Repository } from 'typeorm';
import { FeedCommentMention } from './comment-mention.entity';

@EntityRepository(FeedCommentMention)
export class FeedCommentMentionRepository extends Repository<FeedCommentMention> {}
