import { Injectable } from '@nestjs/common';
import { FeedRepository } from './feed.repository';
import { Feed } from './feed.entity';
import { FeedModifyDto } from './dto/feed.modify.dto';
import { FeedTagRepository } from './feed-tag/feed-tag.repository';
import { FeedPictureRepository } from './feed-picture/feed-picture.repository';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { FeedTag } from './feed-tag/feed-tag.entity';
import { FeedLikeRepository } from './feed-like/feed-like.repository';
import { FeedLike } from './feed-like/feed-like.entity';
import { FeedBookmark } from './feed-bookmark/feed-bookmark.entity';
import { FeedBookmarkRepository } from './feed-bookmark/feed-bookmark.repository';

@Injectable()
export class FeedService {
  constructor(
    private feedRepository: FeedRepository,
    private feedTagRepository: FeedTagRepository,
    private feedPictureRepository: FeedPictureRepository,
    private feedLikeRepository: FeedLikeRepository,
    private feedBookmarkRepository: FeedBookmarkRepository,
  ) {}

  /**
   * 공개 피드 조회
   * @param options { page, limit }
   */
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

  /**
   * 피드 (로그인)
   * @param options { page, limit }
   * @param userId
   */
  async findByPageWithBookmarkAndLike(
    options: IPaginationOptions,
    userId: string,
  ): Promise<Pagination<any>> {
    const feedPage: Pagination<any> = await this.feedRepository.findFeedPages(
      options,
    );

    if (feedPage.items.length > 0) {
      const feedIds: string[] = feedPage.items.map((r) => r.id);
      const feedTags: FeedTag[] =
        await this.feedTagRepository.getFeedTagInFeedIds(feedIds);
      const feedLikes: FeedLike[] =
        await this.feedLikeRepository.findFeedLikeOfUser(feedIds, userId);
      const feedBookmarks: FeedBookmark[] =
        await this.feedBookmarkRepository.findFeedBookmarkOfUser(
          feedIds,
          userId,
        );

      if (feedTags.length > 0 || feedLikes.length > 0) {
        feedPage.items.forEach((feed) => {
          if (feedLikes.length > 0) {
            const isLike = feedLikes.filter(
              (feedLike) => feedLike.feedId === feed.id,
            ).length;
            feed.isLike = isLike > 0;
          }
          if (feedTags.length > 0) {
            feed.tags = feedTags.filter(
              (feedTag) => feedTag.feedId === feed.id,
            );
          }
          if (feedBookmarks.length > 0) {
            const isBookmark = feedBookmarks.filter(
              (feedBookmark) => feedBookmark.feedId === feed.id,
            ).length;
            feed.isBookmark = isBookmark > 0;
          }
        });
      }
    }

    console.log('findByPageWithBookmarkAndLike : ', feedPage);

    return feedPage;
  }

  /*
   * 상세 피드 조회 - 작업 중
   * 개인 로그인 피드 조회 - 유저별로 좋아요, 북마크 상태 추적 표시 추가해야함
   * */
  async findByFeedId(id: string): Promise<Feed> {
    return await this.feedRepository.findOne({ id });
  }

  /*
   * 피드생성 - 작업 중 중단
   * 기존 피드 있을 시, 해당 정보 리턴 해야함
   * */
  async createFeed(feed: Feed) {
    let feedRows: Feed = await this.feedRepository.findOne({
      userId: feed.userId,
      state: 'feed_state_pending',
    });

    // 피드 재생성 여부 확인
    if (feed.rewrite === true && feedRows !== undefined) {
      //생성된 피드 삭제
      await this.feedRepository.delete({ id: feedRows.id });
      feedRows = undefined;
    }

    if (feedRows === undefined) {
      await this.feedRepository.save(feed);
    }

    // 기존에 피드 있을 시, 해당 정보 리턴 작업
  }

  /*
   * 피드 수정 - 작업 완료
   * 현재 웹 반응 => 피드 글쓰기 완료 시, 업데이트
   * */
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

  /*
   * 피드 삭제 - 작업 완료
   * */
  async deleteFeed(id: string): Promise<void> {
    const feedRows: Feed = await this.feedRepository.findOne({ id });
    feedRows.deletedAt = new Date();

    await this.feedRepository.save(feedRows);
  }
}
