import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BriefService } from './brief.service';
import { BriefController } from './brief.controller';
import { Brief } from './brief.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brief])],
  controllers: [BriefController],
  providers: [BriefService],
})
export class BriefModule {}