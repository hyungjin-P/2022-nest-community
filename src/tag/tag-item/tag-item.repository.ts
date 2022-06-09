import { EntityRepository, Repository } from 'typeorm';
import { TagItem } from './tag-item.entity';

@EntityRepository(TagItem)
export class TagItemRepository extends Repository<TagItem> {}
