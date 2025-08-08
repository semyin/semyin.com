import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendLinkService } from './friend-link.service';
import { FriendLinkController } from './friend-link.controller';
import { FriendLink } from './friend-link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FriendLink])],
  providers: [FriendLinkService],
  controllers: [FriendLinkController],
})
export class FriendLinkModule {}