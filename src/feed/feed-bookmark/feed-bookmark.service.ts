import { Injectable } from '@nestjs/common';
import { FeedBookmarkRepository } from './feed-bookmark.repository';
import { FeedBookmarkDto } from '../dto/feed-bookmark.dto';
import { use } from 'passport';

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
   * @param feedId
   * @param userId
   */
  async deleteBookmark(feedBookmarkDto: FeedBookmarkDto): Promise<void> {
    await this.feedBookmarkRepository.delete({
      feedId: feedBookmarkDto.feedId,
      userId: feedBookmarkDto.userId,
    });
  }

  async deleteAllBookmark(userId: string) {
    return await this.feedBookmarkRepository.delete({ userId: userId });
  }
}
