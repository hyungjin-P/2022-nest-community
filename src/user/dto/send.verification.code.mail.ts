import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendVerificationCodeMail {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  languege: string;
}
