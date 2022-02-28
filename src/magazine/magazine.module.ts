import { Module } from '@nestjs/common';
import { MagazineController } from './magazine.controller';
import { MagazineService } from './magazine.service';
import { MagazinePictureService } from './magazine-picture/magazine-picture.service';
import { MagazineCommentService } from './magazine-comment/magazine-comment.service';
import { MagazineLikeService } from './magazine-like/magazine-like.service';
import { MagazineTagService } from './magazine-tag/magazine-tag.service';

@Module({
  controllers: [MagazineController],
  providers: [MagazineService, MagazinePictureService, MagazineCommentService, MagazineLikeService, MagazineTagService]
})
export class MagazineModule {}
