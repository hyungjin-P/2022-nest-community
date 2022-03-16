import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  ViewColumn,
  ViewEntity,
} from 'typeorm';
import { UserPicture } from '../user-picture/user-picture.entity';
import { Feed } from '../../feed/feed.entity';
import { FeedLike } from '../../feed/feed-like/feed-like.entity';
import { UserBackground } from '../user-background/user-background.entity';

@Entity('user')
export class PublicUserProFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  nickname: string;

  @Column()
  email: string;

  // @ViewColumn()
  // aboutMe: string;

  @OneToMany((type) => UserPicture, (picture) => picture.user)
  picture: UserPicture[];

  @OneToMany((type) => UserBackground, (background) => background.user)
  background: UserBackground[];

  @OneToOne((type) => Feed, (feed) => feed.writer)
  feed: Feed;

  @OneToOne((type) => FeedLike, (feedlike) => feedlike.user)
  feedLike: FeedLike;
}
