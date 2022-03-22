import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('feed_comment_like')
export class FeedCommentLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  feedCommentId: string;
  @Column()
  userId: string;
}
