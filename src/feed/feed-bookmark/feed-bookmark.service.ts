import { Injectable } from '@nestjs/common';
import { FeedBookmarkRepository } from './feed-bookmark.repository';
import { FeedBookmarkDto } from '../dto/feed-bookmark.dto';
import { use } from 'passport';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { FeedBookmark } from './feed-bookmark.entity';

@Injectable()
export class FeedBookmarkService {
  constructor(private feedBookmarkRepository: FeedBookmarkRepository) {}

  /**
   * 북마크 추가
   * @param feedBookmarkDto
   */
  async addBookmark(feedBookmarkDto: FeedBookmarkDto): Promise<void> {
    await this.feedBookmarkRepository.save({
      feedId: feedBookmarkDto.feedId,
      userId: feedBookmarkDto.userId,
    });
  }

  /**
   * 북마크 제거
   * @param feedBookmarkDto
   */
  async deleteBookmark(feedBookmarkDto: FeedBookmarkDto): Promise<void> {
    await this.feedBookmarkRepository.delete({
      feedId: feedBookmarkDto.feedId,
      userId: feedBookmarkDto.userId,
    });
  }

  /**
   * 사용자의 북마크 전체 삭제
   * @param userId
   */
  async deleteAllBookmarkOfUser(userId: string) {
    return await this.feedBookmarkRepository.delete({ userId });
  }

  /**
   * 피드의 북마크 전체 삭제
   * @param feedId
   */
  async deleteAllBookmarkOfFeed(feedId: string) {
    return await this.feedBookmarkRepository.delete({ feedId });
  }

  async getFeedListOverBookmark(options: IPaginationOptions, userId: string) {
    const searchOptions: any = {
      relations: ['feed', 'feed.writer', 'feed.writer.picture', 'feed.tags'],
      where: {
        userId: userId,
      },
    };

    const bookmarkCount = await this.feedBookmarkRepository.count({
      userId: userId,
    });

    const feedBookmarkPage = await paginate<FeedBookmark>(
      this.feedBookmarkRepository,
      options,
      searchOptions,
    );

    feedBookmarkPage.meta.totalCount = bookmarkCount;

    for (const feedBookmark of feedBookmarkPage.items) {
      feedBookmark.feed.isBookmark = true;
    }

    return feedBookmarkPage;
  }
}
