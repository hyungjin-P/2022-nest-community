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
  fromUser: string;

  @Column()
  toUser: string;

  @CreateDateColumn()
  createdAt: Date;
}
