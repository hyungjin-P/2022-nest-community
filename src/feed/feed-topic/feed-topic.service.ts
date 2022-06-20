import { Injectable } from '@nestjs/common';
import { FeedTopicRepository } from './feed-topic.repository';

@Injectable()
export class FeedTopicService {
  constructor(private repository: FeedTopicRepository) {}

  async getTagCount(id: string) {
    return 0;
  }
}
