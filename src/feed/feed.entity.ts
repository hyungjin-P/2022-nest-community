import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { FeedPicture } from './feed-picture/feed-picture.entity';
import { FeedTag } from './feed-tag/feed-tag.entity';

@Entity()
export class Feed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ default: '40490ba6-7ad0-485b-914b-d8c3b882c799' })
  userId: string;

  writer: User;

  @Column()
  state: string;

  @Column()
  content: string;

  @Column()
  picture: string;

  pictures: FeedPicture[];

  tags?: FeedTag[];

  tagsStr: string;

  like?: boolean;

  likeUsers?: User[];

  @Column()
  deletedAt: Date;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  // Swagger 송신 테스트 용도
  @ApiProperty({ default: false })
  rewrite: boolean;

  likeCount?: number;
  commentCount?: number;
}
