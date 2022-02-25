import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsString } from 'class-validator';

@Entity()
export class FeedTag {
  @PrimaryGeneratedColumn('uuid')
  @IsString()
  id: string;

  @Column()
  feedId: string;

  @Column()
  name: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
  })
  createdAt: Date;

  // @ManyToOne(() => Feed, (feed) => feed.tags)
  // feed: Feed;
}
