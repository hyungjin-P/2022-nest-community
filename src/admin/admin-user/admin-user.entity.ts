import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/user.entity';
import { CodeAuthority } from '../code-authority/code-authority.entity';

@Entity('admin_user')
export class AdminUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  codeAuthorityId: string;

  @Column()
  userName: string;

  @Column()
  descriptionText: string;

  @Column()
  modifyAt: Date;

  @CreateDateColumn()
  createAt: Date;

  user: User;

  codeAuthority: CodeAuthority;
}
