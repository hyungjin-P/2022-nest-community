import { Module } from '@nestjs/common';
import { CodeItemController } from './code-item.controller';
import { CodeItemService } from './code-item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeItemRepository } from './code-item.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CodeItemRepository])],
  controllers: [CodeItemController],
  providers: [CodeItemService],
})
export class CodeItemModule {}
