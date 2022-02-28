import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsString } from 'class-validator';

@Entity()
export class magazineCommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  magazineId: string;
  userId: string;
  parentId: string;

  @Column()
  @IsString()
  text: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
