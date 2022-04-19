import { Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { FollowService } from './follow.service';
import { Follow } from './follow.entity';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('팔로우')
@Controller('follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  /**
   * 팔로우 추가
   * @param fromUser 로그인 유저
   * @param toUser 팔로우 할 유저
   */
  @Post('/addFollow')
  async addFollow(
    @Query('fromUser') fromUser: string,
    @Query('toUser') toUser: string,
  ): Promise<Follow> {
    return await this.followService.addFollow(fromUser, toUser);
  }

  @Delete('/removeFollow')
  async removeFollow(
    @Query('fromUser') fromUser: string,
    @Query('toUser') toUser: string,
  ): Promise<any> {
    return await this.followService.removeFollow(fromUser, toUser);
  }

  @Get('/countFollow')
  @ApiOperation({
    summary: '유저의 팔로워 수 조회',
    description: '유저의 팔로워 수 조회',
  })
  @ApiCreatedResponse({
    description: '유저의 팔로워 수를 조회한다.',
  })
  async countFollowerAndFollowing(
    @Query('userId') userId: string,
  ): Promise<any> {
    return await this.followService.countFollowerAndFollowingOfUser(userId);
  }
}
