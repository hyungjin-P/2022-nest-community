import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagItemRepository } from './tag-item/tag-item.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TagItemRepository])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
