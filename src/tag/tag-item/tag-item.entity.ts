import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tag_item')
export class TagItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nameKo: string;

  @Column()
  nameEn: string;
}
