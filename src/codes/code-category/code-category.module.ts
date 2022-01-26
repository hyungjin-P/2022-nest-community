import { Module } from '@nestjs/common';
import { CodeCategoryController } from './code-category.controller';
import { CodeCategoryService } from './code-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeCategoryRepository } from './code-category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CodeCategoryRepository])],
  controllers: [CodeCategoryController],
  providers: [CodeCategoryService],
})
export class CodeCategoryModule {}
