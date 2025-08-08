import { Controller, Post, Body, Delete, Query, Get } from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';

@Controller()
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  // 点赞
  @Post()
  async create(@Body() createLikeDto: CreateLikeDto) {
    return this.likeService.create(createLikeDto);
  }

  // 取消点赞
  @Delete()
  async remove(@Body() createLikeDto: CreateLikeDto) {
    return this.likeService.remove(createLikeDto);
  }

  // 检查是否已点赞
  @Get('check')
  async isLiked(@Query() createLikeDto: CreateLikeDto) {
    return this.likeService.isLiked(createLikeDto);
  }
}