import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
} from '@nestjs/common';
import { BriefService } from './brief.service';
import { CreateBriefDto, UpdateBriefDto } from './dto/brief.dto';

@Controller()
export class BriefController {
  constructor(private readonly briefService: BriefService) { }

  // 创建简讯
  @Post()
  async create(@Body() createBriefDto: CreateBriefDto) {
    return this.briefService.create(createBriefDto);
  }

  // 查询所有简讯
  @Get()
  async findAll() {
    return this.briefService.findAll();
  }

  // 查询单个简讯
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.briefService.findOne(id);
  }

  // 更新简讯
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateBriefDto: UpdateBriefDto) {
    return this.briefService.update(id, updateBriefDto);
  }

  // 删除简讯
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.briefService.remove(id);
  }

  // 增加浏览量
  @Patch(':id/view')
  async incrementViewCount(@Param('id') id: number) {
    return this.briefService.incrementViewCount(id);
  }

  // 增加点赞数
  @Patch(':id/like')
  async incrementLikeCount(@Param('id') id: number) {
    return this.briefService.incrementLikeCount(id);
  }

  // 增加评论数
  @Patch(':id/comment')
  async incrementCommentCount(@Param('id') id: number) {
    return this.briefService.incrementCommentCount(id);
  }
}