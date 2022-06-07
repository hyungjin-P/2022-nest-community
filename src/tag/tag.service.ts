import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagItemRepository } from './tag-item/tag-item.repository';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagItemRepository)
    private repository: TagItemRepository,
  ) {}

  async getTagList(name: string) {
    // 공백 포함 검색 예시
    // select * from magazine_tag where name_en REGEXP 'DARK[[:space:]]?KNIGHT'
    // 공백 -> [[:space:]]?
    name = name.replace(' ', '[[:space:]]?');
    return await this.repository.findTagList(name);
  }
}
