import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Follow {
  @PrimaryColumn()
  from: string;

  @PrimaryColumn()
  to: string;

  @CreateDateColumn()
  createAt: Date;
}
