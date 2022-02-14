import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user.repository';
import { FileRepository } from './file.repository';
import { FileTagModule } from './file-tag/file-tag.module';

@Module({
  imports: [TypeOrmModule.forFeature([FileRepository]), FileTagModule],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
