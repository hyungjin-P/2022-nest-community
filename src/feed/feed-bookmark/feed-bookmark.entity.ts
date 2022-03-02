import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('feed_bookmark')
export class FeedBookmark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  feedId: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  /* 북마크 여부 */
  isBookmark = false;
}
