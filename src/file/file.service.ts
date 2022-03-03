import { BadRequestException, Injectable } from '@nestjs/common';
import AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { FileRepository } from './file.repository';
import { FileEntity } from './file.entity';
import { v4 as uuidv4 } from 'uuid';
import { FileUploadDto } from './dto/file.upload.dto';
import { FileTagRepository } from './file-tag.repository';
import { FileTag } from './file-tag.entity';
import { FeedPictureService } from '../feed/feed-picture/feed-picture.service';
import { FileDeleteDto } from './dto/file.delete.dto';
import { UserBackgroundService } from '../user/user-background/user-background.service';
import { UserPictureService } from '../user/user-picture/user-picture.service';
import { MagazinePictureService } from '../magazine/magazine-picture/magazine-picture.service';

@Injectable()
export class FileService {
  constructor(
    private readonly configService: ConfigService,
    private readonly fileRepository: FileRepository,
    private readonly fileTagRepository: FileTagRepository,
    private readonly feedPictureService: FeedPictureService,
    private readonly userBackgroundService: UserBackgroundService,
    private readonly userPictureService: UserPictureService,
    private readonly magazinePictureService: MagazinePictureService,
  ) {}

  async uploadFile(files, filesInfo: FileUploadDto): Promise<FileEntity[]> {
    AWS.config.update({
      accessKeyId: this.configService.get('AWS_SES_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SES_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_SES_REGION'),
    });
    const s3 = new AWS.S3();

    console.log('fileInfo : ', filesInfo);

    // 도메인 검사
    const domainNames = ['public.keeping.link', 'storage.keeping.link'];
    const domainName = filesInfo.domainName;

    if (!domainNames.includes(domainName)) {
      throw new Error('invalid domain_name');
    }

    // 경로 검사
    const pathRegex = /^(\/[0-9a-zA-Z\-]+)*\/?$/;
    const path = filesInfo.path;

    if (pathRegex.test(path)) {
    } else {
      throw new Error('invalid path');
    }

    // RDS 저장 위한 공간배열
    const uploadFiles = [];
    const uploadFilesTag = [];

    // 다중 파일 저장을 위해 키값을 따로 지정
    for (const file of files) {
      const fileName = uuidv4();
      let key = `${path}/${fileName}`;
      key = key.replace(/\/\//gi, '/');
      key = key.slice(1, key.length);

      const param = {
        Bucket: domainName,
        Body: file.buffer,
        Key: key,
      };

      try {
        //업로드
        const stored = await s3.upload(param).promise();

        // RDS 저장 - fileTag
        const uploadFileTag = new FileTag();
        uploadFileTag.id = uuidv4();
        uploadFileTag.userId = filesInfo.userId;
        uploadFileTag.bucket = stored.Bucket;
        uploadFileTag.key = stored.Key;
        uploadFileTag.name = filesInfo.tag;

        uploadFilesTag.push(uploadFileTag);

        // RDS 저장 - file
        const uploadFile = new FileEntity();
        uploadFile.userId = filesInfo.userId;
        uploadFile.url = `https://${domainName}/${stored.Key}`;
        uploadFile.originalname = file.originalname;
        uploadFile.encoding = file.encoding;
        uploadFile.mimetype = file.mimetype;
        uploadFile.size = file.size;
        uploadFile.bucket = stored.Bucket;
        uploadFile.key = stored.Key;
        uploadFile.location = stored.Location;
        uploadFile.etag = stored.ETag;

        uploadFiles.push(uploadFile);

        // 저장 방지 임시 동작
        if (filesInfo.tag === 'magazine') {
          return uploadFiles;
        }
      } catch (e) {
        throw new Error(e);
      }
    }

    try {
      const result = await this.fileRepository.save(uploadFiles);
      await this.fileTagRepository.save(uploadFilesTag);

      // 테이블 분류에 따른 데이터 저장 로직
      if (filesInfo.tag === 'feed') {
        this.feedPictureService.createFeedPicture(
          filesInfo.tagInId,
          uploadFiles,
        );
      } else if (filesInfo.tag === 'user-picture') {
        await this.userPictureService.createUserPicture(
          filesInfo.userId,
          uploadFiles,
        );
      } else if (filesInfo.tag === 'user-background') {
        await this.userBackgroundService.createUserBackground(
          filesInfo.userId,
          uploadFiles,
        );
      } else if (filesInfo.tag === 'magazine') {
        await this.magazinePictureService.createMagazinePicture(
          filesInfo.tagInId,
          uploadFiles,
        );
      }
      console.log('result: ', result);
      return result;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async deleteFile(fileInfo: FileDeleteDto): Promise<void> {
    AWS.config.update({
      accessKeyId: this.configService.get('AWS_SES_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SES_SECRET_ACCESS_KEY'),
      region: this.configService.get('process.env.AWS_SES_REGION'),
    });
    const s3 = new AWS.S3();

    const file = await this.fileRepository.findOne({ url: fileInfo.url });
    await s3
      .deleteObject({
        Bucket: file.bucket,
        Key: file.key,
      })
      .promise();

    const tag = await this.fileTagRepository.findOne({
      bucket: file.bucket,
      key: file.key,
    });

    // tag에 따라 서비스 분기
    if (fileInfo.tag === 'feed') {
      await this.feedPictureService.deleteFeedPicture(
        fileInfo.tagInId,
        file.url,
      );
    } else if (fileInfo.tag === 'user-picture') {
      // this.fileService.uploadUserPicture(uploadedFile);
    } else if (fileInfo.tag === 'user-background') {
      await this.userBackgroundService.deleteUserBackground(file.url);
    } else if (fileInfo.tag === 'magazine') {
      await this.magazinePictureService.deleteMagazinePicture(
        fileInfo.tagInId,
        file.url,
      );
    }

    await this.fileTagRepository.delete(tag.id);
    await this.fileRepository.delete({ url: file.url });
  }
}
