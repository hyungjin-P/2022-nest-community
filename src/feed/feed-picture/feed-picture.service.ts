import { Injectable } from '@nestjs/common';
import { FeedPicture } from './feed-picture.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedPictureRepository } from './feed-picture.repository';
import { FileEntity } from '../../file/file.entity';

@Injectable()
export class FeedPictureService {
  constructor(
    @InjectRepository(FeedPictureRepository)
    private feedPictureRepository: FeedPictureRepository,
  ) {}

  createFeedPicture(feedId: string, uploadedFile: FileEntity[]) {
    /**
     * 아래 기능은 /file.cntroller 에서 추가적인 함수 호출로 동작.
     **/
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
