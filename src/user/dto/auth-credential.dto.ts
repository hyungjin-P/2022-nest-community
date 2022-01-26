import { IsString, MaxLength, MinLength } from 'class-validator';

export class UserCredentialsDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
