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
import { MagazineRepository } from './magazine.repository';
import { MagazineBookmarkService } from './magazine-bookmark/magazine-bookmark.service';
import { MagazineBookmarkEntity } from './magazine-bookmark/magazine-bookmark.entity';
import { MagazineBookmarkRepository } from './magazine-bookmark/magazine-bookmark.repository';
import { PublicMagazineController } from './public/public.magazine.controller';
import { MagazineBodyEnService } from './magazine-body-en/magazine-body-en.service';
import { MagazineBodyKoService } from './magazine-body-ko/magazine-body-ko.service';
import { MagazineBodyKoRepository } from './magazine-body-ko/magazine-body-ko.repository';
import { MagazineBodyEnRepository } from './magazine-body-en/magazine-body-en.repository';
import { MagazineViewsService } from './magazine-views/magazine-views.service';
import { MagazineViewsRepository } from './magazine-views/magazine-views.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MagazineRepository,
      MagazineCommentRepository,
      MagazineLikeRepository,
      MagazinePictureRepository,
      MagazineTagRepository,
      MagazineBookmarkRepository,
      MagazineBodyEnRepository,
      MagazineBodyKoRepository,
      MagazineViewsRepository,
    ]),
  ],
  controllers: [MagazineController, PublicMagazineController],
  providers: [
    MagazineService,
    MagazineCommentService,
    MagazineLikeService,
    MagazinePictureService,
    MagazineTagService,
    MagazineBookmarkService,
    MagazineBodyEnService,
    MagazineBodyKoService,
    MagazineViewsService,
  ],
})
export class MagazineModule {}
