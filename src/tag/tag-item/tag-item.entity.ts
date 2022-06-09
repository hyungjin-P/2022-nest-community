import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MagazineTagEntity } from '../../magazine/magazine-tag/magazine-tag.entity';
import { FeedTag } from '../../feed/feed-tag/feed-tag.entity';

@Entity('tag_item')
export class TagItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nameKo: string;

  @Column()
  nameEn: string;

  feedCount: number;
  magazineCount: number;

  @OneToOne((type) => MagazineTagEntity, (magazineTag) => magazineTag.tagInfo)
  magazineTag: MagazineTagEntity;

  @OneToOne((type) => FeedTag, (feedTag) => feedTag.tagInfo)
  feedTag: MagazineTagEntity;
}
