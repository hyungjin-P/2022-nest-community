import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider: string;

  @Column()
  providedId: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  nickname: string;

  @Column()
  age: number;

  @Column()
  sex: string;

  @Column()
  WbirthDate: string;

  @Column()
  email: string;

  @Column()
  emailVerified: number;

  @Column()
  emailVerificationCode: number;

  @Column()
  emailVerificationCodeExpiresin: Date;

  @Column()
  emailToChange: string;

  @Column()
  phoneNumber: string;

  @Column()
  phoneNumberVerified: boolean;

  @Column()
  phoneNumberVerificationCode: number;

  @Column()
  phoneNumberVerificationCodeExpiresin: Date;

  @Column()
  phoneNumberToChange: boolean;

  @Column()
  resetPasswordLinkUsed: boolean;

  @Column()
  color: string;

  @Column()
  fcmToken: string;

  @Column()
  aboutMe: string;

  @Column()
  agreementAge: boolean;

  @Column()
  agreementPrivacy: boolean;

  @Column()
  agreementServiceTerms: boolean;

  @Column()
  agreementMarketing: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
