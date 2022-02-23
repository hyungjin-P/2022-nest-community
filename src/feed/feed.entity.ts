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

  // @OneToMany(() => FeedTag, (tags) => tags.feed)
  tags: FeedTag[];

  tagsStr: string;

  like?: boolean;

  likeUsers?: User[];

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Swagger 송신 테스트 용도
  @ApiProperty({ default: false })
  rewrite: boolean;

  pictureCount?: number;
  likeCount?: number;
  commentCount?: number;
}
