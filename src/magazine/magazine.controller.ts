import { Body, Controller, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MagazineEntity } from './magazine.entity';
import { MagazineService } from './magazine.service';

@ApiTags('매거진')
@Controller('magazine')
export class MagazineController {
  constructor(private readonly magazineService: MagazineService) {}

  @Post('/')
  @ApiOperation({
    summary: '매거진 생성',
    description: '매거진 생성',
  })
  async createMagazine(
    @Body() magazine: MagazineEntity,
    @Query() rewrite: boolean,
  ) {
    console.log(magazine);
    magazine.rewrite = rewrite;
    return this.magazineService.create(magazine);
  }
}
