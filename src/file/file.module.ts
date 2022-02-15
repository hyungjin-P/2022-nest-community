import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileRepository } from './file.repository';
import { FileTagRepository } from './file-tag.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FileRepository, FileTagRepository])],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
