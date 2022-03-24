import { Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { FollowService } from './follow.service';
import { Follow } from './follow.entity';
import { query } from 'express';

@Controller('follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Get('/push')
  async pushFollow(): Promise<void> {}

  @Get('/pop')
  async popFollow(): Promise<void> {}

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
}
