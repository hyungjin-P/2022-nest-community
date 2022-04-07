import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Feed } from '../feed.entity';

export class MypageFeedMainDto {
  @IsString()
  feedList: Feed[];

  @IsString()
  otherCount: number = 0;
}
