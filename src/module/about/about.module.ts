import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';
import { About } from './about.entity';
import { MetaModule } from '../meta/meta.module';

@Module({
  imports: [TypeOrmModule.forFeature([About]), MetaModule],
  controllers: [AboutController],
  providers: [AboutService],
  exports: [AboutService],
})
export class AboutModule {}