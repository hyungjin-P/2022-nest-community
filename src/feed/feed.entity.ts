import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Feed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
}
