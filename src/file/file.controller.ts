import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { fileUploadDto } from './dto/file.upload.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('파일')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/')
  @ApiOperation({
    summary: '파일 S3 업로드',
    description: '파일 S3 업로드',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadObject(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() filesInfo: fileUploadDto,
  ) {
    return this.fileService.uploadFile(files, filesInfo);
  }

  @Delete('/:url')
  @ApiOperation({
    summary: '파일 삭제',
    description: '파일 삭제',
  })
  async deleteObject(@Param('url') url: string) {
    return this.fileService.deleteFile(url);
  }
}
