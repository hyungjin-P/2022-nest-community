import { Injectable } from '@nestjs/common';
import { FeedTag } from './feed-tag.entity';
import { FeedTagRepository } from './feed-tag.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { IsNull } from 'typeorm';

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

  async getTagList(name: string) {
    // 공백 포함 검색 예시
    // select * from magazine_tag where name_en REGEXP 'DARK[[:space:]]?KNIGHT'
    // 공백 -> [[:space:]]?
    name = name.replace(' ', '[[:space:]]?');
    return await this.feedTagRepository.findTagList(name);
  }

  async getFeedListOverTag(options: IPaginationOptions, name: string) {
    const searchOptions: any = {
      relations: ['feed', 'feed.writer', 'feed.writer.picture', 'feed.tags'],
      where: {
        name: name,
        feed: {
          state: 'feed_state_posting',
          deletedAt: IsNull(),
        },
      },
    };

    const feedTagPage = await paginate<FeedTag>(
      this.feedTagRepository,
      options,
      searchOptions,
    );

    return feedTagPage;
  }
}
