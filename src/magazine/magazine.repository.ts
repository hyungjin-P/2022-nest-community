import { EntityRepository, Repository } from 'typeorm';
import { MagazineEntity } from './magazine.entity';

@EntityRepository(MagazineEntity)
export class magazineRepository extends Repository<MagazineEntity> {}
