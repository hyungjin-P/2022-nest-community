import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Magazine } from '../magazine.entity';
import { TagItem } from '../../tag/tag-item/tag-item.entity';

@Entity('magazine_tag', {
  orderBy: {
    createdAt: 'DESC',
  },
})
export class MagazineTagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  magazineId: string;

  @Column()
  nameKo: string;

  @Column()
  nameEn: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne((type) => Magazine, (magazine) => magazine.tags)
  magazine: Magazine;
}
