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

@ApiTags('피드(공개)')
@Controller()
export class PublicFeedController {
  constructor(private feedService: FeedService) {}

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
      route: '/public/feed',
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

  @Get('/public/feed/findPageOne')
  @ApiOperation({
    summary: '피드 1건 상세 조회',
    description: '피드 1건 상세 조회',
  })
  @ApiCreatedResponse({
    description: '피드 1건을 상세조회한다.',
    type: CodeCategory,
  })
  async findFeedDetails(@Query('feedId') feedId: string): Promise<Feed> {
    return await this.feedService.findByFeedId(feedId);
  }
}
