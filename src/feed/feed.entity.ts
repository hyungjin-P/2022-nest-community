import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Feed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ default: '40490ba6-7ad0-485b-914b-d8c3b882c799' })
  @Column()
  userId: string;

  @Column()
  state: string;

  @Column()
  content: string;

  @Column()
  picture: string;

  @Column()
  deletedAt: Date;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  // Swagger 송신 테스트 용도
  @ApiProperty({ default: false })
  rewrite: boolean;

  likeUsers: any[];
}
