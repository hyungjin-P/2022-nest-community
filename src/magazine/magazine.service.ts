import { Injectable } from '@nestjs/common';
import { MagazineRepository } from './magazine.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Magazine } from './magazine.entity';
import { MagazineModifyDto } from './dto/magazine.modify.dto';
import { Feed } from '../feed/feed.entity';
import {
  IPaginationOptions,
  paginate,
  paginateRawAndEntities,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { MagazineBookmarkEntity } from './magazine-bookmark/magazine-bookmark.entity';
import { MagazineBookmarkRepository } from './magazine-bookmark/magazine-bookmark.repository';
import { MagazineBodyKoRepository } from './magazine-body-ko/magazine-body-ko.repository';
import { MagazineBodyEnRepository } from './magazine-body-en/magazine-body-en.repository';
import { MagazineViewsService } from './magazine-views/magazine-views.service';

@Injectable()
export class MagazineService {
  constructor(
    @InjectRepository(MagazineRepository)
    private repository: MagazineRepository,
    private bodyKoRepository: MagazineBodyKoRepository,
    private bodyEnRepository: MagazineBodyEnRepository,
    private magazineBookmarkRepository: MagazineBookmarkRepository,

    private magazineViewService: MagazineViewsService,
  ) {}

  async findByPage(
    options: IPaginationOptions,
    category: string,
  ): Promise<Pagination<any>> {
    let magazinePage: Pagination<any>;
    if (category === 'all') {
      magazinePage = await this.repository.findPagesAll(options);
    } else {
      magazinePage = await this.repository.findPages(options, category);
    }

    if (magazinePage.items.length > 0) {
      for (const magazine of magazinePage.items) {
        magazine.viewCount = await this.magazineViewService.getCount(
          magazine.id,
        );
      }
    }

    return magazinePage;
  }

  async findByPageWithUserBehavior(
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

    if (magazinePage.items.length > 0) {
      //magazine bookmark checking
      const magazineIds: string[] = magazinePage.items.map((r) => r.id);

      const magazineBookmarks: MagazineBookmarkEntity[] =
        await this.magazineBookmarkRepository.findMagazineBookmarkOfUser(
          magazineIds,
          userId,
        );

      for (const magazine of magazinePage.items) {
        magazine.viewCount = await this.magazineViewService.getCount(
          magazine.id,
        );

        if (magazineBookmarks.length > 0) {
          const isBookmark = magazineBookmarks.filter(
            (magazineBookmark) => magazineBookmark.magazineId === magazine.id,
          ).length;
          magazine.isBookmark = isBookmark > 0;
        }
      }
    }

    return magazinePage;
  }

  async create(magazine: Magazine) {
    let magazineRows: Magazine = await this.repository.findOne({
      userId: magazine.userId,
      state: 'magazine_state_pending',
    });

    if (magazineRows !== undefined && magazine.rewrite === true) {
      await this.repository.delete({ id: magazineRows.id });
      magazineRows = undefined;
    }

    if (magazineRows === undefined) {
      magazineRows = await this.repository.save(magazine);
      await this.bodyKoRepository.save({ magazineId: magazineRows.id });
      await this.bodyEnRepository.save({ magazineId: magazineRows.id });
    }

    return magazineRows;
  }

  async modify(id: string, magazine: MagazineModifyDto) {
    const magazineRow: Magazine = await this.repository.findOne({
      id: id,
    });

    if (magazine.posting === true) {
      magazineRow.state = 'magazine_state_posting';
    }
    console.log(magazineRow);
    return await this.repository.save(magazineRow);
  }

  async delete(id: string) {
    const magazineRow: Magazine = await this.repository.findOne({ id });
    magazineRow.deletedAt = new Date();

    await this.repository.save(magazineRow);
  }
}
