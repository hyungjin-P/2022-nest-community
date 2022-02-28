import { EntityRepository, Repository } from 'typeorm';
import { magazinePictureEntity } from './magazine-picture.entity';

@EntityRepository(magazinePictureEntity)
export class magazinePictureRepository extends Repository<magazinePictureEntity> {}
