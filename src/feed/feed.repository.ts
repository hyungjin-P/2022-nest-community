import { EntityRepository, Repository } from 'typeorm';
import { Feed } from './feed.entity';

@EntityRepository(Feed)
export class FeedRepository extends Repository<Feed> {}
