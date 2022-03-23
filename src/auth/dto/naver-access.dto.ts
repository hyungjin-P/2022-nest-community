import { IsNotEmpty } from 'class-validator';

export class NaverAccessDto {
  @IsNotEmpty()
  code: string;
}
