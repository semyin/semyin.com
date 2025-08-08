import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from './tag.entity';
import { TagWithArticleCountDto } from './dto/tag.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class TagController {
  constructor(private readonly tagService: TagService) { }

  // 查询所有标签
  @Get()
  async findAll(
    @Query("name") name: string | undefined,
  ): Promise<Tag[]> {
    return this.tagService.findAll(name);
  }

  // 查询单个标签及其关联的文章
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<TagWithArticleCountDto> {
    return this.tagService.findOne(id);
  }

  // 创建标签
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body('name') name: string): Promise<Tag> {
    return this.tagService.create(name);
  }

  // 更新标签
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: number, @Body('name') name: string): Promise<Tag> {
    return this.tagService.update(id, name);
  }

  // 删除标签
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number): Promise<void> {
    return this.tagService.remove(id);
  }
}