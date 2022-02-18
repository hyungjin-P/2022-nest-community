import { CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class FeedLike {
  @PrimaryColumn()
  feedId: string;

  @PrimaryColumn()
  userId: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
  })
  createdAt: Date;
}
