import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';

@Entity('magazine')
export class MagazineEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ default: 'a41d829e-add3-4867-9429-0eca34fc1e48' })
  @Column()
  userId: string;

  writer: User;

  @ApiProperty({
    enum: ['magazine_category_news', 'magazine_category_release'],
  })
  @Column()
  category: string;

  @Column()
  state: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  picture: string;

  @DeleteDateColumn()
  deletedAt: Date;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  // Swagger 송신 테스트 용도
  @ApiProperty({ default: false })
  rewrite: boolean;

  /* 좋아요 여부 */
  isLike = false;

  /* 북마크 여부 */
  isBookmark = false;
}
