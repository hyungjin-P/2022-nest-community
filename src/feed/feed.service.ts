import { Injectable } from '@nestjs/common';
import { FeedRepository } from './feed.repository';
import { Feed } from './feed.entity';
import { FeedModifyDto } from './dto/feed.modify.dto';
import { FeedTagRepository } from './feed-tag/feed-tag.repository';
import { FeedPictureRepository } from './feed-picture/feed-picture.repository';
import {
  IPaginationOptions,
  paginateRawAndEntities,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { FeedTag } from './feed-tag/feed-tag.entity';
import { FeedLikeRepository } from './feed-like/feed-like.repository';
import { FeedLike } from './feed-like/feed-like.entity';
import { FeedBookmark } from './feed-bookmark/feed-bookmark.entity';
import { FeedBookmarkRepository } from './feed-bookmark/feed-bookmark.repository';
import { FeedLikeService } from './feed-like/feed-like.service';
import { FeedCommentService } from './feed-comment/feed-comment.service';
import { FollowService } from '../user/follow/follow.service';
import { Follow } from '../user/follow/follow.entity';
import { FileService } from '../file/file.service';
import { FileDeleteDto } from '../file/dto/file.delete.dto';
import { MypageFeedMainDto } from './dto/mypage-feed-main.dto';

@Injectable()
export class FeedService {
  constructor(
    private feedRepository: FeedRepository,
    private feedTagRepository: FeedTagRepository,
    private feedPictureRepository: FeedPictureRepository,
    private feedLikeRepository: FeedLikeRepository,
    private feedBookmarkRepository: FeedBookmarkRepository,
    private feedLikeService: FeedLikeService,
    private feedCommentService: FeedCommentService,
    private fileService: FileService,
    private followService: FollowService,
  ) {}

  /**
   * 공개 피드 페이지 형식 조회
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
  async findByPageWithUserBehavior(
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
        await this.feedLikeRepository.findFeedLikeInFeedIdsOfUser(
          feedIds,
          userId,
        );
      const feedBookmarks: FeedBookmark[] =
        await this.feedBookmarkRepository.findFeedBookmarkInFeedIdsOfUser(
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

    // console.log('findByPageWithBookmarkAndLike : ', feedPage);

    return feedPage;
  }

  async findByPageOverFollow(
    options: IPaginationOptions,
    userId: string,
  ): Promise<Pagination<any[]>> {
    // 팔로우한 인원 조회
    const followUsers = await this.followService.getFollowUsers(userId);
    const followUserIds = followUsers.map((r) => r.toUser);

    // 피드 조회, userId in (followUserIds)
    const feedPage: Pagination<any> =
      await this.feedRepository.findFeedPageByUserIds(options, followUserIds);

    // 피드 상세 형식으로 추가로 불러야할 항목들 부르기
    if (feedPage.items.length > 0) {
      const feedIds: string[] = feedPage.items.map((r) => r.id);
      const feedLikes: FeedLike[] =
        await this.feedLikeRepository.findFeedLikeInFeedIdsOfUser(
          feedIds,
          userId,
        );
      const feedBookmarks: FeedBookmark[] =
        await this.feedBookmarkRepository.findFeedBookmarkInFeedIdsOfUser(
          feedIds,
          userId,
        );

      for (const feed of feedPage.items) {
        feed.likeCount = await this.feedLikeService.getCount(feed.id);
        feed.likeUsers = await this.feedLikeRepository.getFeedLikeUsersOfLimit(
          feed.id,
        );
        feed.commentCount = await this.feedCommentService.getCount(feed.id);

        if (feedLikes.length > 0) {
          const isLike = feedLikes.filter(
            (feedLike) => feedLike.feedId === feed.id,
          ).length;
          feed.isLike = isLike > 0;
        }
        if (feedBookmarks.length > 0) {
          const isBookmark = feedBookmarks.filter(
            (feedBookmark) => feedBookmark.feedId === feed.id,
          ).length;
          feed.isBookmark = isBookmark > 0;
        }
      }
    }
    return feedPage;
  }

  async findByPageOverBookmark(
    options: IPaginationOptions,
    userId: string,
  ): Promise<Pagination<any[]>> {
    // 팔로우한 인원 조회
    const bookmarkFeeds = await this.feedBookmarkRepository.find({
      userId: userId,
    });
    const bookmarkFeedIds = bookmarkFeeds.map((r) => r.feedId);

    // 피드 조회, userId in (followUserIds)
    const feedPage: Pagination<any> =
      await this.feedRepository.findFeedPageByFeedIds(options, bookmarkFeedIds);

    // 피드 상세 형식으로 추가로 불러야할 항목들 부르기
    if (feedPage.items.length > 0) {
      const feedIds: string[] = feedPage.items.map((r) => r.id);
      const feedLikes: FeedLike[] =
        await this.feedLikeRepository.findFeedLikeInFeedIdsOfUser(
          feedIds,
          userId,
        );
      const feedBookmarks: FeedBookmark[] =
        await this.feedBookmarkRepository.findFeedBookmarkInFeedIdsOfUser(
          feedIds,
          userId,
        );

      for (const feed of feedPage.items) {
        feed.likeCount = await this.feedLikeService.getCount(feed.id);
        feed.likeUsers = await this.feedLikeRepository.getFeedLikeUsersOfLimit(
          feed.id,
        );
        feed.commentCount = await this.feedCommentService.getCount(feed.id);

        if (feedLikes.length > 0) {
          const isLike = feedLikes.filter(
            (feedLike) => feedLike.feedId === feed.id,
          ).length;
          feed.isLike = isLike > 0;
        }
        if (feedBookmarks.length > 0) {
          const isBookmark = feedBookmarks.filter(
            (feedBookmark) => feedBookmark.feedId === feed.id,
          ).length;
          feed.isBookmark = isBookmark > 0;
        }
      }
    }
    return feedPage;
  }

  /**
   * 비로그인 피드 상세조회
   * @param feedId
   */
  async findByFeedId(feedId: string): Promise<Feed[]> {
    const feed: Feed[] = await this.feedRepository.findByFeedId(feedId);
    if (feed.length > 0) {
      feed[0].likeCount = await this.feedLikeService.getCount(feedId);
      feed[0].likeUsers = await this.feedLikeRepository.getFeedLikeUsersOfLimit(
        feedId,
      );
      feed[0].commentCount = await this.feedCommentService.getCount(feedId);
    }
    return feed;
  }

  /**
   * 로그인 피드 상세조회 (작업중)
   * @param feedId
   * @param userId
   */
  async findByFeedIdWithUserBehavior(
    feedId: string,
    userId: string,
  ): Promise<Feed[]> {
    const feed: Feed[] = await this.feedRepository.findByFeedId(feedId);

    if (feed.length > 0) {
      feed[0].likeCount = await this.feedLikeService.getCount(feedId);
      if (feed[0].likeCount > 0) {
        feed[0].likeUsers =
          await this.feedLikeRepository.getFeedLikeUsersOfLimit(feedId);
      }
      feed[0].commentCount = await this.feedCommentService.getCount(feedId);

      const feedLikes: FeedLike[] =
        await this.feedLikeRepository.findFeedLikeInFeedIdOfUser(
          feedId,
          userId,
        );
      const feedBookmarks: FeedBookmark[] =
        await this.feedBookmarkRepository.findFeedBookmarkInFeedIdOfUser(
          feedId,
          userId,
        );

      if (feedLikes.length > 0) {
        feed[0].isLike = true;
      }
      if (feedBookmarks.length > 0) {
        feed[0].isBookmark = true;
      }
    }

    feed[0].writer.isFollow = await this.followService.checkFollowUser(
      feed[0].userId,
      userId,
    );

    return feed;
  }

  /*
   * 피드생성 - 작업 중 중단
   * 기존 피드 있을 시, 해당 정보 리턴 해야함
   * */
  async createFeed(rewrite: string, userId: string): Promise<Feed> {
    let feedRows: Feed = await this.feedRepository.findOne(
      {
        userId: userId,
        state: 'feed_state_pending',
      },
      { relations: ['pictures', 'tags'] },
    );

    // 피드 재생성 여부 확인
    if (rewrite === 'true') {
      //생성된 피드 삭제
      if (feedRows.pictures.length > 0) {
        for (const feedPicture of feedRows.pictures) {
          const fileInfo: FileDeleteDto = new FileDeleteDto();
          fileInfo.tag = 'feed';
          fileInfo.tagInId = feedRows.id;
          fileInfo.url = feedPicture.url;
          await this.fileService.deleteFile(fileInfo);
        }
      }

      if (feedRows.tags.length > 0) {
        await this.feedTagRepository.delete({ feedId: feedRows.id });
      }
      await this.feedRepository.delete({ id: feedRows.id });
      feedRows = undefined;
    }

    if (feedRows === undefined) {
      feedRows = await this.feedRepository.save({ userId: userId });
      feedRows = await this.feedRepository.findOne(
        { id: feedRows.id },
        { relations: ['pictures', 'tags'] },
      );
    }

    return feedRows;
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

  async findByLikePage(
    options: IPaginationOptions,
    feedId: string,
  ): Promise<Pagination<any>> {
    const feedLikeRows: Pagination<FeedLike> =
      await this.feedLikeRepository.findPages(options, feedId);

    return feedLikeRows;
  }

  /**
   * 피드 좋아요한 인원 리스트 조회 - 작업 완료
   * @param options
   * @param feedId
   * @param userId
   */
  async findByLikePageWithUserBehavior(
    options: IPaginationOptions,
    feedId: string,
    userId: string,
  ): Promise<Pagination<any>> {
    const feedLikeRows: Pagination<FeedLike> =
      await this.feedLikeRepository.findPages(options, feedId);

    // user별로 isFllow 추가 해야함
    if (feedLikeRows.items.length > 0) {
      const followUsers: Follow[] = await this.followService.getFollowUsers(
        userId,
      );

      feedLikeRows.items.forEach((feedLike) => {
        if (followUsers.length > 0) {
          const isFollow = followUsers.filter(
            (follow) => follow.toUser === feedLike.userId,
          ).length;

          feedLike.user.isFollow = isFollow > 0;
        }
      });
    }
    return feedLikeRows;
  }

  /**
   * 마이페이지 피드 메인 조회
   * @param userId
   * @param limit
   */
  async findMyPageFeedList(
    userId: string,
    limit: number,
  ): Promise<MypageFeedMainDto> {
    const feedList: Feed[] = await this.feedRepository
      .createQueryBuilder('feed')
      .where('feed.user_id = :userId and feed.state = :state', {
        userId,
        state: 'feed_state_posting',
      })
      .orderBy('feed.created_at', 'DESC')
      .limit(limit)
      .getMany();
    console.log('mypage feeds : ', feedList.length);

    const result: MypageFeedMainDto = new MypageFeedMainDto();

    result.feedList = feedList;

    if (feedList.length >= limit) {
      const feedCount: number = await this.feedRepository.count({
        where: { userId },
      });
      result.otherCount = feedCount - feedList.length;
    }

    return result;
  }
}
