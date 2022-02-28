import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class magazineEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  uesrId: string;

  state: string;

  @Column()
  content: string;

  @DeleteDateColumn()
  deletedAt: Date;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updateAt: Date;
}
