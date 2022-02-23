import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { Feed } from './feed.entity';
import { FeedService } from './feed.service';
import { FeedModifyDto } from './dto/feed.modify.dto';
import { FeedTag } from './feed-tag/feed-tag.entity';
import { FeedTagService } from './feed-tag/feed-tag.service';
import { FeedLikeService } from './feed-like/feed-like.service';
import { FeedLike } from './feed-like/feed-like.entity';
import { CodeCategory } from '../codes/code-category/code-category.entity';

@ApiTags('피드')
@Controller('feed')
export class FeedController {
  constructor(
    private feedService: FeedService,
    private feedTagService: FeedTagService,
    private feedLikeService: FeedLikeService,
  ) {}

  @Post('/')
  @ApiOperation({
    summary: '피드 생성',
    description: '피드 생성',
  })
  async createFeed(
    @Body() feed: Feed,
    @Param() rewrite: boolean,
  ): Promise<void> {
    feed.rewrite = rewrite;
    return await this.feedService.createFeed(feed);
  }

  @Post('/:feedId')
  @ApiOperation({
    summary: '피드 수정',
    description: '피드 수정',
  })
  @ApiCreatedResponse({
    description: '피드 1건 수정',
    type: CodeCategory,
  })
  async modifyFeed(
    @Body() feedModifyDto: FeedModifyDto,
    @Param('feedId') feedId: string,
  ): Promise<Feed> {
    return await this.feedService.modifyFeed(feedId, feedModifyDto);
  }

  @Delete('/:feedId')
  @ApiOperation({
    summary: '피드 삭제',
    description: '피드 삭제',
  })
  @ApiCreatedResponse({
    description: '피드 1건 삭제',
    type: CodeCategory,
  })
  async deleteFeed(@Param('feedId') feedId: string): Promise<void> {
    return await this.feedService.deleteFeed(feedId);
  }

  @Post('/:feedId/tag')
  @ApiOperation({
    summary: '피드 태그 추가',
    description: '피드 태그 추가',
  })
  async createFeedTag(
    @Param('feedId') feedId: string,
    @Query('name') name: string,
  ): Promise<FeedTag> {
    return await this.feedTagService.createFeedTag(feedId, name);
  }

  @Delete('/:feedId/tag/:tagId')
  @ApiOperation({
    summary: '피드 태그 삭제',
    description: '피드 태그 삭제',
  })
  async deleteFeedTag(
    @Param('feedId') feedId: string,
    @Param('tagId') tagId: string,
  ) {
    return await this.feedTagService.deleteFeedTag(feedId, tagId);
  }

  @Post('/:feedId/like')
  @ApiOperation({
    summary: '피드 좋아요 추가',
    description: '피드 좋아요 추가',
  })
  async createFeedLike(
    @Param('feedId') feedId: string,
    @Query('userId') userId: string,
  ): Promise<void> {
    return await this.feedLikeService.createFeedLike(feedId, userId);
  }

  @Get('/:feedId/like')
  @ApiOperation({
    summary: '피드 좋아요 조회',
    description: '피드 좋아요 목록 조회',
  })
  async getFeedLike(@Param('feedId') feedId: string): Promise<any[]> {
    return await this.feedLikeService.findByFeedId(feedId);
  }

  @Delete('/:feedId/like')
  @ApiOperation({
    summary: '피드 좋아요 삭제',
    description: '피드 좋아요 취소',
  })
  async deleteFeedLike(
    @Param('feedId') feedId: string,
    @Query('userId') userId: string,
  ) {
    return await this.feedLikeService.deleteFeedLike(feedId, userId);
  }
}
