import { Injectable } from '@nestjs/common';
import { FeedPicture } from './feed-picture.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedPictureRepository } from './feed-picture.repository';
import { File } from '../../file/file.entity';

@Injectable()
export class FeedPictureService {
  constructor(
    @InjectRepository(FeedPictureRepository)
    private feedPictureRepository: FeedPictureRepository,
  ) {}
  createFeedPicture(feedId: string, uploadedFile: File[]) {
    console.log(feedId);
    console.log(uploadedFile);
    const feedPictures = [];

    for (const file of uploadedFile) {
      const feedPicture = new FeedPicture();
      feedPicture.feedId = feedId;
      feedPicture.url = file.url;

      feedPictures.push(feedPicture);
    }
    this.feedPictureRepository.save(feedPictures);
  }

  async deleteFeedPicture(feedId: string, url: string) {
    return await this.feedPictureRepository.delete({
      feedId: feedId,
      url: url,
    });
  }
}
