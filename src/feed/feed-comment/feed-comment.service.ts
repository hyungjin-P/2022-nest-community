import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedCommentRepository } from './feed-comment.repository';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { FeedComment } from './feed-comment.entity';
import { FeedLike } from '../feed-like/feed-like.entity';
import { FeedCommentLikeRepository } from './commnet-like/comment-like.repository';
import { FeedCommentLike } from './commnet-like/commnet-like.entity';
import { FeedCommentLikeService } from './commnet-like/comment-like.service';

@Injectable()
export class FeedCommentService {
  constructor(
    @InjectRepository(FeedCommentRepository)
    private feedCommentRepository: FeedCommentRepository,
    private feedCommentLikeRepository: FeedCommentLikeRepository,

    private feedCommentLikeService: FeedCommentLikeService,
  ) {}

  /*
   * 댓글 생성, 조회, 수정, 삭제 추가 해야함.
   * 가능하다면 댓글에서 언급을 통해 대댓글을 표시하고자 함.
   * 초기 구상 => 테이블 신규 생성해서 댓글id, 언급 유저id로 언급 상태를 저장. (대댓글, 팔로우와 유사 기능)
   * 대댓글 조회
   * */
  async getCount(feedId: string) {
    return await this.feedCommentRepository.count({ feedId });
  }

  async findByPage(
    options: IPaginationOptions,
    feedId: string,
  ): Promise<Pagination<any>> {
    const commentPage: Pagination<any> =
      await this.feedCommentRepository.findCommentPages(options, feedId);

    if (commentPage.items.length > 0) {
      for (const comment of commentPage.items) {
        comment.likeCount = await this.feedCommentLikeService.getCount(
          comment.id,
        );
      }
    }

    return commentPage;
  }

  async findSubByPage(
    options: IPaginationOptions,
    feedCommentId: string,
  ): Promise<Pagination<any>> {
    const subCommentPage: Pagination<any> =
      await this.feedCommentRepository.findSubCommentPage(
        options,
        feedCommentId,
      );

    if (subCommentPage.items.length > 0) {
      for (const comment of subCommentPage.items) {
        comment.likeCount = await this.feedCommentLikeService.getCount(
          comment.id,
        );
      }
    }

    return subCommentPage;
  }

  async findByPageWithUserBehavior(
    options: IPaginationOptions,
    feedId: string,
    userId: string,
  ): Promise<Pagination<any>> {
    const commentPage: Pagination<any> =
      await this.feedCommentRepository.findCommentPages(options, feedId);

    // 댓글 좋아요 불러와야 함.
    if (commentPage.items.length > 0) {
      const commentIds: string[] = commentPage.items.map((r) => r.id);
      const commentLikes: FeedCommentLike[] =
        await this.feedCommentLikeRepository.findCommentLikeInCommentIdsOfUser(
          commentIds,
          userId,
        );

      for (const comment of commentPage.items) {
        //like Count
        comment.likeCount = await this.feedCommentLikeService.getCount(
          comment.id,
        );

        //isLike
        if (commentLikes.length > 0) {
          const isLike = commentLikes.filter(
            (commentLike) => commentLike.feedCommentId === comment.id,
          ).length;
          comment.isLike = isLike > 0;
        }
      }
    }

    return commentPage;
  }

  async findSubByPageWithUserBehavior(
    options: IPaginationOptions,
    feedCommentId: string,
    userId: string,
  ): Promise<Pagination<any>> {
    const subCommentPage: Pagination<any> =
      await this.feedCommentRepository.findSubCommentPage(
        options,
        feedCommentId,
      );

    // 댓글 좋아요 불러와야 함.
    if (subCommentPage.items.length > 0) {
      const commentIds: string[] = subCommentPage.items.map((r) => r.id);
      const commentLikes: FeedCommentLike[] =
        await this.feedCommentLikeRepository.findCommentLikeInCommentIdsOfUser(
          commentIds,
          userId,
        );
      if (commentLikes.length > 0) {
        for (const comment of subCommentPage.items) {
          //like Count
          comment.likeCount = await this.feedCommentLikeService.getCount(
            comment.id,
          );

          //isLike
          if (commentLikes.length > 0) {
            const isLike = commentLikes.filter(
              (commentLike) => commentLike.feedCommentId === comment.id,
            ).length;
            comment.isLike = isLike > 0;
          }
        }
      }
    }

    return subCommentPage;
  }

  async createFeedComment(feedComment: FeedComment): Promise<FeedComment> {
    return await this.feedCommentRepository.save(feedComment);
  }

  async modifyFeedComment(
    feedCommentId: string,
    text: string,
  ): Promise<FeedComment> {
    return await this.feedCommentRepository.save({
      id: feedCommentId,
      text: text,
    });
  }

  async deleteFeedComment(feedCommentId: string): Promise<FeedComment> {
    const feedCommentRows: FeedComment =
      await this.feedCommentRepository.findOne({ id: feedCommentId });

    feedCommentRows.deletedAt = new Date();
    return await this.feedCommentRepository.save(feedCommentRows);
  }
}
