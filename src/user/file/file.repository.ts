import { File } from './file.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(File)
export class FileRepository extends Repository<File> {}
