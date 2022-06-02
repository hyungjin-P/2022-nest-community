import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class UserFilteringDto {
  @ApiProperty()
  @IsNumber()
  page: number;

  @ApiProperty()
  @IsNumber()
  limit: number;

  @ApiProperty()
  @IsString()
  nickname: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsDate()
  fromDate: Date;

  @ApiProperty()
  @IsDate()
  toDate: Date;
}
