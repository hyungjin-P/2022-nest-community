import { EntityRepository, Repository } from 'typeorm';
import { Follow } from './follow.entity';

@EntityRepository(Follow)
export class FollowRepository extends Repository<Follow> {
  /**
   * 내가 팔로우 한 사람
   */
  async getFollowList(userId: string, page: number, pageSize): Promise<void> {

  }

  /**
   * 선택한 유저의 팔로워
   */
  async findFollowPageByFrom(userId: string): Promise<void> {

  }

  /**
   * 팔로우 수
   *
   */
  async getFollowCount(userId: string): Promise<void> {}

  /**
   * 팔로우 삭제
   */
  async deleteFollow(): Promise<void> {

  }

}
