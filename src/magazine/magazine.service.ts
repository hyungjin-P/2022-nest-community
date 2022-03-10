import { Injectable } from '@nestjs/common';
import { MagazineRepository } from './magazineRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { MagazineEntity } from './magazine.entity';
import { MagazineModifyDto } from './dto/magazine.modify.dto';
import { Feed } from '../feed/feed.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { MagazineBookmarkEntity } from './magazine-bookmark/magazine-bookmark.entity';
import { MagazineBookmarkRepository } from './magazine-bookmark/magazine-bookmark.repository';

@Injectable()
export class MagazineService {
  constructor(
    @InjectRepository(MagazineRepository)
    private repository: MagazineRepository,
    private magazineBookmarkRepository: MagazineBookmarkRepository,
  ) {}

  async findByPageWithBookmark(
    options: IPaginationOptions,
    category: string,
    userId?: string,
  ): Promise<Pagination<any>> {
    let magazinePage: Pagination<any>;
    if (category === 'all') {
      magazinePage = await this.repository.findPagesAll(options);
    } else {
      magazinePage = await this.repository.findPages(options, category);
    }

    if (userId !== 'null' && magazinePage.items.length > 0) {
      //magazine bookmark checking
      const magazineIds: string[] = magazinePage.items.map((r) => r.id);

      const magazineBookmarks: MagazineBookmarkEntity[] =
        await this.magazineBookmarkRepository.findMagazineBookmarkOfUser(
          magazineIds,
          userId,
        );
      if (magazineBookmarks.length > 0) {
        magazinePage.items.forEach((magazine) => {
          const isBookmark = magazineBookmarks.filter(
            (magazineBookmark) => magazineBookmark.magazineId === magazine.id,
          ).length;
          magazine.isBookmark = isBookmark > 0;
        });
      }
    }

    return magazinePage;
  }

  async create(magazine: MagazineEntity) {
    let magazineRows: MagazineEntity = await this.repository.findOne({
      userId: magazine.userId,
      state: 'magazine_state_pending',
    });

    if (magazineRows !== undefined && magazine.rewrite === true) {
      await this.repository.delete({ id: magazineRows.id });
      magazineRows = undefined;
    }

    if (magazineRows === undefined) {
      magazineRows = await this.repository.save(magazine);
      console.log(magazineRows);
    }

    return magazineRows;
  }

  async modify(id: string, magazine: MagazineModifyDto) {
    const magazineRow: MagazineEntity = await this.repository.findOne({
      id: id,
    });
    if (magazine.content !== '') {
      magazineRow.content = magazine.content;
    }
    if (magazine.posting === true) {
      magazineRow.state = 'magazine_state_posting';
    }
    console.log(magazineRow);
    return await this.repository.save(magazineRow);
  }

  async delete(id: string) {
    const magazineRow: MagazineEntity = await this.repository.findOne({ id });
    magazineRow.deletedAt = new Date();

    await this.repository.save(magazineRow);
  }
}
