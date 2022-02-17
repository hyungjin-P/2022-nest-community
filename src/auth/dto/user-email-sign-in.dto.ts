import { IsNotEmpty, IsString } from 'class-validator';

export class UserEmailSignInDto {
  @IsNotEmpty()
  @IsString()
  providedId: string;

  @IsString()
  password: string;
}
