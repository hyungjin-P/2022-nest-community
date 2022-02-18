import { Injectable } from '@nestjs/common';
import { FollowRepository } from './follow.repository';

@Injectable()
export class FollowService {
  constructor(private readonly followRepository: FollowRepository) {}

  async pushFollow(userId: string): Promise<void> {}

  async popFollow(userId: string): Promise<void> {}

  async getMyFollowCount(userId: string): Promise<void> {}
}
