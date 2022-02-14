import { Controller, Get, Param, Query } from '@nestjs/common';
import { FeedService } from '../feed.service';
import { Feed } from '../feed.entity';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CodeItem } from '../../codes/code-item/code-item.entity';
import { CodeCategory } from '../../codes/code-category/code-category.entity';

@ApiTags('피드(공개)')
@Controller()
export class PublicFeedController {
  constructor(private feedService: FeedService) {}
  @Get('/public/feed')
  @ApiOperation({
    summary: '피드 페이지 조회',
    description: '피드 페이지 조회',
  })
  @ApiCreatedResponse({
    description: '피드 페이지를 조회한다.',
    type: CodeItem,
  })
  async findByFeedPages(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ): Promise<Feed[]> {
    return await this.feedService.findByPage(page, pageSize);
  }

  @Get('/public/feed/:id')
  @ApiOperation({
    summary: '피드 1건 상세 조회',
    description: '피드 1건 상세 조회',
  })
  @ApiCreatedResponse({
    description: '피드 1건을 상세조회한다.',
    type: CodeCategory,
  })
  async findFeedDetails(@Param('id') feedId: string): Promise<Feed> {
    let feed: Feed = await this.feedService.findByFeedId(feedId);

    // feed.likeUsers = 좋아요 한 사람들 조회해서 넣고

    return feed;
  }
}
