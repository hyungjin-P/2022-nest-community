import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fromUser: string; // 누가

  @Column()
  toUser: string; // 누구를

  @CreateDateColumn()
  createdAt: Date;
}
