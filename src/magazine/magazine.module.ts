import { Module } from '@nestjs/common';
import { MagazineController } from './magazine.controller';
import { MagazineService } from './magazine.service';
import { MagazinePictureService } from './magazine-picture/magazine-picture.service';
import { MagazineCommentService } from './magazine-comment/magazine-comment.service';
import { MagazineLikeService } from './magazine-like/magazine-like.service';
import { MagazineTagService } from './magazine-tag/magazine-tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { magazineCommentRepository } from './magazine-comment/magazine-comment.repository';
import { magazineLikeRepository } from './magazine-like/magazine-like.repository';
import { magazinePictureRepository } from './magazine-picture/magazine_picture.repository';
import { magazineTagRepository } from './magazine-tag/magazine-tag.repository';
import { magazineRepository } from './magazine.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      magazineRepository,
      magazineCommentRepository,
      magazineLikeRepository,
      magazinePictureRepository,
      magazineTagRepository,
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
