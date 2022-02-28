import { EntityRepository, Repository } from 'typeorm';
import { magazineEntity } from './magazine.entity';

EntityRepository(magazineEntity);
export class magazineRepository extends Repository<magazineEntity> {}
