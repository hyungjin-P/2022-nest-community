import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPictureRepository } from './user-picture.repository';
import { File } from '../../file/file.entity';

@Injectable()
export class UserPictureService {
  constructor(
    @InjectRepository(UserPictureRepository)
    private userPictureRepository: UserPictureRepository,
  ) {}
}
