import { Body, Controller, Delete, Param, Post, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { Feed } from './feed.entity';
import { FeedService } from './feed.service';
import { FeedModifyDto } from './dto/feed.modify.dto';

@ApiTags('피드')
@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

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
  async modifyFeed(
    @Body() feedModifyDto: FeedModifyDto,
    @Query('id') id: string,
  ) {
    return await this.feedService.modityFeed(id, feedModifyDto);
  }

  @Delete('/:feedId')
  @ApiOperation({
    summary: '피드 삭제',
    description: '피드 삭제',
  })
  async deleteFeed(@Query('id') id: string) {
    return await this.feedService.deleteFeed(id);
  }
}
