import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';

@ApiTags('태그')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('/findTagList')
  @ApiOperation({
    summary: '태그 검색하여 리스트 찾기',
    description: '태그 검색하여 리스트 찾기',
  })
  async findTagList(@Query('name') name: string) {
    return await this.tagService.getTagList(name);
  }
}
