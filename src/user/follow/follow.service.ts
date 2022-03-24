import { Injectable } from '@nestjs/common';
import { FollowRepository } from './follow.repository';
import { Follow } from './follow.entity';

@Injectable()
export class FollowService {
  constructor(private readonly followRepository: FollowRepository) {}

  async pushFollow(userId: string): Promise<void> {}

  async popFollow(userId: string): Promise<void> {}

  async getMyFollowCount(userId: string): Promise<void> {}

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

    if (follow) {
      return true;
    } else {
      return false;
    }
  }

  async getFollowUsers(userId: string) {
    return await this.followRepository.find({ fromUser: userId });
  }
}
