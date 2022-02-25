import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedRepository } from './feed.repository';
import { Feed } from './feed.entity';
import { FeedModifyDto } from './dto/feed.modify.dto';
import { FeedTagRepository } from './feed-tag/feed-tag.repository';
import { FeedPictureRepository } from './feed-picture/feed-picture.repository';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { FeedTag } from './feed-tag/feed-tag.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedRepository)
    private feedRepository: FeedRepository,
    private feedTagRepository: FeedTagRepository,
    private feedPictureRepository: FeedPictureRepository,
  ) {}

  async findByPage(options: IPaginationOptions): Promise<Pagination<any>> {
    const feedPage: Pagination<any> = await this.feedRepository.findFeedPages(
      options,
    );

    if (feedPage.items.length > 0) {
      const feedIds: string[] = feedPage.items.map((r) => r.id);
      const feedTags: FeedTag[] =
        await this.feedTagRepository.getFeedTagInFeedIds(feedIds);

      if (feedTags.length > 0) {
        feedPage.items.forEach((feed) => {
          feed.tags = feedTags.filter((feedTag) => feedTag.feedId === feed.id);
        });
      }
    }

    return feedPage;
  }

  async findByFeedId(id: string): Promise<Feed> {
    return await this.feedRepository.findOne({ id });
  }

  async createFeed(feed: Feed) {
    let feedRows: Feed = await this.feedRepository.findOne({
      userId: feed.userId,
    });

    // 피드 재생성 여부 확인
    if (feed.rewrite && feedRows !== undefined) {
      //생성된 피드 삭제
      await this.feedRepository.delete({ id: feedRows.id });
      feedRows = undefined;
    }

    if (feedRows === undefined) {
      await this.feedRepository.save(feed);
    }

    // 기존에 피드 있을 시, 해당 정보 리턴 작업
  }

  async modifyFeed(id: string, feedModifyDto: FeedModifyDto): Promise<Feed> {
    const feedRows: Feed = await this.feedRepository.findOne({ id });
    if (feedModifyDto.content !== '') {
      feedRows.content = feedModifyDto.content;
    }
    if (feedModifyDto.picture !== '') {
      feedRows.picture = feedModifyDto.picture;
    }

    if (feedModifyDto.posting) {
      feedRows.state = 'feed_state_posting';
    }
    return await this.feedRepository.save(feedRows);
  }

  async deleteFeed(id: string): Promise<void> {
    const feedRows: Feed = await this.feedRepository.findOne({ id });
    feedRows.deletedAt = new Date();

    await this.feedRepository.save(feedRows);
  }
}
