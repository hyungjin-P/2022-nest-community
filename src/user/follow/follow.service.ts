import { Injectable } from '@nestjs/common';
import { FollowRepository } from './follow.repository';
import { Follow } from './follow.entity';
import { UserService } from '../user.service';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { User } from '../user.entity';

@Injectable()
export class FollowService {
  constructor(
    private readonly followRepository: FollowRepository,
    private userService: UserService,
  ) {}

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
      toUser: userId,
    });
    const toUserCount = await this.followRepository.count({ fromUser: userId });

    return {
      fromUserCount,
      toUserCount,
    };
  }

  /**
   * 팔로잉 조회
   * @param userId
   * @param pageOptions
   */
  async findFollowingPage(
    userId: string,
    pageOptions: IPaginationOptions,
  ): Promise<any> {
    const fromUserOptions: any = {
      where: {
        fromUser: userId,
      },
    };

    const fromUserPage = await paginate<Follow>(
      this.followRepository,
      pageOptions,
      fromUserOptions,
    );

    let fromUserList: User[];

    if (fromUserPage.items.length > 0) {
      const fromUserIds: string[] = fromUserPage.items.map(
        (fromUser) => fromUser.toUser,
      );

      fromUserList = [...(await this.userService.findUserIds(fromUserIds))];

      for (const user of fromUserList) {
        user.isFollow = await this.checkFollowUser(user.id, userId);
      }
    }

    return {
      metaInfo: {
        meta: fromUserPage.meta,
        links: fromUserPage.links,
      },
      users: fromUserList,
    };
  }

  /**
   * 팔로워 조회
   * @param userId
   * @param pageOptions
   */
  async findFollowerPage(
    userId: string,
    pageOptions: IPaginationOptions,
  ): Promise<any> {
    const fromUserOptions: any = {
      where: {
        toUser: userId,
      },
    };

    const fromUserPage = await paginate<Follow>(
      this.followRepository,
      pageOptions,
      fromUserOptions,
    );

    let toUserList: User[];

    if (fromUserPage.items.length > 0) {
      const fromUserIds: string[] = fromUserPage.items.map(
        (fromUser) => fromUser.fromUser,
      );

      toUserList = [...(await this.userService.findUserIds(fromUserIds))];

      // 나를 좋아하는 유저를 내가 팔로우 했는지
      for (const user of toUserList) {
        user.isFollow = !!(await this.followRepository.findOne({
          fromUser: userId,
          toUser: user.id,
        }));
      }
    }

    return {
      metaInfo: {
        meta: fromUserPage.meta,
        links: fromUserPage.links,
      },
      users: toUserList,
    };
  }
}
