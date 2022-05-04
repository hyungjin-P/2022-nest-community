import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MagazineTagRepository } from './magazine-tag.repository';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { MagazineTagEntity } from './magazine-tag.entity';

@Injectable()
export class MagazineTagService {
  constructor(
    @InjectRepository(MagazineTagRepository)
    private repository: MagazineTagRepository,
  ) {}

  async createTag(magazineId: string, nameKo: string, nameEn: string) {
    return await this.repository.save({ magazineId, nameKo, nameEn });
  }

  async deleteTag(magazineId: string, tagId: string) {
    return await this.repository.delete({ magazineId: magazineId, id: tagId });
  }

  async getTagList(name: string) {
    // 공백 포함 검색 예시
    // select * from magazine_tag where name_en REGEXP 'DARK[[:space:]]?KNIGHT'
    // 공백 -> [[:space:]]?
    name = name.replace(' ', '[[:space:]]?');
    return await this.repository.findTagList(name);
  }

  async getMagazineListOverTag(
    options: IPaginationOptions,
    name: string,
  ): Promise<Pagination<MagazineTagEntity>> {
    const searchOptions: any = {
      relations: [
        'magazine',
        'magazine.en',
        'magazine.ko',
        'magazine.writer',
        'magazine.writer.picture',
        'magazine.tags',
      ],
      where: (qb) => {
        qb.where({
          name: name,
          magazine: {
            state: 'magazine_state_posting',
          },
        });
      },
    };

    const magazineTagPage = await paginate<MagazineTagEntity>(
      this.repository,
      options,
      searchOptions,
    );

    return magazineTagPage;
  }
}
