import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FeedCommentService } from './feed-comment.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CodeItem } from '../../codes/code-item/code-item.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags('피드 댓글')
@Controller('/feed/comment')
export class FeedCommentController {
  constructor(private feedCommentService: FeedCommentService) {}

  @Get('/findPages')
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
    @Query('userId') userId: string,
  ): Promise<Pagination<any>> {
    return await this.feedCommentService.findByPage(
      {
        page,
        limit,
        route: '/feed/comment/findPages',
      },
      userId,
    );
  }
}
