import { EntityRepository, Repository } from 'typeorm';
import { CodeItem } from './code-item.entity';
import { CodeCategory } from '../code-category/code-category.entity';

@EntityRepository(CodeItem)
export class CodeItemRepository extends Repository<CodeItem> {}
