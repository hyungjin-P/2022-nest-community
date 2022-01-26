import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('사용자 정보')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/getAll')
  @ApiOperation({
    summary: '사용자 정보 전체 조회',
    description: '사용자 정보 전체 조회',
  })
  @ApiCreatedResponse({
    description: '사용자 정보를 전체조회 한다.',
    type: User,
  })
  async getAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get('/findById')
  @ApiOperation({
    summary: '사용자 id(key)로 조회',
    description: '사용자 id(key)로 조회',
  })
  @ApiCreatedResponse({
    description: '사용자를 id(key)로 1건 조회한다',
    type: User,
  })
  async findById(@Query('id') id: string): Promise<User> {
    return await this.userService.findById(id);
  }

  @Post('/modify')
  @ApiOperation({
    summary: '사용자 정보 수정',
    description: '사용자 정보 수정',
  })
  @ApiCreatedResponse({
    description: '사용자 정보를 수정한다.',
    type: User,
  })
  async modify(@Body() user: User): Promise<void> {
    await this.userService.modify(user);
  }

  @Post('/modify')
  @ApiOperation({
    summary: '사용자 정보 삭제',
    description: '사용자 정보 삭제',
  })
  @ApiCreatedResponse({
    description: '사용자 정보를 삭제한다.',
    type: User,
  })
  @Delete('/delete')
  async delete(@Query('id') id: string): Promise<void> {
    await this.userService.delete(id);
  }
}
