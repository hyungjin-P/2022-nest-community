import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('magazine')
export class MagazineEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty({ default: 'a41d829e-add3-4867-9429-0eca34fc1e48' })
  userId: string;

  @Column()
  state: string;

  @Column()
  content: string;

  @DeleteDateColumn()
  deletedAt: Date;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  // Swagger 송신 테스트 용도
  @ApiProperty({ default: false })
  rewrite: boolean;
}
