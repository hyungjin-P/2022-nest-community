import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class magazinePictureEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  magazineId: string;
  name: string;
  url: string;

  @CreateDateColumn()
  createdAt: Date;
}
