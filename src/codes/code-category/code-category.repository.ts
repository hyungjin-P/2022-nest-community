import { EntityRepository, Repository } from 'typeorm';
import { CodeCategory } from './code-category.entity';

@EntityRepository(CodeCategory)
export class CodeCategoryRepository extends Repository<CodeCategory> {}
