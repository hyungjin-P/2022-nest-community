import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('magazine_tag')
export class MagazineTagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  magazineId: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;
}
