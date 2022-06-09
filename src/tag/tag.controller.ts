import { Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';
import { TagItem } from './tag-item/tag-item.entity';

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

  @Post('/addTag')
  @ApiOperation({
    summary: '태그 추가',
    description: '관리자 태그 추가',
  })
  async createTag(
    @Query('nameKo') nameKo: string,
    @Query('nameEn') nameEn: string,
  ): Promise<TagItem> {
    return await this.tagService.createTag(nameKo, nameEn);
  }

  @Post('/modifyTag')
  @ApiOperation({
    summary: '태그 수정',
    description: '관리자 태그 수정',
  })
  async modifyTag(
    @Query('tagId') tagId: string,
    @Query('nameKo') nameKo: string,
    @Query('nameEn') nameEn: string,
  ): Promise<TagItem> {
    return await this.tagService.modifyTag(tagId, nameKo, nameEn);
  }

  @Delete('/deleteTag')
  @ApiOperation({
    summary: '태그 삭제',
    description: '관리자 태그 삭제',
  })
  async deleteTag(@Query('tagId') tagId: string) {
    return await this.tagService.deleteTag(tagId);
  }
}
