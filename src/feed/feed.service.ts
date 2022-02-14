import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedRepository } from './feed.repository';
import { Feed } from './feed.entity';
import { ExtractJwt } from 'passport-jwt';
import fromAuthHeaderWithScheme = ExtractJwt.fromAuthHeaderWithScheme;
import { getRepository } from 'typeorm';
import { User } from '../user/user.entity';
import { FeedModifyDto } from './dto/feed.modify.dto';

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
    return await this.feedRepository.findOne({ id });
  }

  async createFeed(feed: Feed) {
    let feedRows: Feed = await this.feedRepository.findOne({
      userId: feed.userId,
    });

    // 피드 재생성 여부 확인
    if (feed.rewrite && feedRows !== undefined) {
      //생성된 피드 삭제
      await this.feedRepository.delete({ id: feedRows.id });
      feedRows = undefined;
    }

    if (feedRows === undefined) {
      await this.feedRepository.save(feed);
    }

    // 기존에 피드 있을 시, 해당 정보 리턴
  }

  async modityFeed(id: string, feedModifyDto: FeedModifyDto): Promise<void> {
    const feedNew = await this.feedRepository.findOne(id);
    feedNew.content = feedModifyDto.content;
    feedNew.picture = feedModifyDto.picture;
    if (feedModifyDto.posting) {
      feedNew.content = 'feed_state_posting';
    }
    await this.feedRepository.save(feedNew);
  }

  async deleteFeed(id: string): Promise<void> {
    const feedDelete = await this.feedRepository.findOne(id);
    feedDelete.deletedAt = new Date();

    await this.feedRepository.save(feedDelete);
  }
}
