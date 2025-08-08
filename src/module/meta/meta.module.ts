import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetaService } from './meta.service';
import { MetaController } from './meta.controller';
import { Meta } from './meta.entity';
import { Article } from './../article/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meta, Article])],
  providers: [MetaService],
  controllers: [MetaController],
  exports: [MetaService], // 导出MetaService
})
export class MetaModule {}
