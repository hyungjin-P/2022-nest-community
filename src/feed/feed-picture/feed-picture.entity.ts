import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Feed } from '../feed.entity';

@Entity()
export class FeedPicture {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  feedId: string;

  @PrimaryColumn()
  url: string;

  @ManyToOne((type) => Feed, (feed) => feed.pictures)
  feed: Feed;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
  })
  created_at: Date;
}
