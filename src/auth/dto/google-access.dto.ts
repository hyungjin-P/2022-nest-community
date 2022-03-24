import { IsNotEmpty } from 'class-validator';

export class GoogleAccessDto {
  @IsNotEmpty()
  accessToken: string;
}
