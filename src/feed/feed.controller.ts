import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Feed } from './feed.entity';
import { FeedService } from './feed.service';
import { FeedModifyDto } from './dto/feed.modify.dto';
import { FeedTag } from './feed-tag/feed-tag.entity';
import { FeedTagService } from './feed-tag/feed-tag.service';
import { FeedLikeService } from './feed-like/feed-like.service';
import { CodeCategory } from '../codes/code-category/code-category.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CodeItem } from '../codes/code-item/code-item.entity';
import { FeedLikeDto } from './dto/feed-like.dto';
import { FeedBookmarkDto } from './dto/feed-bookmark.dto';
import { FeedBookmarkService } from './feed-bookmark/feed-bookmark.service';

@ApiTags('피드')
@Controller('feed')
export class FeedController {
  constructor(
    private feedService: FeedService,
    private feedTagService: FeedTagService,
    private feedLikeService: FeedLikeService,
    private feedBookmarkService: FeedBookmarkService,
  ) {}

  @Get('/findPages')
  @ApiOperation({
    summary: '피드 페이지 조회',
    description: '피드 페이지 조회',
  })
  @ApiCreatedResponse({
    description: '피드 페이지를 조회한다.',
    type: CodeItem,
  })
  async findFeedPage(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('userId') userId: string,
  ): Promise<Pagination<any>> {
    return await this.feedService.findByPageWithBookmarkAndLike(
      {
        page,
        limit,
        route: '/feed/findPages',
      },
      userId,
    );
  }
  @Get('/findById')
  @ApiOperation({
    summary: '피드 1건 상세 조회',
    description: '피드 1건 상세 조회',
  })
  @ApiCreatedResponse({
    description: '피드 1건을 상세조회한다.',
    type: CodeCategory,
  })
  async findByPublicFeedById(
    @Query('feedId') feedId: string,
    @Query('userId') userId: string,
  ): Promise<Feed[]> {
    return await this.feedService.findByFeedIdWithUserBehavior(feedId, userId);
  }

  @Post('/modifyFeed')
  @ApiOperation({
    summary: '피드 수정',
    description: '피드 수정',
  })
  @ApiCreatedResponse({
    description: '피드 1건 수정',
    type: CodeCategory,
  })
  async modifyFeed(@Body() feedModifyDto: FeedModifyDto): Promise<Feed> {
    return await this.feedService.modifyFeed(
      feedModifyDto.feedId,
      feedModifyDto,
    );
  }

  @Delete('/deleteFeed')
  @ApiOperation({
    summary: '피드 삭제',
    description: '피드 삭제',
  })
  @ApiCreatedResponse({
    description: '피드 1건 삭제',
    type: CodeCategory,
  })
  async deleteFeed(@Query('feedId') feedId: string): Promise<void> {
    return await this.feedService.deleteFeed(feedId);
  }

  @Post('/addFeedTag')
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

  @Delete('/deleteFeedTag')
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

  @Post('/addLike')
  @ApiOperation({
    summary: '피드 좋아요 추가',
    description: '피드 좋아요 추가',
  })
  async createFeedLike(@Body() feedLikeDto: FeedLikeDto): Promise<number> {
    return await this.feedLikeService.createFeedLike(
      feedLikeDto.feedId,
      feedLikeDto.userId,
    );
  }

  @Delete('/deleteLike')
  @ApiOperation({
    summary: '피드 좋아요 취소',
    description: '피드 좋아요 취소',
  })
  async deleteFeedLike(
    @Query('feedId') feedId: string,
    @Query('userId') userId: string,
  ): Promise<number> {
    return await this.feedLikeService.deleteFeedLike(feedId, userId);
  }

  @Post('/createFeed')
  @ApiOperation({
    summary: '피드 생성',
    description: '피드 생성',
  })
  async createFeed(
    @Body() feed: Feed,
    @Query('rewrite') rewrite: boolean,
  ): Promise<void> {
    feed.rewrite = rewrite;
    return await this.feedService.createFeed(feed);
  }

  @Post('/addBookmark')
  @ApiOperation({
    summary: '피드 북마크 추가',
    description: '피드 북마크 추가',
  })
  @ApiCreatedResponse({
    description: '북마크를 추가한다',
    type: CodeCategory,
  })
  async addBookmark(@Body() feedBookmarkDto: FeedBookmarkDto): Promise<void> {
    await this.feedBookmarkService.addBookmark(feedBookmarkDto);
  }

  @Delete('/deleteBookmark')
  @ApiOperation({
    summary: '피드 북마크 삭제',
    description: '피드 북마크 삭제',
  })
  @ApiCreatedResponse({
    description: '북마크를 삭제한다',
    type: CodeCategory,
  })
  async deleteBookmark(
    @Query('feedId') feedId: string,
    @Query('userId') userId: string,
  ): Promise<void> {
    await this.feedBookmarkService.deleteBookmark({ feedId, userId });
  }
}
