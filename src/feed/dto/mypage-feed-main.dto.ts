import { IsNumber, IsString } from 'class-validator';
import { Feed } from '../feed.entity';

export class MypageFeedMainDto {
  @IsString()
  feedList: Feed[];

  @IsNumber()
  otherCount: number = 0;

  @IsNumber()
  totalCount: number = 0;
}
