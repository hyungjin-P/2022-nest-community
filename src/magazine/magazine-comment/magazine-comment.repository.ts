import { EntityRepository, Repository } from 'typeorm';
import { magazineCommentEntity } from './magazine-comment.entity';

@EntityRepository(magazineCommentEntity)
export class magazineCommentRepository extends Repository<magazineCommentEntity> {}
