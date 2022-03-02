import { Module } from '@nestjs/common';
import { MagazineController } from './magazine.controller';
import { MagazineService } from './magazine.service';
import { MagazinePictureService } from './magazine-picture/magazine-picture.service';
import { MagazineCommentService } from './magazine-comment/magazine-comment.service';
import { MagazineLikeService } from './magazine-like/magazine-like.service';
import { MagazineTagService } from './magazine-tag/magazine-tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MagazineCommentRepository } from './magazine-comment/magazine-comment.repository';
import { MagazineLikeRepository } from './magazine-like/magazine-like.repository';
import { MagazinePictureRepository } from './magazine-picture/magazine_picture.repository';
import { MagazineTagRepository } from './magazine-tag/magazine-tag.repository';
import { magazineRepository } from './magazine.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      magazineRepository,
      MagazineCommentRepository,
      MagazineLikeRepository,
      MagazinePictureRepository,
      MagazineTagRepository,
    ]),
  ],
  controllers: [MagazineController],
  providers: [
    MagazineService,
    MagazineCommentService,
    MagazineLikeService,
    MagazinePictureService,
    MagazineTagService,
  ],
})
export class MagazineModule {}
