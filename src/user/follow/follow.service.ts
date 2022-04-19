import { Injectable } from '@nestjs/common';
import { FollowRepository } from './follow.repository';
import { Follow } from './follow.entity';

@Injectable()
export class FollowService {
  constructor(private readonly followRepository: FollowRepository) {}

  async addFollow(fromUser: string, toUser: string): Promise<Follow> {
    return await this.followRepository.save({
      fromUser: fromUser,
      toUser: toUser,
    });
  }

  async removeFollow(fromUser: string, toUser: string): Promise<any> {
    const follow: Follow = await this.followRepository.findOne({
      fromUser: fromUser,
      toUser: toUser,
    });

    if (follow) {
      return await this.followRepository.delete(follow.id);
    }
  }

  async checkFollowUser(checkUserId: string, userId: string): Promise<boolean> {
    const follow: Follow = await this.followRepository.findOne({
      fromUser: userId,
      toUser: checkUserId,
    });

    return !!follow;
  }

  async getFollowUsers(userId: string): Promise<Follow[]> {
    return await this.followRepository.find({ fromUser: userId });
  }

  async countFollowerAndFollowingOfUser(userId: string): Promise<any> {
    const fromUserCount = await this.followRepository.count({
      fromUser: userId,
    });
    const toUserCount = await this.followRepository.count({ toUser: userId });

    return {
      fromUserCount,
      toUserCount,
    };
  }
}
