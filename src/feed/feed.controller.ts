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
    @Param('id') id: string,
  ): Promise<void> {
    return await this.feedService.modityFeed(id, feedModifyDto);
  }

  @Delete('/:feedId')
  @ApiOperation({
    summary: '피드 삭제',
    description: '피드 삭제',
  })
  async deleteFeed(@Param('id') id: string): Promise<void> {
    return await this.feedService.deleteFeed(id);
  }

  @Post('/:feedId/picture')
  @ApiOperation({
    summary: '피드 사진 추가',
    description: '피드 사진 추가',
  })
  async createFeedPicture(@Param('id') id: string): Promise<void> {
    // 피드 사진 추가 로직
  }

  @Delete('/:feedId/picture/:url')
  @ApiOperation({
    summary: '피드 사진 삭제',
    description: '피드 사진 삭제',
  })
  async deleteFeedPicture(@Param('id') id: string, @Query('url') url: string) {
    // 피드 사진 삭제
  }

  @Post('/:feedId/tag')
  @ApiOperation({
    summary: '피드 태그 추가',
    description: '피드 태그 추가',
  })
  async createFeedTag(@Param('id') id: string): Promise<void> {
    // 피드 사진 추가 로직
  }

  @Delete('/:feedId/tag/:tagId')
  @ApiOperation({
    summary: '피드 태그 삭제',
    description: '피드 태그 삭제',
  })
  async deleteFeedTag(@Param('id') id: string, @Query('tagId') tagId: string) {
    // 피드 사진 삭제
  }

  @Post('/:feedId/like')
  @ApiOperation({
    summary: '피드 좋아요 추가',
    description: '피드 좋아요 추가',
  })
  async createFeedLike(@Param('id') id: string): Promise<void> {
    // 피드 사진 추가 로직
  }

  @Get('/:feedId/like')
  @ApiOperation({
    summary: '피드 좋아요 조회',
    description: '피드 좋아요 목록 조회',
  })
  async getFeedLike(@Param('id') id: string): Promise<void> {
    // 피드 사진 추가 로직
  }

  @Delete('/:feedId/like')
  @ApiOperation({
    summary: '피드 좋아요 삭제',
    description: '피드 좋아요 취소',
  })
  async deleteFeedLike(@Param('id') id: string, @Query('tagId') tagId: string) {
    // 피드 사진 삭제
  }
}
