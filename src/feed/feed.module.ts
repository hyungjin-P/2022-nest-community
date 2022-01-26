import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedRepository } from './feed.repository';
import { PublicFeedController } from './public/public.feed.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FeedRepository])],
  controllers: [FeedController, PublicFeedController],
  providers: [FeedService],
})
export class FeedModule {}
