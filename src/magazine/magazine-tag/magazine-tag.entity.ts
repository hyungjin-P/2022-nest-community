import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class magazineTagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  magazineId: string;
  name: string;

  @CreateDateColumn()
  createdAt: Date;
}
