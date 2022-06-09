import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagItemRepository } from './tag-item/tag-item.repository';
import { MagazineTagService } from '../magazine/magazine-tag/magazine-tag.service';
import { MagazineTagRepository } from '../magazine/magazine-tag/magazine-tag.repository';
import { FeedTagService } from '../feed/feed-tag/feed-tag.service';
import { FeedTagRepository } from '../feed/feed-tag/feed-tag.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TagItemRepository,
      MagazineTagRepository,
      FeedTagRepository,
    ]),
  ],
  controllers: [TagController],
  providers: [TagService, MagazineTagService, FeedTagService],
})
export class TagModule {}
