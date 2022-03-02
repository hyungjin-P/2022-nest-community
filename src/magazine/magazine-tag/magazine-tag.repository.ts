import { EntityRepository, Repository } from 'typeorm';
import { MagazineTagEntity } from './magazine-tag.entity';

@EntityRepository(MagazineTagEntity)
export class MagazineTagRepository extends Repository<MagazineTagEntity> {}
