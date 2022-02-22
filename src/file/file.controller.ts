import {
  Body,
  Controller,
  Delete,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileUploadDto } from './dto/file.upload.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileDeleteDto } from './dto/file.delete.dto';

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
    @Body() filesInfo: FileUploadDto,
  ) {
    return this.fileService.uploadFile(files, filesInfo);
  }

  @Delete('/')
  @ApiOperation({
    summary: '파일 삭제',
    description: '파일 삭제',
  })
  async deleteObject(@Body() fileInfo: FileDeleteDto) {
    return this.fileService.deleteFile(fileInfo);
  }

  @Delete('/deleteUserBackground')
  @ApiOperation({
    summary: '파일 삭제',
    description: '파일 삭제',
  })
  async deleteFileForPost(@Query('fileUrl') fileUrl: string): Promise<void> {
    const fileInfo: FileDeleteDto = new FileDeleteDto();
    fileInfo.tag = 'user-background';
    fileInfo.url = fileUrl;
    await this.fileService.deleteFile(fileInfo);
  }
}
