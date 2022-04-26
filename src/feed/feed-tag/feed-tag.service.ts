import { Injectable } from '@nestjs/common';
import { FeedTag } from './feed-tag.entity';
import { FeedTagRepository } from './feed-tag.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

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
    return await this.feedTagRepository.findTagList(name);
  }

  async getFeedListOverTag(options: IPaginationOptions, name: string) {
    const searchOptions: any = {
      relations: ['feed', 'feed.writer', 'feed.writer.picture', 'feed.tags'],
      where: {
        name: name,
      },
    };

    const feedTagPage = await paginate<FeedTag>(
      this.feedTagRepository,
      options,
      searchOptions,
    );

    for (const [index, feedTag] of feedTagPage.items.entries()) {
      // 피드의 deleted_at이 null 이 아닐 때 배열에서 삭제
      if (!feedTag.feed) {
        feedTagPage.items.splice(index, 1);
      }
    }

    return feedTagPage;
  }
}
