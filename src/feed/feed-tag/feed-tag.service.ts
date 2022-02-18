import { Injectable } from '@nestjs/common';
import { FeedTag } from './feed-tag.entity';
import { FeedTagRepository } from './feed-tag.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FeedTagService {
  constructor(
    @InjectRepository(FeedTagRepository)
    private feedTagRepository: FeedTagRepository,
  ) {}

  async createFeedTag(feedId: string, name: string): Promise<FeedTag> {
    return await this.feedTagRepository.save({ feedId: feedId, name: name });
  }

  async deleteFeedTag(feedId: string, tagId: string) {
    return await this.feedTagRepository.delete({ feedId: feedId, id: tagId });
  }
}
