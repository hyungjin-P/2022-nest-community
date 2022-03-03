import { Injectable } from '@nestjs/common';
import { magazineRepository } from './magazine.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MagazineEntity } from './magazine.entity';
import { MagazineModifyDto } from './dto/magazine.modify.dto';
import { Feed } from '../feed/feed.entity';

@Injectable()
export class MagazineService {
  constructor(
    @InjectRepository(magazineRepository)
    private repository: magazineRepository,
  ) {}
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
