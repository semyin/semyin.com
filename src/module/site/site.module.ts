import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Site } from './site.entity';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';
import { MetaModule } from '../meta/meta.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Site]), // 注册 Site 实体
    MetaModule, // 导入 MetaModule
  ],
  providers: [SiteService], // 注册 SiteService
  controllers: [SiteController], // 注册 SiteController
  exports: [SiteService], // 导出 SiteService
})
export class SiteModule {}
