import { EntityRepository, getRepository, Repository } from 'typeorm';
import { TagItem } from './tag-item.entity';

@EntityRepository(TagItem)
export class TagItemRepository extends Repository<TagItem> {
  async findTagList(name: string) {
    return await getRepository(TagItem)
      .createQueryBuilder('tag_item')
      .select('tag_item.name_en AS nameEn')
      .addSelect('tag_item.name_ko AS nameKo')
      .addSelect('COUNT(*) AS tagCount')
      .where(
        "REPLACE(tag_item.name_ko, ' ', '') REGEXP :name OR REPLACE(tag_item.name_en, ' ', '') REGEXP :name",
        {
          name: name,
        },
      )
      .groupBy('tag_item.id')
      .getRawMany();
  }
}
