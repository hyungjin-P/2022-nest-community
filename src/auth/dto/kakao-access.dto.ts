import { IsNotEmpty } from 'class-validator';

export class KakaoAccessDto {
  @IsNotEmpty()
  accessToken: string;
}
