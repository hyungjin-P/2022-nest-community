import { EntityRepository, Repository } from 'typeorm';
import { FeedTag } from './feed-tag.entity';

@EntityRepository(FeedTag)
export class FeedTagRepository extends Repository<FeedTag> {}
