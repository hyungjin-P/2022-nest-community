import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagItemRepository } from './tag-item/tag-item.repository';
import { TagItem } from './tag-item/tag-item.entity';
import { MagazineTagService } from '../magazine/magazine-tag/magazine-tag.service';
import { FeedTagService } from '../feed/feed-tag/feed-tag.service';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagItemRepository)
    private repository: TagItemRepository,

    private magazineTagService: MagazineTagService,
    private feedTagService: FeedTagService,
  ) {}

  async getTagList(name: string) {
    // 공백 포함 검색 예시
    // select * from magazine_tag where name_en REGEXP 'DARK[[:space:]]?KNIGHT'
    // 공백 -> [[:space:]]?
    name = name.replace(' ', '[[:space:]]?');
    const tagItems: TagItem[] = await this.repository.find({
      where: (qb) => {
        qb.where(
          "REPLACE(name_ko, ' ', '') REGEXP :name OR REPLACE(name_en, ' ', '') REGEXP :name",
          { name: name },
        );
      },
    });

    // 태그를 사용한 게시물 카운트 (현재 매거진만)
    if (tagItems.length > 0) {
      for (const tag of tagItems) {
        tag.feedCount = await this.feedTagService.getTagCount(tag.id);
        tag.magazineCount = await this.magazineTagService.getTagCount(tag.id);
      }
    }

    return tagItems;
  }

  /* 관리자 영역 생성, 수정, 삭제 */
  async createTag(nameKo: string, nameEn: string) {
    return await this.repository.save({ nameKo, nameEn });
  }

  async modifyTag(tagId: string, nameKo: string, nameEn: string) {
    return await this.repository.save({
      id: tagId,
      nameKo: nameKo,
      nameEn: nameEn,
    });
  }

  async deleteTag(tagId: string) {
    return await this.repository.delete({ id: tagId });
  }
}
