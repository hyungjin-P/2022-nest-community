import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { FeedPicture } from './feed-picture/feed-picture.entity';
import { FeedTag } from './feed-tag/feed-tag.entity';

@Entity()
export class Feed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
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

  tags: FeedTag[];

  tagsStr: string;

  like?: boolean;

  likeUsers?: User[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  rewrite: boolean;

  pictureCount?: number;

  likeCount?: number;

  commentCount?: number;

  // 유저가 좋아요한 피드인지
  isLike = false;

  /* 북마크 여부 */
  isBookmark = false;
}
