import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), TagModule], // 注册 Article 实体, 导入 TagModule
  controllers: [ArticleController], // 注册控制器
  providers: [ArticleService], // 注册服务
})
export class ArticleModule {}
