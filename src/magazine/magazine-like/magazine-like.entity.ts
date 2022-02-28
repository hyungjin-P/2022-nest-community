import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class magazineLikeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  magazineId: string;

  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
