import { Module } from '@nestjs/common';
import { DetailController } from './detail.controller';

@Module({
  controllers: [DetailController],
})
export class DetailModule {}
