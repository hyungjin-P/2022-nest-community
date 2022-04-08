import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MagazineTagRepository } from './magazine-tag.repository';

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
}
