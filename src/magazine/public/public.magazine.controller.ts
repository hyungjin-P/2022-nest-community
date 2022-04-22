import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { MagazineService } from '../magazine.service';
import { CodeItem } from '../../codes/code-item/code-item.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags('매거진(공개)')
@Controller()
export class PublicMagazineController {
  constructor(private magazineService: MagazineService) {}

  @Get('/public/magazine/findTopMagazineList')
  @ApiOperation({
    summary: '매거진 상단 뷰어 조회',
    description: '매거진 상단 뷰어 조회',
  })
  @ApiCreatedResponse({
    description: '비로그인 상태의 매거진 상단 뷰어를 조회한다.',
    type: CodeItem,
  })
  async findTopMagazineList() {
    return await this.magazineService.getTopMagazineList();
  }

  @Get('/public/magazine/findPages')
  @ApiOperation({
    summary: '매거진 페이지 조회',
    description: '매거진 페이지 조회',
  })
  @ApiCreatedResponse({
    description: '비로그인 상태의 매거진 페이지를 조회한다.',
    type: CodeItem,
  })
  async findByPage(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('category') category: string,
  ): Promise<Pagination<any>> {
    return await this.magazineService.findByPage(
      {
        page,
        limit,
        route: '/public/magazine/findPages',
      },
      category,
    );
  }
}
