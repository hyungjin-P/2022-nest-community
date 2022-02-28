import { EntityRepository, Repository } from 'typeorm';
import { magazineTagEntity } from './magazine-tag.entity';

@EntityRepository(magazineTagEntity)
export class magazineTagRepository extends Repository<magazineTagEntity> {}
