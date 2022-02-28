import { Injectable } from '@nestjs/common';
import { magazineRepository } from './magazine.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MagazineEntity } from './magazine.entity';

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
}
