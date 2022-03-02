import { CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class FeedLike {
  @PrimaryColumn()
  feedId: string;

  @PrimaryColumn()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  likeCount: number;
}
