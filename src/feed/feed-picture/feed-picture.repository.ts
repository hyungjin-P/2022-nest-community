import { EntityRepository, Repository } from 'typeorm';
import { FeedPicture } from './feed-picture.entity';

@EntityRepository(FeedPicture)
export class FeedPictureRepository extends Repository<FeedPicture> {}
