import { Injectable } from '@nestjs/common';
import { MagazineBookmarkRepository } from './magazine-bookmark.repository';

@Injectable()
export class MagazineBookmarkService {
  constructor(private repository: MagazineBookmarkRepository) {}

  async createBookmark(magazineId: string, userId: string) {
    return await this.repository.save({ magazineId, userId });
  }

  async deleteBookmark(magazineId: string, userId: string) {
    return await this.repository.delete({ magazineId, userId });
  }
}
