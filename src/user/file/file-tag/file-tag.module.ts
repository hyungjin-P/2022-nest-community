import { Module } from '@nestjs/common';
import { FileTagService } from './file-tag.service';
import { FileTagController } from './file-tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileTagRepository } from './file-tag.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FileTagRepository])],
  providers: [FileTagService],
  controllers: [FileTagController],
})
export class FileTagModule {}
