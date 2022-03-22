import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FeedService } from '../feed.service';
import { Feed } from '../feed.entity';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CodeItem } from '../../codes/code-item/code-item.entity';
import { CodeCategory } from '../../codes/code-category/code-category.entity';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FeedCommentService } from '../feed-comment/feed-comment.service';

@ApiTags('피드(공개)')
@Controller()
export class PublicFeedController {
  constructor(
    private feedService: FeedService,
    private feedCommentService: FeedCommentService,
  ) {}

  @Get('/public/feed/findPages')
  @ApiOperation({
    summary: '피드 페이지 조회',
    description: '피드 페이지 조회',
  })
  @ApiCreatedResponse({
    description: '피드 페이지를 조회한다.',
    type: CodeItem,
  })
  async findByPublicFeedPages(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Pagination<any>> {
    return await this.feedService.findByPage({
      page,
      limit,
      route: '/public/feed/findPages',
    });
  }

  @Get('/public/authFeed')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: '피드 테스트',
    description: '피드 테스트',
  })
  @ApiCreatedResponse({
    description: '피드 권한 테스트',
    type: CodeItem,
  })
  @ApiBearerAuth('accessToken') //
  async authFeed(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Pagination<Feed>> {
    return await this.feedService.findByPage({
      page,
      limit,
      route: '/public/authFeed',
    });
  }

  @Get('/public/feed/findById')
  @ApiOperation({
    summary: '피드 1건 상세 조회',
    description: '피드 1건 상세 조회',
  })
  @ApiCreatedResponse({
    description: '피드 1건을 상세조회한다.',
    type: CodeCategory,
  })
  async findByPublicFeedById(@Query('feedId') feedId: string): Promise<Feed[]> {
    return await this.feedService.findByFeedId(feedId);
  }

  @Get('/public/feed/like/findPages')
  @ApiOperation({
    summary: '피드 좋아요 조회',
    description: '피드 좋아요 조회',
  })
  @ApiCreatedResponse({
    description: '피드 좋아요를 페이지형식으로 조회한다.',
    type: CodeItem,
  })
  async findFeedLikePage(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('feedId') feedId: string,
  ): Promise<Pagination<any>> {
    return await this.feedService.findByLikePage(
      {
        page,
        limit,
        route: '/public/feed/like/findPages',
      },
      feedId,
    );
  }

  @Get('public/feed/comment/findPages')
  @ApiOperation({
    summary: '피드 댓글 조회',
    description: '피드 댓글 조회',
  })
  @ApiCreatedResponse({
    description: '댓글을 페이지 별로 조회한다.',
    type: CodeItem,
  })
  async findFeedCommentPage(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('feedId') feedId: string,
  ): Promise<Pagination<any>> {
    return await this.feedCommentService.findByPage(
      {
        page,
        limit,
        route: '/public/feed/comment/findPages',
      },
      feedId,
    );
  }

  @Get('public/feed/comment/sub/findPages')
  @ApiOperation({
    summary: '대댓글 조회',
    description: '피드 대댓글 조회',
  })
  @ApiCreatedResponse({
    description: '대댓글을 페이지 별로 조회한다.',
    type: CodeItem,
  })
  async findFeedSubCommentPage(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('feedCommentId') feedCommentId: string,
  ): Promise<Pagination<any>> {
    return await this.feedCommentService.findSubByPage(
      {
        page,
        limit,
        route: '/public/feed/comment/sub/findPages',
      },
      feedCommentId,
    );
  }
}
