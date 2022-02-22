import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({ default: '40490ba6-7ad0-485b-914b-d8c3b882c799' })
  @IsString()
  userId: string;

  @ApiProperty({ enum: ['public.keeping.link', 'storage.keeping.link'] })
  @IsString()
  domainName: string;

  @ApiProperty({ default: '/users/40490ba6-7ad0-485b-914b-d8c3b882c799/feed' })
  @IsString()
  path: string;

  @ApiProperty({ enum: ['feed', 'user-picture', 'user-background'] })
  @IsString()
  tags: string;

  @ApiProperty({ description: 'tag table id' })
  @IsString()
  tagInId: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  @IsString()
  files: any[];
}
