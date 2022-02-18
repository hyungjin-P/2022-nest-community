import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Follow {
  @PrimaryColumn()
  id: string;

  @Column()
  fromUser: string;

  @Column()
  toUser: string;

  @CreateDateColumn()
  createAt: Date;
}
