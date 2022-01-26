import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedRepository } from './feed.repository';
import { Feed } from './feed.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedRepository)
    private feedRepository: FeedRepository,
  ) {}

  async findByPage(page: number, pageSize: number): Promise<Feed[]> {
    return this.feedRepository.find({ skip: page, take: pageSize });
  }

  async findByFeedId(id: string): Promise<Feed> {
    return await this.feedRepository.findOne(id);
  }
}
