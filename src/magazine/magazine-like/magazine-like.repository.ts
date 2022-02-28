import { EntityRepository, Repository } from 'typeorm';
import { magazineLikeEntity } from './magazine-like.entity';

@EntityRepository(magazineLikeEntity)
export class magazineLikeRepository extends Repository<magazineLikeEntity> {}
