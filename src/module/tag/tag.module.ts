import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { Tag } from './tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])], // 注册 Tag 实体
  controllers: [TagController],
  providers: [TagService],
  exports: [TypeOrmModule]
})
export class TagModule {}
